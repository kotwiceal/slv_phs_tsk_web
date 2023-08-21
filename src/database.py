"""This module provides table pattern."""

from src import db

class User(db.Model):
    """Table to store user data."""
    __tabname__ = 'user'
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    login = db.Column(db.String)
    password = db.Column(db.String)

class Task_clsgrv(db.Model):
    """Table to store classical gravitation task result."""
    __tabname__ = 'task_clsgrv'
    task_id = db.Column(db.String, primary_key = True)
    t = db.Column(db.ARRAY(db.Float))
    r = db.Column(db.ARRAY(db.Float))
    dr = db.Column(db.ARRAY(db.Float))