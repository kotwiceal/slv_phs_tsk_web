"""Thesing module of database manager sysmtem."""

def test_table_methods(dbms_t, table):
    """Test auto-build SQL queries."""
    # create test data
    table_name, attributes, data = table  

    # create test table
    dbms_t.create(table, attributes)
    # insert data
    dbms_t.insert(table_name, data)
    # query data
    result = dbms_t.select(table_name)
    
    assert result == 1
    