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
    def execute_query(parameters):
        def decorator(function):
            def wrapper(*args, **kwargs):
                try:
                    connection = psycopg2.connect(**parameters['postgresql'])
                    with connection:
                        with connection.cursor() as cursor:
                            result = function(*args, cursor = cursor, **kwargs)
                except (Exception, psycopg2.DatabaseError) as error:
                    result = []
                    print(error)
                finally:
                    if connection is not None:
                        connection.close()
                    return result
            return wrapper
        return decorator
          
    def create(self, table_name, attributes):
        try:
            connection = psycopg2.connect(**self._parameters['postgresql'])
            with connection:
                with connection.cursor() as cursor:
                    attributes_parse: str = json.dumps(attributes)
                    for i in ['{', '}', ':', '"']:
                        attributes_parse = attributes_parse.replace(i, '')
                    cursor.execute(f'DROP TABLE IF EXISTS {table_name}')
                    cursor.execute(f'CREATE TABLE IF NOT EXISTS {table_name} ({attributes_parse})')
                    
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if connection is not None:
                connection.close()
    
    def insert(self, table_name: str, data: dict) -> None:
        try:
            connection = psycopg2.connect(**self._parameters['postgresql'])
            with connection:
                with connection.cursor() as cursor:
                    columns = ','.join(data.keys())
                    placeholder= ','.join([f'%({key})s' for key in data.keys()])
                    cursor.execute(f'INSERT INTO {table_name} ({columns}) VALUES ({placeholder})', data)
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if connection is not None:
                connection.close()
                
    def select(self, table_name):
        try:
            connection = psycopg2.connect(**self._parameters['postgresql'])
            with connection:
                with connection.cursor() as cursor:
                    cursor.execute(f'SELECT * FROM {table_name}')
                    result = cursor.fetchall()
                            
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            result = None
        finally:
            if connection is not None:
                connection.close()
            return result

    def close(self):
        try:
            self.connection.close()
        finally:
            pass
    
    