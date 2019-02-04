from flask import Blueprint, render_template, g, current_app
from beetsplug.mpi.utils import resource_list, resource_query, resource

bp = Blueprint('view', __name__)


@bp.before_request
def before_request():
    g.lib = current_app.config['lib']


@bp.route('/')
def home():
    return render_template('index.html')


@bp.route('/album/')
@bp.route('/album/query/')
@resource_list('albums')
def all_albums():
    return g.lib.albums()


@bp.route('/album/<idlist:ids>')
@resource('albums')
def get_album(id):
    return g.lib.get_album(id)


@bp.route('/album/query/<query:queries>')
@resource_query('albums')
def album_query(queries):
    return g.lib.albums(queries)


@bp.route('/item/query/<query:queries>')
@resource_query('items')
def item_query(queries):
    return g.lib.items(queries)
