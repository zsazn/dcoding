# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-04-03 15:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dcoding', '0008_answer_q'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='a_access_ip_addr',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='answer',
            name='a_access_time',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
