document.addEventListener('DOMContentLoaded', () => {
    // load first page by default
    load_page("first");

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.onclick = (clickEvent) => {
            // Stop link from causing a page reload
            const page = link.dataset.page;
            clickEvent.preventDefault();
            load_page(page);
        }
    })

    // User goes back or forward
    window.onpopstate = (e) => {
        const data = e.state;
        updateBodyContainer(data.title, data.body);
        
    }

    function load_page(name) {
        fetch(`/${name}`)
            .then(body => body.text())
            .then(body => {
                console.log(body);
                updateBodyContainer(name, body);
                history.pushState({
                    'title': name,
                    'body': body
                }, name, name);
            });
    }

    function updateBodyContainer(title, body) {
        document.querySelector('#body').innerHTML = body;

        // History Api (Update url so users are able to go back)
        // Add tab name
        document.title = title;
    }
});