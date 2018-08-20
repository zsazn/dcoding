# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 3/8/2018


from __future__ import unicode_literals

from django.contrib import admin
from dcoding_1d.models import Question, Answer

# Register your models here.
admin.site.register(Question)
admin.site.register(Answer)
