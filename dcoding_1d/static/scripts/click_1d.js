'use strict';

var startAnswerTime;

function clickToPractice() {
    window.location.href='dcoding-1d/question/pilot/length/1/1';
}

function clickToStart() {
    window.location.href='question/test/length/1/1';
}

function clickToAnswer() {
    // startAnswerTime = new Date(Date.now());
    $('#answer-modal').on('show.bs.modal', function() {
        $('.col').addClass('blur');
    });
    $('#answer-modal').on('hide.bs.modal', function() {
        $('.col').removeClass('blur');
    });
    startAnswerTime = Date.now();
    // console.log(new Date(startAnswerTime));
    // console.log('Start to answer!');
}
