var mailboxView = function () {

    var initialize = function (mailboxType, emails, onEmailClick) {
        // Show the mailbox and hide other views
        document.querySelector('#emails-view').style.display = 'block';
        document.querySelector('#compose-view').style.display = 'none';
        
        // Set mailbox heading
        document.querySelector('#email-heading').innerHTML = getHeading(mailboxType);

        renderTemplate(emails);

        handleOnEmailClick(mailboxType, onEmailClick);
    }

    function renderTemplate(emails) {
        let source = document.getElementById("email-template").innerHTML;
        let template = Handlebars.compile(source);

        let html = template({emails: emails});

        document.getElementById("email-list-container").innerHTML = html;
    }

    function handleOnEmailClick(mailboxType, onEmailClick) {
        let rows = document.querySelectorAll("#email-list-container li");
        
        rows.forEach(
            (row) => row.onclick = () => { 
                onEmailClick(mailboxType, row.dataset.emailId);
            }
        );
    }

    function getHeading(mailboxType) {
        let title = mailboxType;

        switch(mailboxType) {
            case 'inbox': {
                title = 'Inbox';
                break;
            }
            case 'sent': {
                title = 'Sent';
                break;
            }
            case 'archive': {
                title = 'Archive';
                break;
            }
        }
        
        return title;
    }

    return {
        initialize: initialize,
    }

}();