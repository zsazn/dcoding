#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 03/22/2018

from django.conf.urls import include, url
from entrypoint import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
]
