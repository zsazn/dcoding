#!/usr/bin/python
# -*- coding: utf-8 -*-
# Author: Zheng Zhou
# Date: 3/8/2018

from django import forms


class AnswerForm(forms.Form):
    a_val = forms.IntegerField(label='',
                               max_value=10000000,
                               min_value=1,
                               required=True,
                               error_messages={
                                'min_value': 'Answer must be larger than 1',
                                'max_value': 'Answer must be smaller than 1000000',
                                'required': 'Please answer a number'},
                               widget=forms.NumberInput(
                                   attrs={'required': True,
                                          'class': 'form-control',
                                          'id': 'input-answer',
                                          'placeholder': 'Type your answer',
                                          'aria-describedby': 'basic-addon1'}))

    def clean_a_val(self):
        if isinstance(self.cleaned_data, dict):
            if isinstance(self.cleaned_data['a_val'], int):
                print 'data a_val is valid and clean'
            else:
                raise forms.ValidationError('Answer must be a number',
                                            code='invalid')
        return self.cleaned_data['a_val']
