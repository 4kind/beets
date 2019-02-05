from flask import Blueprint, render_template, g, current_app, send_file
from beetsplug.mpi.utils import resource_list, resource_query, resource
import os
from unidecode import unidecode
from beets import util

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


@bp.route('/item/<int:item_id>/file')
def item_file(item_id):
    item = g.lib.get_item(item_id)

    # On Windows under Python 2, Flask wants a Unicode path. On Python 3, it
    # *always* wants a Unicode path.
    if os.name == 'nt':
        item_path = util.syspath(item.path)
    else:
        item_path = util.py3_path(item.path)

    try:
        unicode_item_path = util.text_string(item.path)
    except (UnicodeDecodeError, UnicodeEncodeError):
        unicode_item_path = util.displayable_path(item.path)

    base_filename = os.path.basename(unicode_item_path)
    try:
        # Imitate http.server behaviour
        base_filename.encode("latin-1", "strict")
    except UnicodeEncodeError:
        safe_filename = unidecode(base_filename)
    else:
        safe_filename = base_filename

    response = send_file(
        item_path,
        as_attachment=True,
        attachment_filename=safe_filename
    )
    response.headers['Content-Length'] = os.path.getsize(item_path)
    return response
