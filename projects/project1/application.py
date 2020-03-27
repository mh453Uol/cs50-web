import os

from flask import Flask, session, request, render_template, redirect, url_for
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from passlib.hash import pbkdf2_sha256

from .models.user import User

app = Flask(__name__,
            static_url_path='',
            static_folder='web/static',
            template_folder='web/templates')

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "GET":
        return render_template("register.html")

    if request.method == "POST":
        email = request.form.get("emailInput")
        firstname = request.form.get("firstnameInput")
        lastname = request.form.get("lastnameInput")
        password = request.form.get("passwordInput")
        confirm_password = request.form.get("confirmPasswordInput")

        user = User(email, firstname, lastname, password, confirm_password)

        if not user.is_valid():
            model = user.model_state()
            return render_template("register.html", model_state=model)

        # 1. Email should not exist
        # 2. Hash password

        users = db.execute(
            'SELECT * FROM "user" WHERE email = :email', {"email": email})

        if users.rowcount > 0:
            model = user.model_state()
            model['email']['valid'] = False

            return render_template("register.html", model_state=model)
        else:
            # Hash the password using SHA256
            hashed_password = pbkdf2_sha256.hash(password)

            # User does not exist add them to db
            db.execute('''INSERT INTO "user" (id, email, password, firstname, lastname) 
                VALUES (:id, :email, :password, :firstname, :lastname)''',
                       {"id": user.id, "email": email, "password": hashed_password,
                        "firstname": firstname, "lastname": lastname})

            db.commit()

            return redirect(url_for('index'))


@app.route("/")
def index():
    return render_template("index.html")
