#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 8/8/2018


from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Question(models.Model):
    q_type = models.CharField(max_length=255)
    q_dimension = models.CharField(max_length=255)
    q_set = models.PositiveIntegerField()
    q_index = models.PositiveIntegerField()
    q_min = models.PositiveIntegerField()
    q_max = models.PositiveIntegerField()

    def __unicode__(self):
        return 'Question %s' % self.id


class Answer(models.Model):
    a_id = models.CharField(max_length=6, null=True, blank=True)
    a_val = models.PositiveIntegerField(null=True, blank=True)
    q = models.ForeignKey(Question,
                          on_delete=models.CASCADE,
                          null=True,
                          blank=True)
    q_val = models.PositiveIntegerField(null=True, blank=True)
    q_dimension = models.CharField(max_length=255, null=True, blank=True)
    q_set = models.PositiveIntegerField(null=True, blank=True)
    q_index = models.PositiveIntegerField(null=True, blank=True)
    a_page_loaded = models.CharField(max_length=255, null=True, blank=True)
    a_start_time = models.CharField(max_length=255, null=True, blank=True)
    a_submit_time = models.CharField(max_length=255, null=True, blank=True)
    a_access_time = models.CharField(max_length=255, null=True, blank=True)
    # a_access_from = models.CharField(max_length=255, null=True, blank=True)
    t_thinking = models.CharField(max_length=255, null=True, blank=True)
    t_answering = models.CharField(max_length=255, null=True, blank=True)

    def __unicode__(self):
        return 'Answer of %s' % self.a_id + 'to question ' + str(self.q.id) + \
               ' accesed at ' + self.a_access_time + ' from ' + \
               self.a_access_from
