import os

from flask import Flask, session, request, render_template
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

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
        password = request.form.get("passwordInput")
        confirm_password = request.form.get("confirmPasswordInput")

        user = User(email, password, confirm_password)

        model = user.isValid()

        model["validated"] = True
    
        return render_template("register.html", model_state=model)


@app.route("/")
def index():
    return render_template("index.html")
