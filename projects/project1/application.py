import os

from flask import Flask, session, request, render_template, redirect, url_for, flash
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from werkzeug.security import generate_password_hash, check_password_hash
from .models.user import User

app = Flask(__name__,
            static_url_path='',
            static_folder='web/static',
            template_folder='web/templates')

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"), echo=True)
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
            'SELECT * FROM "application_user" WHERE email = :email', {"email": email})

        if users.rowcount > 0:
            flash("Please provide a valid email and password.")
            model = user.model_state()
            return render_template("register.html", model_state=model)
        else:
            # Hash the password using SHA256
            hashed_password = generate_password_hash(password)

            # User does not exist add them to db
            db.execute('''INSERT INTO "application_user" (id, email, password, firstname, lastname) 
                VALUES (:id, :email, :password, :firstname, :lastname)''',
                       {"id": user.id, "email": email, "password": hashed_password,
                        "firstname": firstname, "lastname": lastname})

            db.commit()

            return redirect(url_for('login'))


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")

    if request.method == "POST":
        email = request.form.get("emailInput")
        password = request.form.get("passwordInput")

        user = User(email, None, None, password, None)

        model = user.model_state()

        if not email:
            return render_template("login.html", model_state=model)

        if not password:
            return render_template("login.html", model_state=model)

        user = db.execute("SELECT id, password FROM application_user WHERE email = :email",
            {"email": email}).fetchone()

        print(user)

        hashed_password = user["password"]

        print(f"***{hashed_password}***")

        if user is not None and check_password_hash(hashed_password, password):
            return redirect(url_for('index'))

        flash("Please provide a valid email and password.", "error")
        return render_template("login.html", model_state=model)
