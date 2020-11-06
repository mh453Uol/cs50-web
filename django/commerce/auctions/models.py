from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    
    def name(self):
        return f"{self.first_name} {self.last_name}"

    
class Conversation(models.Model):
    recipient = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversations')
    recipient_has_unread_messages = models.BooleanField(default=True)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversations_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversations_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.recipient & self.created_by}"

    def get_recipient(self, current_user_id):
        if current_user_id is self.recipient.id:
            return self.recipient;
        else:
            return self.created_by;


class Message(models.Model):
    message = models.CharField(max_length=1026)

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='message_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='message_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.message}"
