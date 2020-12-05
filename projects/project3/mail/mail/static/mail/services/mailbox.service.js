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

    return {
        getMailbox: getMailbox,
        sendEmail: sendEmail
    }
}();