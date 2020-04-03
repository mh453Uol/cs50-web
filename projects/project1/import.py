import os
import csv

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from models.book import Book

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

def main():
    if not os.getenv("DATABASE_URL"):
        raise RuntimeError("DATABASE_URL is not set")
    
    database_url = os.getenv("DATABASE_URL")
    csv_file = "books.csv"

    import_to_database(database_url, csv_file)
    #import_to_database_raw(database_url, csv_file)
    return 1

def import_to_database(database_url, file):

    with open(file, "r") as csvDataFile:
        reader = csv.DictReader(csvDataFile, delimiter=',')
        
        book = None
        bulk_insert = "INSERT INTO book (isbn, title, author, year) VALUES (:isbn, :title, :author, :year)"
        data = []

        for row in reader:
            #print(row)
            book = Book(row['isbn'], row['title'], row['author'], row['year'])

            if book.is_valid():
                data.append({ "isbn": book.isbn, "title": book.title, "author": book.author, "year": book.year})
            else:
                print(f"Could not INSERT {book.isbn}")

        #print(data)
        db.execute(bulk_insert,data)
        db.commit()

# Doesnt work get QueuePool limit of size <x> overflow <y> reached, connection timed out, timeout <z>
def import_to_database_raw(database_url, file):
    
    with open(file, "r") as csvDataFile:
        reader = csv.DictReader(csvDataFile, delimiter=',')
        
        book = None
        bulk_insert = "INSERT INTO book (isbn, title, author, year) VALUES "

        for row in reader:
            #print(row)
            book = Book(row['isbn'], row['title'], row['author'], row['year'])

            if book.is_valid():
                bulk_insert += f"('{book.isbn}', '{book.title}', '{book.author}', '{book.year}'),"
            else:
                print(f"Could not INSERT {book.isbn}")

        bulk_insert = bulk_insert[:-1];
        bulk_insert += ";"

        print(bulk_insert)
        db.execute(bulk_insert)
        db.commit()

if __name__ == "__main__":
    main()