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
                loadMailbox('sent');
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
        document.querySelector('#mailbox-view').style.display = 'none';
        document.querySelector("#email-view").style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';

        // Clear out composition fields
        composeEmailView.reset();
    }

    var viewEmail = function (mailboxType, emailId) {

        mailboxService.getEmail(emailId).then(data => {
            renderEmail(data);
        });

    }

    var renderEmail = function (email) {
        document.querySelector("#email-view").style.display = 'block';
        document.querySelector('#mailbox-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';

        let source = document.getElementById("email-details-template").innerHTML;
        let template = Handlebars.compile(source);

        let html = template(email);

        document.getElementById("email-details-container").innerHTML = html;
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