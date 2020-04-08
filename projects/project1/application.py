import os
from urllib.parse import urlparse

from flask import Flask, session, request, render_template, redirect, url_for, flash
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from werkzeug.security import generate_password_hash, check_password_hash
from .models.user import User
from .models.book import Book
from .models.review import Review
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
    recently_added = db.execute("SELECT * from book ORDER BY created DESC LIMIT 9").fetchall()

    #print(recently_added)

    books = []

    for book in recently_added:
        books.append(Book(book['isbn'], book['title'], book['author'], book['year'], book['created']))


    return render_template("index.html", books = books)

@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()

    redirect_to = request.args.get('redirectTo', default='/', type=str)

    if not safe_redirect(redirect_to):
        redirect_to = url_for('index')

    if request.method == "GET":
        return render_template("login.html", redirectTo=redirect_to)

    if request.method == "POST":
        email = request.form.get("emailInput")
        password = request.form.get("passwordInput")

        user = User(email, None, None, password, None)

        model = user.model_state()
        
        if not email:
            return render_template("login.html", model_state=model, redirectTo=redirect_to)

        if not password:
            return render_template("login.html", model_state=model, redirectTo=redirect_to)

        user = db.execute("SELECT id, password FROM application_user WHERE email = :email",
                          {"email": email}).fetchone()

        hashed_password = user["password"]

        if user is not None and check_password_hash(hashed_password, password):
            session["user_id"] = user["id"]
            session["email"] = email

            return redirect(redirect_to)

        flash("Please provide a valid email and password.", "error")
        return render_template("login.html", model_state=model, redirectTo=redirect_to)


@app.route("/logout", methods=["GET"])
def logout():

    redirect_to = request.args.get('redirectTo', default='/', type=str)

    session.clear()

    if safe_redirect(redirect_to):
        return redirect(redirect_to)

    return redirect(url_for('index'))


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
        LIMIT 10""", {"query": query})

    print(search_results.rowcount)
    books = []

    for result in search_results:
        books.append(
            Book(result['isbn'], result['title'],
                 result['author'], result['year'], result['created'])
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
        click_book = db.execute(
            "SELECT * FROM book WHERE isbn = :isbn", {"isbn": isbn}).fetchone()
        book = Book(click_book['isbn'], click_book['title'],
                    click_book['author'], click_book['year'], click_book['created'])

    search_results = db.execute("""SELECT * FROM book WHERE (isbn LIKE :query
        OR lower(title) LIKE :query
        OR lower(author) LIKE :query)
        AND isbn != :isbn
        ORDER BY title
        LIMIT 50""", {"query": query, "isbn": isbn})

    print(search_results.rowcount)

    books = []

    for result in search_results:
        books.append(
            Book(result['isbn'], result['title'],
                 result['author'], result['year'], result['created'])
        )

    model = {
        'query': request.args.get('q'),
        'book': book,
        'books': books
    }

    return render_template("books.html", model=model)


@app.route("/books/<isbn>")
def book_details(isbn):

    book = db.execute(
        "SELECT * FROM book WHERE isbn = :isbn", {"isbn": isbn}).fetchone()

    if book is None:
        flash(f"Could not find book {isbn}")
        return render_template("index.html")

    reviews = db.execute(
        "SELECT * FROM review WHERE book_isbn = :isbn ORDER BY created DESC", {
            "isbn": isbn}
    )

    book_model = Book(book['isbn'], book['title'],
                      book['author'], book['year'], book['created'])

    reviews_model = []

    rating = 0

    has_user_reviewed_book = False
    user_id = None

    if isLoggedIn():
        user_id = session['user_id']

    for review in reviews:
        reviews_model.append(Review(
            review['message'], review['rating'], review['book_isbn'], review['user_id'], review['created'])
        )

        rating += int(review['rating'])

        if review['user_id'] == user_id:
            has_user_reviewed_book = True

    if len(reviews_model) > 0:
        rating = rating / len(reviews_model)
        rating = round(rating)

    model = {
        'rating': rating,
        'reviews': reviews_model,
        'user_reviewed_book': has_user_reviewed_book,
        'book': book_model
    }

    return render_template("book-details.html", model=model)


@app.route("/review/<isbn>", methods=["POST"])
def add_review(isbn):

    book_exists = db.execute(
        "SELECT isbn FROM book WHERE isbn = :isbn", {"isbn": isbn})

    if book_exists.rowcount != 1:
        flash(f"Could not add review for book {isbn} ISBN")
        return redirect(url_for("book_details", isbn=isbn))

    user_id = session["user_id"]

    already_reviewed = db.execute(
        "SELECT id FROM review WHERE book_isbn = :isbn AND user_id = :user_id",
        {"isbn": isbn, "user_id": user_id}
    )

    if already_reviewed.rowcount != 0:
        flash(f"You have already reviewed the book {isbn} ISBN")
        return redirect(url_for("book_details", isbn=isbn))

    review = Review(request.form.get("message"),
                    int(request.form.get("rating")), isbn, user_id, None)

    if not review.is_valid():
        print(review.model_state())
        flash(f"Please provide a valid review")
        return redirect(url_for("book_details", isbn=isbn))

    db.execute("""
        INSERT INTO review (book_isbn, rating, message, user_id, id, created)
        VALUES (:isbn, :rating, :message, :user_id, :id, current_timestamp)""",
               {
                   "isbn": review.book_isbn,
                   "rating": review.rating,
                   "message": review.message,
                   "user_id": review.user_id,
                   "id": review.id
               })

    db.commit()

    return redirect(url_for("book_details", isbn=isbn))


def isLoggedIn():
    return "user_id" in session

# Only redirect if the passed in absolute url matches the server host to protect against phising
def safe_redirect(absolute_redirect_url):
    server_host = request.host
    #  general structure of a URL: scheme://netloc/path;parameters?query#fragment
    redirect_host = urlparse(absolute_redirect_url).netloc
    
    return server_host == redirect_host
