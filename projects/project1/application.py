import os

from flask import Flask, session, request, render_template, redirect, url_for, flash, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from werkzeug.security import generate_password_hash, check_password_hash
from .models.user import User
from .models.book import Book
import jsons

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
    session.clear()

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

        hashed_password = user["password"]

        if user is not None and check_password_hash(hashed_password, password):
            session["user_id"] = user["id"]
            session["email"] = email

            return redirect(url_for('index'))

        flash("Please provide a valid email and password.", "error")
        return render_template("login.html", model_state=model)


@app.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route("/suggestions", methods=["GET"])
def suggestions():
    query = request.args.get('q', default='', type=str)

    if len(query) < 1:
        return {
            'query': f'Query must be atleast 1 charectars - {query}'
        }

    # Search by ISBN number of a book, the title of a book, or the author of a book

    # SQL Wildcard - Anything that begins with
    # Lowers and handles other special language charectars
    query = query.casefold()
    query = f"{query}%"

    search_results = db.execute("""SELECT * FROM book WHERE isbn LIKE :query 
        OR lower(title) LIKE :query 
        OR lower(author) LIKE :query
        LIMIT 10""",{"query": query})

    print(search_results.rowcount)
    books = []

    for result in search_results:
        books.append(
            Book(result['isbn'], result['title'],
                 result['author'], result['year'])
        )

        print(result['isbn'], result['title'],
              result['author'], result['year'])

    json = {
        'query': request.args.get('q'),
        'data': jsons.dump(books)
    }

    return json


@app.route("/books", methods=["GET"])
def books_search_results():
    query = request.args.get('q', default='', type=str)
    isbn = request.args.get('isbn', default='', type=str)
    book = None

    query = query.casefold()
    query = f"{query}%"

    if isbn:
        click_book = db.execute("SELECT * FROM book WHERE isbn = :isbn", {"isbn": isbn}).fetchone()
        book = Book(click_book['isbn'], click_book['title'], click_book['author'], click_book['year'])

    search_results = db.execute("""SELECT * FROM book WHERE (isbn LIKE :query 
        OR lower(title) LIKE :query 
        OR lower(author) LIKE :query)
        AND isbn != :isbn
        ORDER BY title
        LIMIT 100""", {"query": query, "isbn": isbn})

    print(search_results.rowcount)

    books = []

    for result in search_results:
        books.append(
            Book(result['isbn'], result['title'],
                 result['author'], result['year'])
        )

    model = {
        'query': request.args.get('q'),
        'book': book,
        'books': books
    }

    return render_template("books.html", model=model)


def isLoggedIn():
    return "user_id" in session
