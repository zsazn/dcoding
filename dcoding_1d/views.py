#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 3/8/2018

from __future__ import unicode_literals
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, Http404
from django.shortcuts import render, HttpResponse, get_object_or_404, HttpResponseRedirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from dcoding_1d.models import Question, Answer
from dcoding_1d.forms import AnswerForm
import random, string

QUESTION_TYPES = ['pilot', 'test']
QUESTION_DIMENSIONS = ['length_global',
                       'length_local',
                       'length_global_background_color',
                       'length_local_background_color']
QUESTION_VALUES = [7, 75, 670, 5300, 8350]
random.shuffle(QUESTION_VALUES);

# Create your views here.
class IndexView(TemplateView):
    template_name = '1d/index.html'
    def get(self, request):
        user_id = ''.join([random.choice(string.ascii_letters) for n in xrange(6)])
        # print 'user_id: ' + user_id
        try:
            tmp = request.session['user_id']
        except KeyError:
            request.session['user_id'] = user_id
            request.session.set_expiry(0)
        return render(request, self.template_name, locals())

class StartView(TemplateView):
    template_name = '1d/start.html'
    def get(self, request):
        return render(request, self.template_name)

class EndView(TemplateView):
    template_name = '1d/end.html'
    def get(self, request):
        return render(request, self.template_name)

class QuestionView(TemplateView):
    model = Question
    template_name = '1d/question.html'
    context_object_name = 'questions'

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        try:
            q = get_object_or_404(Question,
                                  q_type=kwargs['type'],
                                  q_dimension=kwargs['dimension'],
                                  q_set=kwargs['set'],
                                  q_index=kwargs['index'])
        except ObjectDoesNotExist:
            print 'Something went wrong'
        q_index = int(q.q_index)
        if q_index < 5:
            q_val = QUESTION_VALUES[q_index - 1]
        elif q_index == 5:
            q_val = QUESTION_VALUES[q_index - 1]
            random.shuffle(QUESTION_VALUES)
        form = AnswerForm()
        return render(request, self.template_name, locals())

    @method_decorator(ensure_csrf_cookie)
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
                return HttpResponseRedirect('/dcoding-1d/start')
            elif q_type and q_type == 'test':
                if q_index and q_index < 5:
                    q_index += 1
                elif q_index and q_index == 5:
                    q_dimension_index = QUESTION_DIMENSIONS.index(q_dimension)
                    if q_dimension_index == 3:
                        request.session.flush()
                        return HttpResponseRedirect('/dcoding-1d/end')
                    elif q_dimension_index < 3:
                        q_dimension = QUESTION_DIMENSIONS[q_dimension_index + 1]
                        q_set = 1
                        q_index = 1
                else:
                    raise Http404('Something just went wrong. Please contact Zheng.')
            return HttpResponseRedirect(reverse('dcoding_1d:question',
                                                kwargs={'type': 'test',
                                                        'dimension': q_dimension,
                                                        'set': q_set,
                                                        'index': q_index}))
        answer_input_obj = AnswerForm(request.POST)
        data = dict()
        if 'user_id' in request.session:
            a_id = request.session['user_id']
            # print a_id
        else:
            raise Http404('No user id found.')
            return HttpResponseRedirect('/dcoding-1d/end')
        if answer_input_obj.is_valid():
            answer = answer_input_obj.clean()
            a_val = answer['a_val']
            data['success'] = a_val
            q_val = request.POST.get('q_val')
            start_answer_time = request.POST.get('start_answer_time')
            submit_answer_time = request.POST.get('submit_answer_time')
            loaded_time = request.POST.get('loaded_time')
            t_thinking = request.POST.get('t_thinking')
            t_answering = request.POST.get('t_answering')
            access_time = request.POST.get('access_time')
            # access_from = request.POST.get('access_from')

            if len(Answer.objects.filter(a_id=a_id)) == 0:
                a = Answer.objects.create(a_id=a_id, a_val=a_val, q_id=q.id,
                           q_val=q_val,
                           q_dimension=q_dimension,
                           q_set=q_set,
                           q_index=q_index,
                           a_page_loaded=loaded_time,
                           a_start_time=start_answer_time,
                           a_submit_time=submit_answer_time,
                           a_access_time=access_time,
                           # a_access_from=access_from,
                           t_thinking=t_thinking,
                           t_answering=t_answering)
            else:
                if len(Answer.objects.filter(a_id=a_id).filter(q_id=q.id)) == 0:
                    a = Answer.objects.create(a_id=a_id, a_val=a_val, q_id=q.id,
                               q_val=q_val,
                               q_dimension=q_dimension,
                               q_set=q_set,
                               q_index=q_index,
                               a_page_loaded=loaded_time,
                               a_start_time=start_answer_time,
                               a_submit_time=submit_answer_time,
                               a_access_time=access_time,
                               # a_access_from=access_from,
                               t_thinking=t_thinking,
                               t_answering=t_answering)
        else:
            error_msg = answer_input_obj.errors
            data['error'] = error_msg
        return JsonResponse(data)
