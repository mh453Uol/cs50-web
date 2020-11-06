from django import template
from django.template import Library, Node
from auctions.models import Conversation
from django.template.exceptions import TemplateSyntaxError

register = template.Library()

@register.simple_tag(takes_context=True)
def get_unread_messages(context, user_id):
        unread = Conversation.objects.filter(recipient_has_unread_messages=True, recipient_id=user_id).count()
        context['unread_messages'] = unread
        return ''
