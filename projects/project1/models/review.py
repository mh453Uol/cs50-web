import uuid
from datetime import datetime

class Review:
    
    def __init__(self, message, rating, book_isbn, user_id, created):
        self.id = uuid.uuid4()
        self.message = message
        self.rating = rating
        self.book_isbn = book_isbn
        self.user_id = user_id
        print(f"****{created.__class__}")
        self.created = created


    def model_state(self):
        return {
            "message": {
                "value": self.message,
                "valid": (self.message is not None and len(self.message) <= 1024),
                "validation_message": "Please provide a valid message."
            },
            "rating": {
                "value": self.rating,
                "valid": self.rating is not None and self.rating >= 1 and self.rating <= 5,
                "validation_message": "Please provide a rating from 1 to 5."
            },
            "book_isbn": {
                "value": self.book_isbn,
                "valid": self.book_isbn is not None,
                "validation_message": "Please provide a book_isbn."
            },
            "user_id": {
                "valid": self.user_id is not None,
                "validation_message": "Please provide a valid user_id."
            }
        }

    def is_valid(self):
        dictionary = self.model_state()

        for key in dictionary:
            if dictionary.get(key)['valid'] is False:
                return False

        return True
