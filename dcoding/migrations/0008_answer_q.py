# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-25 05:25
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dcoding', '0007_answer_a_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='q',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dcoding.Question'),
        ),
    ]