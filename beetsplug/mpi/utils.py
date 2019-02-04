import json
import os
import base64
from beets import util
import beets.library
from flask import Blueprint, current_app as app
import flask

bp = Blueprint('utils', __name__)


def _rep(obj, expand=False):
    """Get a flat -- i.e., JSON-ish -- representation of a beets Item or
    Album object. For Albums, `expand` dictates whether tracks are
    included.
    """
    out = dict(obj)

    if isinstance(obj, beets.library.Item):
        #if app.config.get('INCLUDE_PATHS', False):
        #    out['path'] = util.displayable_path(out['path'])
        #else:
        #    del out['path']

        # Filter all bytes attributes and convert them to strings.
        for key, value in out.items():
            if isinstance(out[key], bytes):
                out[key] = base64.b64encode(value).decode('ascii')

        # Get the size (in bytes) of the backing file. This is useful
        # for the Tomahawk resolver API.
        try:
            out['size'] = os.path.getsize(util.syspath(obj.path))
        except OSError:
            out['size'] = 0

        return out

    elif isinstance(obj, beets.library.Album):
        del out['artpath']
        if expand:
            out['items'] = [_rep(item) for item in obj.items()]
    return out


def json_generator(items, root, expand=False):
    """Generator that dumps list of beets Items or Albums as JSON
    :param root:  root key for JSON
    :param items: list of :class:`Item` or :class:`Album` to dump
    :param expand: If true every :class:`Album` contains its items in the json
                   representation
    :returns:     generator that yields strings
    """
    yield '{"%s":[' % root
    first = True
    for item in items:
        if first:
            first = False
        else:
            yield ','
        yield json.dumps(_rep(item, expand=expand))
    yield ']}'


def is_expand():
    """Returns whether the current request is for an expanded response."""

    return flask.request.args.get('expand') is not None


def resource(name):
    """Decorates a function to handle RESTful HTTP requests for a resource.
    """

    def make_responder(retriever):
        def responder(ids):
            entities = [retriever(id) for id in ids]
            entities = [entity for entity in entities if entity]

            if len(entities) == 1:
                return flask.jsonify(_rep(entities[0], expand=is_expand()))
            elif entities:
                return app.response_class(
                    json_generator(entities, root=name),
                    mimetype='application/json'
                )
            else:
                return flask.abort(404)

        responder.__name__ = 'get_{0}'.format(name)
        return responder

    return make_responder


def resource_list(name):
    """Decorates a function to handle RESTful HTTP request for a list of
    resources.
    """

    def make_responder(list_all):
        def responder():
            return app.response_class(
                json_generator(list_all(), root=name, expand=is_expand()),
                mimetype='application/json'
            )

        responder.__name__ = 'all_{0}'.format(name)
        return responder

    return make_responder


def resource_query(name):
    """Decorates a function to handle RESTful HTTP queries for resources.
    """

    def make_responder(query_func):
        def responder(queries):
            return app.response_class(
                json_generator(
                    query_func(queries),
                    root='results', expand=is_expand()
                ),
                mimetype='application/json'
            )

        responder.__name__ = 'query_{0}'.format(name)
        return responder

    return make_responder
