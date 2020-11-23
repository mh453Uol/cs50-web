var mailboxController = function (mailboxService, composeEmailView) {

    var initialize = function () {
        // Use buttons to toggle between views
        document.querySelector('#inbox').addEventListener('click', () => loadMailbox('inbox'));
        document.querySelector('#sent').addEventListener('click', () => loadMailbox('sent'));
        document.querySelector('#archived').addEventListener('click', () => loadMailbox('archive'));
        document.querySelector('#compose').addEventListener('click', composeEmail);

        document.querySelector('#compose-form').onsubmit = () => onSendEmail(e);

        // By default, load the inbox
        loadMailbox('inbox');
    }

    var loadMailbox = function (mailbox) {

        mailboxService.getMailbox(mailbox)
            .then(data => console.log(data));

        // Show the mailbox and hide other views
        document.querySelector('#emails-view').style.display = 'block';
        document.querySelector('#compose-view').style.display = 'none';

        // Show the mailbox name
        document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    }

    var composeEmail = function () {
        // Show compose view and hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';

        // Clear out composition fields
        composeEmailView.reset();
    }


    var onSendEmail = function (e) {
        event.preventDefault();
        event.stopPropagation();

        mailboxService.sendEmail({
            recipients: composeEmailView.recipients.value.split(','),
            subject: composeEmailView.subject.value,
            body: composeEmailView.body.value
        })
        .then(data => {

        })

    }

    return {
        init: initialize,
        loadMailbox: loadMailbox,
    }

}(mailboxService, composeEmailView);