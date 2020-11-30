var composeEmailView = function() {
    
    var recipients = [];
    var subject = '';
    var body = '';

    var initialize = () => {
        recipients = document.querySelector('#compose-recipients');
        subject = document.querySelector('#compose-subject');
        body = document.querySelector('#compose-body');
    } 
    
    var reset = function() {
        recipients.value = '';
        subject.value = '';
        body.value = '';
    }

    var getRecipients = () => {
        return recipients.value;
    }

    var getSubject = () => {
        return subject.value;
    }
    
    var getBody = () => {
        return body.value;
    }

    return {
        initialize: initialize,
        recipients: getRecipients,
        subject: getSubject,
        body: getBody,
        reset: reset
    }
}();