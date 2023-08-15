"""This module provide functional of flex database comminication."""

import psycopg2, json, os

class DBMS:
    """Management system in order to comminicate postgresql server."""
    
    def __init__(self, filename = 'database_config.json') -> None:
        try:
            with open(os.path.join(os.path.dirname(__file__), filename)) as file:
                self._parameters = json.load(file)
            if 'postgresql' in self._parameters:
                self.connection = psycopg2.connect(**self._parameters['postgresql'])
                print('DBMS: test connection is success')
                self.connection.close()
            else:
                raise Exception("DBMS: file configuration structure isn't correct")
        except (Exception, IOError, psycopg2.DatabaseError) as error:
            print(error)
    
    @staticmethod
    def _execute_query(function):
        def wrapper(self, **kwargs):
            try:
                self.connection = psycopg2.connect(**self._parameters['postgresql'])
                with self.connection:
                    with self.connection.cursor() as cursor:
                        result = function(self, cursor = cursor, **kwargs)
            except (Exception, psycopg2.DatabaseError) as error:
                result = None
                print(error)
            finally:
                if self.connection is not None:
                    self.connection.close()
                return result
        return wrapper

    @_execute_query
    def create(self, **kwargs) -> None:
        table_name = kwargs['table_name']
        attributes = kwargs['attributes']
        cursor = kwargs['cursor']
        attributes_parse: str = json.dumps(attributes)
        for i in ['{', '}', ':', '"']:
            attributes_parse = attributes_parse.replace(i, '')
        cursor.execute(f'DROP TABLE IF EXISTS {table_name}')
        cursor.execute(f'CREATE TABLE IF NOT EXISTS {table_name} ({attributes_parse})')
       
    @_execute_query
    def insert(self, **kwargs) -> None:
        table_name = kwargs['table_name']
        data = kwargs['data']
        cursor = kwargs['cursor']
        columns = ','.join(data.keys())
        placeholder= ','.join([f'%({key})s' for key in data.keys()])
        cursor.execute(f'INSERT INTO {table_name} ({columns}) VALUES ({placeholder})', data)
    
    @_execute_query
    def select(self, **kwargs):
        table_name = kwargs['table_name']
        cursor = kwargs['cursor']
        cursor.execute(f'SELECT * FROM {table_name}')
        result = cursor.fetchall()
        return result

    def _build_schema(self):
        # create table to store results of classical gravitation task
        table_name = 'task_clsgrv'
        attributes = dict(task_id = 'VARCHAR(255) PRIMARY KEY', t = 'FLOAT[]', r = 'FLOAT[][][]', dr = 'FLOAT[][][]')
        self.create(table_name = table_name, attributes = attributes)
        
        # create table to store worker information
        table_name = 'worker'
        attributes = dict(worker_id = 'VARCHAR(255) FOREIGN KEY REFERENCES task_clsgrv(task_id)', name = 'VARCHAR(255)', pid = 'INT', time = 'FLOAT')
        self.create(table_name = table_name, attributes = attributes)
        
    def close(self):
        try:
            self.connection.close()
        finally:
            pass
    
    