from ..utils.email_util import EmailUtil

class User:

    def __init__(self, email, password, confirm_password):
        self.email = email
        self.password = password
        self.confirm_password = confirm_password
    
    def isValid(self):
        return {
            "email": {
                "value": self.email,
                "valid" : self.email and not EmailUtil().isInvalidEmail(self.email),
                "validation_message": "Please provide a valid password."
            },
            "password": {
                "valid": self.password != "",
                "validation_message": "Please provide a valid and matching password."
            },
            "confirm_password": {
                "valid": self.confirm_password and self.password == self.confirm_password,
                "validation_message": "Please provide a valid and matching password."
            }
        }
