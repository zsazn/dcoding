'use strict';

var startAnswerTime;

function clickToPractice() {
    window.location.href='dcoding-1d/question/pilot/length_local/1/1';
}

function clickToStart() {
    window.location.href='question/test/length_global/1/1';
}

function clickToAnswer() {
    $('#answer-modal').on('show.bs.modal', function() {
        $('.col').addClass('blur');
    });
    $('#answer-modal').on('hide.bs.modal', function() {
        $('.col').removeClass('blur');
    });
    startAnswerTime = Date.now();
}
