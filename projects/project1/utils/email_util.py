import re

class EmailUtil:
    
    def isInvalidEmail(self, email):
        return not re.match(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", email)