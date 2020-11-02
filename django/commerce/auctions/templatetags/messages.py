from django import template
from django.template import Library, Node
from listings.models import Message
from django.template.exceptions import TemplateSyntaxError

register = template.Library()

@register.simple_tag(takes_context=True)
def get_unread_messages(context, user_id):
        unread = Message.objects.filter(is_read=False, recipient_id=user_id).count()
        context['unread_messages'] = unread
        return ''
