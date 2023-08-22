"""This module provides models of database."""

from src import db, bcrypt
from flask_login import UserMixin

class User(UserMixin, db.Model):
    """Table to store user data."""
    __tabname__ = 'user'
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    login = db.Column(db.String)
    password = db.Column(db.String)
    
    def __init__(self, login, password):
        self.login = login
        self.passwrod = bcrypt.generate_password_hash(password)
        
    def __repr__(self):
        return f'<user {self.login}>'

class Task_clsgrv(db.Model):
    """Table to store classical gravitation task result."""
    __tabname__ = 'task_clsgrv'
    task_id = db.Column(db.String, primary_key = True)
    t = db.Column(db.ARRAY(db.Float))
    r = db.Column(db.ARRAY(db.Float))
    dr = db.Column(db.ARRAY(db.Float))
        