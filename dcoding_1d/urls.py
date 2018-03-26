#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 3/8/2018


from django.conf.urls import include, url
from dcoding_1d import views

urlpatterns = [
    url(r'^dcoding-1d$', views.IndexView.as_view(), name='index'),
    url(r'^dcoding-1d/question/(?P<type>\w+)/(?P<dimension>\w+)/(?P<set>\d+)/(?P<index>\d+)$', views.QuestionView.as_view(), name='question'),
    url(r'^dcoding-1d/start$', views.StartView.as_view(), name='start'),
    url(r'^dcoding-1d/end$', views.EndView.as_view(), name='end'),
]
