var mailboxController = function (mailboxService, composeEmailView) {

    var initialize = function () {
        composeEmailView.initialize();

        // Use buttons to toggle between views
        document.querySelector('#inbox').addEventListener('click', () => loadMailbox('inbox'));
        document.querySelector('#sent').addEventListener('click', () => loadMailbox('sent'));
        document.querySelector('#archived').addEventListener('click', () => loadMailbox('archive'));
        document.querySelector('#compose').addEventListener('click', () => composeEmail());

        const emailForm = document.querySelector('#compose-form');

        emailForm.addEventListener('submit', (event) => {
            onSendEmail(event);
            loadMailbox('inbox');
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
        // Show the mailbox and hide other views
        document.querySelector('#emails-view').style.display = 'block';
        document.querySelector('#compose-view').style.display = 'none';

        let source = document.getElementById("email-template").innerHTML;
        let template = Handlebars.compile(source);

        let html = template({emails: emails});

        document.getElementById("email-list-container").innerHTML = html;

        let rows = document.querySelectorAll("#email-list-container li");
        
        rows.forEach(
            (row) => row.onclick = () => { 
                viewMailbox(mailboxType, row.dataset.emailId);
            }
        );
    }

    var composeEmail = function () {
        // Show compose view and hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';

        // Clear out composition fields
        composeEmailView.reset();
    }

    var viewMailbox = function (mailboxType, mailboxId) {
        console.log(mailboxType, mailboxId);
    }


    var onSendEmail = function (event) {

        event.preventDefault();
        event.stopPropagation();

        mailboxService.sendEmail({
            recipients: composeEmailView.recipients(),
            subject: composeEmailView.subject(),
            body: composeEmailView.body()
        })
        .then(data => {
            console.log(data);
        })

    }

    return {
        init: initialize,
        loadMailbox: loadMailbox,
    }

}(mailboxService, composeEmailView);