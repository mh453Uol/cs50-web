# Generated by Django 3.1 on 2020-11-08 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_auto_20201108_0721'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='is_read',
        ),
        migrations.AddField(
            model_name='conversation',
            name='recipient_1_unread_messages',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='conversation',
            name='recipient_2_unread_messages',
            field=models.BooleanField(default=False),
        ),
    ]
