from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    
    def name(self):
        return f"{self.first_name} {self.last_name}"
