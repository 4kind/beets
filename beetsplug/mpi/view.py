from flask import Blueprint, render_template

bp = Blueprint('view', __name__)


# UI.
@bp.route('/')
def home():
    return render_template('index.html')
