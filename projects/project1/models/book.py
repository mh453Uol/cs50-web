

class Book:

    def __init__(self, isbn: str, title: str, author: str, year: int):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.year = year

    def model_state(self):
        return {
            "isbn": {
                "value": self.isbn,
                "valid": (self.isbn is not None and len(self.isbn) > 0),
                "validation_message": "Please provide a isbn."
            },
            "title": {
                "value": self.title,
                "valid": self.title is not None and len(self.title) > 0,
                "validation_message": "Please provide a title."
            },
            "author": {
                "value": self.author,
                "valid": self.author is not None and len(self.author) > 0,
                "validation_message": "Please provide a author."
            },
            "year": {
                "valid": self.year is not None and self.year > 0,
                "validation_message": "Please provide a valid year."
            }
        }

    def is_valid(self):
        dictionary=self.model_state()

        for key in dictionary:
            if dictionary.get(key)['valid'] is False:
                return False

        return True
