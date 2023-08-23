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

class Task(db.Model):
    """Table to store task sessions."""
    __tabname__ = 'task_session'
    task_id = db.Column(db.String, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def __repr__(self):
        return f'<{self.__tabname__} {self.task_id}>'