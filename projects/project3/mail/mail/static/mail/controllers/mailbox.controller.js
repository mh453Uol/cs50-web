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

    var composeEmail = function (to, subject, body) {
        // Show compose view and hide other views
        document.querySelector('#mailbox-view').style.display = 'none';
        document.querySelector("#email-view").style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';

        // Clear out composition fields
        composeEmailView.reset();

        console.log(to, subject, body)

        // Prefill to, subject and body
        if (to) {
            composeEmailView.setRecipients(to);
        }

        if (subject) {
            composeEmailView.setSubject(subject);
        }

        if (body) {
            composeEmailView.setBody(body);
        }
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

        // If emails not read mark as read now
        if (email.read === false) {
            mailboxService.markEmailAsRead(email.id).catch(reject => {
                console.log(reject);
            })
        }

        // Add event listener for the reply button click
        document.querySelector("#email-reply").addEventListener("click", (event) => {
            const senderEmail = event.target.dataset;

            console.log(senderEmail);

            const body = `On ${senderEmail.timestamp} ${senderEmail.sender} wrote: ${senderEmail.body}`;

            const isReply = senderEmail.subject.substring(0,3).toUpperCase() === "RE:"
            const subject = isReply ? senderEmail.subject : `Re: ${senderEmail.subject}`;

            composeEmail(senderEmail.sender, subject, body);
        });
    }


    var onSendEmail = function (event) {

        event.preventDefault();
        event.stopPropagation();

        return mailboxService.sendEmail({
            recipients: composeEmailView.getRecipients(),
            subject: composeEmailView.getSubject(),
            body: composeEmailView.getBody()
        })
    }

    return {
        init: initialize,
        loadMailbox: loadMailbox,
    }

}(mailboxService, composeEmailView, mailboxView);