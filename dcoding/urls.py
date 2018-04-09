#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 3/8/2018


from django.conf.urls import include, url
from dcoding import views

urlpatterns = [
    url(r'^dcoding$', views.IndexView.as_view(), name='index'),
    url(r'^dcoding/question/(?P<type>\w+)/(?P<dimension>\w+)/(?P<set>\d+)/(?P<index>\d+)$', views.QuestionView.as_view(), name='question'),
    url(r'^dcoding/start$', views.StartView.as_view(), name='start'),
    url(r'^dcoding/break$', views.BreakView.as_view(), name='break'),
    url(r'^dcoding/end$', views.EndView.as_view(), name='end'),
    url(r'^dcoding/example$', views.ExampleView.as_view(), name='example'),
]
