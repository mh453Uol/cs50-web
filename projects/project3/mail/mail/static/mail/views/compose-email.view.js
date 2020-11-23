var composeEmailView = function() {
    var recipients = () => document.querySelector('#compose-recipients');
    var subject = () => document.querySelector('#compose-subject');
    var body = () => document.querySelector('#compose-body');

    var reset = function() {
        recipients.value = '';
        subject.value = '';
        body.value = '';
    }

    return {
        recipients: recipients,
        subject: subject,
        body: body,
        reset: reset
    }
}();