from flask_frozen import Freezer
from app import app

freezer = Freezer(app)

@freezer.register_generator
def index():
    yield '/'

@freezer.register_generator
def skills():
    yield '/skills.html'

@freezer.register_generator
def projects():
    yield '/projects.html'

@freezer.register_generator
def experience():
    yield '/experience.html'

@freezer.register_generator
def contact():
    yield '/contact.html'

if __name__ == '__main__':
    freezer.freeze()
