from flask import Flask, render_template, request, redirect, url_for
from models import db, Contact


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/skills.html')
def skills():
    return render_template('skills.html')

@app.route('/projects.html')
def projects():
    return render_template('projects.html')

@app.route('/experience.html')
def experience():
    return render_template('experience.html')

@app.route('/contact.html', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        new_contact = Contact(name=name, email=email, message=message)
        db.session.add(new_contact)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('contact.html')


if __name__ == '__main__':
    app.run(debug=True)
