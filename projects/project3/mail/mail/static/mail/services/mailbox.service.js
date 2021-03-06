var mailboxService = function() {

    var getMailbox = function(type) {
        var supportType = type === 'inbox' || type === 'sent' || type === 'archive';

        if (!supportType) {
            return console.error(`${type} is not support`)
        }

        return fetch(`/emails/${type}`)
                .then(response => response.json())
                .then(response => {
                    response.map(
                        (record) => record.timestamp = new Date(record.timestamp))

                    return response
                })
    }

    var sendEmail = function(email) {
        console.log(email);
        return fetch('/emails', {
            method: 'POST',
            body: JSON.stringify(email)
        })
        .then(response => response.json())
    }

    var getEmail = function (emailId) {
        return fetch(`/emails/${emailId}`)
            .then(response => response.json());
    }

    var markEmailAsRead = function (emailId) {
        return fetch(`/emails/${emailId}`, {
            method: 'PUT',
            body: JSON.stringify({ read: true })
        })
    }


    return {
        getMailbox: getMailbox,
        sendEmail: sendEmail,
        getEmail: getEmail,
        markEmailAsRead: markEmailAsRead
    }
}();