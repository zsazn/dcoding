# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-04-04 01:14
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dcoding', '0009_auto_20180403_1138'),
    ]

    operations = [
        migrations.RenameField(
            model_name='answer',
            old_name='a_access_ip_addr',
            new_name='a_access_from',
        ),
    ]