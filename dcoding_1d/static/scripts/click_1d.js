'use strict';

var startAnswerTime;

function clickToPractice() {
    window.location.href='dcoding-1d/question/pilot/length_local/1/1';
}

function clickToStart() {
    window.sessionStorage.setItem('q_dimension', 'start_length_global');
    window.location.href='example';
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
