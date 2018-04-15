'use strict';

let mb = document.getElementById('modal-body');
let mf = document.getElementById('modal-footer');
let ig = document.getElementById('input-group');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)/).test(method);
}

function submitAnswer() {
    let aVal = document.getElementById('input-answer').value;
    let submitAnswerTime = Date.now();

    let url = window.location.pathname;
    let csrftoken = Cookies.get('csrftoken');

    // let accessFrom = window.sessionStorage.getItem('accessFrom');
    let tThinking = startAnswerTime - loadedTime;
    let tAnswering = submitAnswerTime - startAnswerTime;

    let t1 = new Date(loadedTime);
    let t2 = new Date(startAnswerTime);
    let t3 = new Date(submitAnswerTime);

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            }
        }
    });
    $.ajax({
        url: url,
        method: 'POST',
        data: {
            access_time: accessTime,
            // access_from: accessFrom,
            loaded_time: t1,
            start_answer_time: t2,
            submit_answer_time: t3,
            t_thinking: tThinking,
            t_answering: tAnswering,
            a_val: aVal,
            q_val: qVal,
            'csrfmiddlewaretoken': csrftoken
        },
        success: function(data) {
            if (data['success']) {
                let msg = document.createElement('p');
                let val = document.getElementById('input-answer').value;
                let title = document.getElementById('modal-title');
                if (qType == 'pilot') {
                    var msgContent = 'Your answer \
                    <span style="color: #ff0000;"><strong>' + val + '</strong>\
                    </span> has been submitted. <br>The actual value is \
                    <span style="color: #ff0000;"><strong>' + qVal + '.</strong>\
                    </span><br>Click "Next" to continue.';
                } else if (qSet == '1' && qIndex == '5') {
                    var msgContent = 'Your answer \
                    <span style="color: #ff0000;"><strong>' + val + '</strong>\
                    </span> has been submitted. <br>Click "Next" to continue.';
                } else {
                    var msgContent = 'Your answer \
                    <span style="color: #ff0000;"><strong>' + val + '</strong>\
                    </span> has been submitted.<br><u><i>You may take a rest.\
                    </i></u><br>Click "Next" to next question when you are \
                    ready.';
                }
                msg.innerHTML = msgContent;
                msg.setAttribute('id', 'submitted-msg');
                title.innerText = 'Answer submitted!';
                if (mb.hasChildNodes()) {
                    mb.replaceChild(msg, ig);
                }
                let nb = document.getElementById('next-button');
                nb.setAttribute('class', 'btn btn-success');
                nb.style.visibility = 'visible';
                document.getElementById('close-button').style.display = 'none';
                // console.log(submitAnswerTime);
                // console.log('Answer submitted!');
                // return console.log('Answer posted successfully!');
            }
            else {
                for (let key in data['error']) {
                    return alert(data['error'][key]);
                }
            }
        }
    });
    // $('#answer-modal').modal('hide');
}

function closeAnswer() {
    if (document.getElementById('input-answer').value == '') {
        var msgContent = 'Your \
            <span style="color: #ff0000;"><strong>EMPTY</strong></span> \
            answer for this question will be submitted and you will be directed \
            to the next question. Do you really want to submit and continue \
            with the next question?';
    } else {
        let val = document.getElementById('input-answer').value;
        var msgContent = 'Your answer <span style="color: #ff0000;""><strong>' +
            val + '</strong></span> will be submitted and you will be directed \
            to the next question. Do you really want to submit and continue \
            with the next question?';
    }
    if (document.getElementById('close-msg') == null) {
        let msg = document.createElement('p');
        msg.innerHTML = msgContent;
        msg.setAttribute('id', 'close-msg');
        mb.appendChild(msg);
    } else {
        let msg = document.getElementById('close-msg');
        msg.style.display = 'inline';
    }
    ig.style.display = 'none';

    document.getElementById('input-answer').value = 'null';

    let nb = document.getElementById('next-button');
    nb.innerHTML = 'Yes, next question!';
    nb.style.visibility = 'visible';
    nb.setAttribute('class', 'btn btn-warning');
    nb.setAttribute('type', 'submit');

    if (document.getElementById('stay-button') == null) {
        let sb = document.createElement('button');
        let mf = document.getElementById('modal-footer');
        sb.setAttribute('id', 'stay-button');
        sb.setAttribute('class', 'btn btn-primary');
        sb.setAttribute('type', 'button');
        sb.innerHTML = 'No, stay here!';
        sb.setAttribute('onclick', 'stay()');
        mf.appendChild(sb);
    } else {
        let sb = document.getElementById('stay-button');
        sb.style.display = 'inline';
    }
}

function stay() {
    let nb = document.getElementById('next-button');
    let msg = document.getElementById('close-msg');
    nb.innerHTML = 'Next';
    nb.setAttribute('class', 'btn btn-success');
    nb.style.visibility = 'hidden';

    ig.style.display = 'flex';
    msg.style.display = 'none';

    let sb = document.getElementById('stay-button');
    mf.removeChild(sb);

    if (document.getElementById('input-answer').value == 'null') {
        document.getElementById('input-answer').value = '';
    }
}
