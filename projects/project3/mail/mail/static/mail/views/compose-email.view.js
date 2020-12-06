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

    var setRecipients = (value) => {
        if (value) {
            recipients.value = value;
        }
    }

    var setSubject = (value) => {
        if (value) {
            subject.value = value;
        }
    }

    var setBody = (value) => {
        if (value) {
            body.value = value;
        }
    }

    return {
        initialize: initialize,
        getRecipients: getRecipients,
        getSubject: getSubject,
        getBody: getBody,
        setRecipients: setRecipients,
        setSubject: setSubject,
        setBody: setBody,
        reset: reset
    }
}();