from django import template
from django.template import Library, Node
from auctions.models import Conversation
from django.template.exceptions import TemplateSyntaxError
from django.db.models import Q

register = template.Library()

@register.simple_tag(takes_context=True)
def get_unread_messages(context, user_id):
        unread_query = Q(
                Q(Q(recipient_1_id=user_id) & Q(recipient_1_unread_messages=True)) | Q(Q(recipient_2_id=user_id) & Q(recipient_2_unread_messages=True))
        )
        unread = Conversation.objects.filter(unread_query).count()
        context['unread_messages'] = unread
        return ''
