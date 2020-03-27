from ..utils.email_util import EmailUtil
import uuid

class User:
    
    def __init__(self, email, firstname, lastname, password, confirm_password):
        self.id = uuid.uuid4()
        self.email = email
        self.firstname = firstname
        self.lastname = lastname
        self.password = password
        self.confirm_password = confirm_password

    def model_state(self):
        return {
            "email": {
                "value": self.email,
                "valid": self.email and not EmailUtil().isInvalidEmail(self.email),
                "validation_message": "Please provide a valid password."
            },
            "firstname": {
                "value": self.firstname,
                "valid": self.firstname is not '',
                "validation_message": "Please provide a firstname."
            },
            "lastname": {
                "value": self.lastname,
                "valid": self.lastname is not '',
                "validation_message": "Please provide a lastname."
            },
            "password": {
                "valid": self.password is not '',
                "validation_message": "Please provide a valid and matching password."
            },
            "confirm_password": {
                "valid": self.confirm_password and self.password == self.confirm_password,
                "validation_message": "Please provide a valid and matching password."
            }
        }

    def is_valid(self):
        dictionary = self.model_state()

        for key in dictionary:
            if dictionary.get(key)['valid'] is False:
                return False

        return True
