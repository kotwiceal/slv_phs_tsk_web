"""This module privides authorization functional."""

from flask import Blueprint, request, jsonify, redirect
from flask_login import current_user, login_required, login_user, logout_user
from src import app, db, login_manager, models

auth = Blueprint('auth', __name__)

@login_manager.user_loader
def load_user(user_id: str):
    return models.User.query.filter(models.User.id == int(user_id)).first()
    
@auth.route('/signin', methods = ['GET', 'POST'])
def sign_in():
    if request.method == 'GET':
        response = dict(authorized = current_user.is_authenticated)
        return response
    else:
        data = request.get_json()
        user = models.User.query.filter_by(login = data['user']).first()
        if user:
            if user.check_password(data['password']):
                login_user(user, remember = False)
                return dict(message = 'User has been authorized', state = True, tasks = [])
            else:
                return dict(message = 'Invalid password', state = False, tasks = [])
        else:
            return dict(message = 'User has not been authorized: account does not exist', state = False, tasks = [])

@auth.route('/signup', methods = ['GET', 'POST'])
def sign_up():
    data = request.get_json()
    user = models.User.query.filter_by(login = data['user']).first()
    if user:
        return dict(message = 'User has not been registered: login is existed already', state = False, tasks = [])
    else:
        user = models.User(login = data['user'], password = data['password'])
        with app.app_context():
            db.session.add(user)
            db.session.commit()
        return dict(message = 'User has been registered', state = True, tasks = [])

@auth.route('/signout', methods = ['GET'])
@login_required
def sign_out():
    logout_user()
    return redirect('/')

