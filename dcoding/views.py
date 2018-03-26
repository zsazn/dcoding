#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 3/8/2018

from __future__ import unicode_literals
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, Http404
from django.shortcuts import render, HttpResponse, get_object_or_404, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from dcoding.models import Question, Answer
from dcoding.forms import AnswerForm
import random, string

QUESTION_TYPES = ['pilot', 'test']
QUESTION_DIMENSIONS = ['length',
                       'area',
                       'volume',
                       'length_color',
                       'area_color',
                       'volume_color',
                       'length_background_color',
                       'area_background_color',
                       'volume_background_color']
QUESTION_VALUES = [7, 75, 670, 5300, 8350]
random.shuffle(QUESTION_VALUES);

# Create your views here.
class IndexView(TemplateView):
    template_name = '3d/index.html'
    def get(self, request):
        user_id = ''.join([random.choice(string.ascii_letters) for n in xrange(6)])
        # print 'user_id: ' + user_id
        request.session['user_id'] = user_id
        return render(request, self.template_name, locals())

class StartView(TemplateView):
    template_name = '3d/start.html'
    def get(self, request):
        return render(request, self.template_name)

class BreakView(TemplateView):
    template_name = '3d/break.html'
    def get(self, request):
        return render(request, self.template_name)

class EndView(TemplateView):
    template_name = '3d/end.html'
    def get(self, request):
        return render(request, self.template_name)

class QuestionView(TemplateView):
    model = Question
    template_name = '3d/question.html'
    context_object_name = 'questions'

    def get(self, request, *args, **kwargs):
        q = get_object_or_404(Question,
                              q_type=kwargs['type'],
                              q_dimension=kwargs['dimension'],
                              q_set=kwargs['set'],
                              q_index=kwargs['index'])
        q_index = int(q.q_index)
        if q_index < 5:
            q_val = QUESTION_VALUES[q_index - 1]
        elif q_index == 5:
            q_val = QUESTION_VALUES[q_index - 1]
            random.shuffle(QUESTION_VALUES)
        form = AnswerForm()
        return render(request, self.template_name, locals())

    def post(self, request, *args, **kwargs):
        q = get_object_or_404(Question,
                      q_type=kwargs['type'],
                      q_dimension=kwargs['dimension'],
                      q_set=kwargs['set'],
                      q_index=kwargs['index'])
        q_type = kwargs['type']
        q_dimension = kwargs['dimension']
        q_set = int(kwargs['set'])
        q_index = int(kwargs['index'])
        if 'next-button' in request.POST:
            if q_type and q_type == 'pilot':
                if q_dimension == 'length':
                    q_dimension = 'area_color'
                    return HttpResponseRedirect(reverse('dcoding:question',
                                                kwargs={'type': 'pilot',
                                                        'dimension': 'area_color',
                                                        'set': 1,
                                                        'index': 1}))
                elif q_dimension == 'area_color':
                    return HttpResponseRedirect('/dcoding/start')
            elif q_type and q_type == 'test':
                if q_index and q_index < 5:
                    q_index += 1
                    # print q_index
                elif q_index and q_index == 5:
                    if q_set and q_set == 1:
                        q_set += 1
                        q_index = 1
                    elif q_set and q_set == 2:
                        q_dimension_index = QUESTION_DIMENSIONS.index(q_dimension)
                        if q_dimension_index == 8:
                            return HttpResponseRedirect('/dcoding/end')
                        elif q_dimension_index < 8:
                            if q_dimension == 'volume' or q_dimension == 'volume_color':
                                return HttpResponseRedirect('/dcoding/break');
                            q_dimension = QUESTION_DIMENSIONS[q_dimension_index + 1]
                            q_set = 1
                            q_index = 1
                else:
                    raise Http404('Something just went wrong. Please contact Zheng.')
            return HttpResponseRedirect(reverse('dcoding:question',
                                                kwargs={'type': 'test',
                                                        'dimension': q_dimension,
                                                        'set': q_set,
                                                        'index': q_index}))
        answer_input_obj = AnswerForm(request.POST)
        data = dict()
        if 'user_id' in request.session:
            a_id = request.session['user_id']
        else:
            raise Http404('No user id found.')
            return HttpResponseRedirect('/dcoding/end')
        if answer_input_obj.is_valid():
            answer = answer_input_obj.clean()
            a_val = answer['a_val']
            data['success'] = a_val
            q_val = request.POST.get('q_val')
            start_answer_time = request.POST.get('start_answer_time')
            submit_answer_time = request.POST.get('submit_answer_time')
            loaded_time = request.POST.get('loaded_time')
            try:
                Answer.objects.get(q_id=q.id)
            except ObjectDoesNotExist:
                a = Answer(a_id=a_id, a_val=a_val, q_id=q.id, q_val=q_val,
                           q_dimension=q_dimension,
                           q_set=q_set,
                           q_index=q_index,
                           a_page_loaded=loaded_time,
                           a_start_time=start_answer_time,
                           a_submit_time=submit_answer_time)
                a.save()
            else:
                a = Answer.objects.get(q_id=q.id)
                a.a_val = a_val
                a.save()
        else:
            error_msg = answer_input_obj.errors
            data['error'] = error_msg
        return JsonResponse(data)
