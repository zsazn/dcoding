'use strict';

var startAnswerTime;

function clickToPractice() {
    window.location.href='dcoding/question/pilot/length/1/1';
}

function clickToStart() {
    window.location.href='question/test/length/1/1';
}

function clickToNextSession() {
    let dm = window.sessionStorage.getItem('session');
    if (dm == 'volume') {
        window.location.href='question/test/length_color/1/1';
    } else if (dm == 'volume_color') {
        window.location.href='question/test/length_background_color/1/1';
    }
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
