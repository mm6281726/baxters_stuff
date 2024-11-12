import os

from flask import Flask
from app.auth import auth
from app.db import database
from app.home import home

def create_app(test_config=None):
    app = Flask(__name__)

    setup_config(app, test_config)
    register_blueprints(app)
    init_db(app)

    return app

def setup_config(app, test_config):
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'baxter.sqlite'),
    )

    if test_config is None:
       app.config.from_pyfile('config.py', silent=True)
    else:
       app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

def register_blueprints(app):
    app.register_blueprint(auth.bp)
    app.register_blueprint(home.bp)

def init_db(app):
    database.init_app(app)
