"""Testing module of user login."""
from src import models

def test_sign_in(app_t):
    """Test sigin authorization"""
    with app_t.app_context():
        user = models.User.query.filter_by(id = 1).first()
    with app_t.test_client(user = user) as client:
        client.get('/')
