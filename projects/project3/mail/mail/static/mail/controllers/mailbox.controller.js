var mailboxController = function (mailboxService, composeEmailView, mailboxView) {

    var initialize = function () {
        composeEmailView.initialize();

        // Use buttons to toggle between views
        document.querySelector('#inbox').addEventListener('click', () => loadMailbox('inbox'));
        document.querySelector('#sent').addEventListener('click', () => loadMailbox('sent'));
        document.querySelector('#archived').addEventListener('click', () => loadMailbox('archive'));
        document.querySelector('#compose').addEventListener('click', () => composeEmail());

        const emailForm = document.querySelector('#compose-form');

        emailForm.addEventListener('submit', (event) => {
            onSendEmail(event).then(response => {
                loadMailbox('inbox');
            })
        });

        // By default, load the inbox
        loadMailbox('inbox');
    }

    var loadMailbox = function (mailboxType) {

        mailboxService.getMailbox(mailboxType)
            .then(data => {
                renderMailbox(mailboxType, data);
            });
    }

    var renderMailbox = function (mailboxType, emails) {
        mailboxView.initialize(mailboxType, emails, viewEmail);
    }

    var composeEmail = function () {
        // Show compose view and hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';

        // Clear out composition fields
        composeEmailView.reset();
    }

    var viewEmail = function (mailboxType, emailId) {
        console.log(mailboxType, emailId);
        
        mailboxService.getEmail(emailId)
        .then(data => {
            console.log(data);
        });

    }


    var onSendEmail = function (event) {

        event.preventDefault();
        event.stopPropagation();

        return mailboxService.sendEmail({
            recipients: composeEmailView.recipients(),
            subject: composeEmailView.subject(),
            body: composeEmailView.body()
        })
    }

    return {
        init: initialize,
        loadMailbox: loadMailbox,
    }

}(mailboxService, composeEmailView, mailboxView);