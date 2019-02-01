from flask import Blueprint, render_template, jsonify, g, current_app

bp = Blueprint('view', __name__)


@bp.before_request
def before_request():
    g.lib = current_app.config['lib']


@bp.route('/')
def home():
    return render_template('index.html')


@bp.route('/foo/')
def foo():
    return jsonify(['hoho'])


@bp.route('/album/')
@bp.route('/album/query/')
def all_albums():
    a = g.lib.albums()
    return jsonify('Albums')
