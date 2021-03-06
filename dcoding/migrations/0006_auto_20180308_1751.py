# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-08 22:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dcoding', '0005_auto_20180307_0140'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answer',
            name='a_id',
        ),
        migrations.RemoveField(
            model_name='answer',
            name='question',
        ),
        migrations.RemoveField(
            model_name='question',
            name='q_val',
        ),
        migrations.AddField(
            model_name='answer',
            name='q_dimension',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='answer',
            name='q_index',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='answer',
            name='q_set',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='answer',
            name='a_val',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
