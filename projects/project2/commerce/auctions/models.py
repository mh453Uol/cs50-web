from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    
    def name(self):
        return f"{self.first_name} {self.last_name}"
    

class Conversation(models.Model):
    recipient_1 = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversation_recipient1')
    recipient_2 = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversation_recipient2')

    recipient_1_unread_messages = models.BooleanField(default=False)
    recipient_2_unread_messages = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversations_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='conversations_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Conversation between {self.recipient_1.name()} and {self.recipient_2.name()}"

    def get_recipient(self, current_user_id):
        return self.recipient_2 if current_user_id is self.recipient_1.id else self.recipient_1

    def set_recipient_unread_messages(self, current_user_id):
        if current_user_id is self.recipient_1.id:
            self.recipient_2_unread_messages = True;
        else:
            self.recipient_1_unread_messages = True;
    
    def user_has_unread_messages(self, current_user_id):
        return self.recipient_1_unread_messages if current_user_id is self.recipient_1.id else self.recipient_2_unread_messages;

    def read_messages(self, current_user_id):
        if current_user_id is self.recipient_1.id:
            self.recipient_1_unread_messages = False;
        else:
            self.recipient_2_unread_messages = False;

class Message(models.Model):
    recipient = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='user_messages')
    message = models.CharField(max_length=1026)

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='message_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='message_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Message in conversation {self.conversation.id}"
