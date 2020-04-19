document.addEventListener('DOMContentLoaded', () => {
    // load first page by default
    load_page("first");

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.onclick = (clickEvent) => {
            // Stop link from causing a page reload
            clickEvent.preventDefault();
            load_page(link.dataset.page);
        }
    })

    function load_page(name) {
        fetch(`/${name}`)
            .then(body => body.text())
            .then(body => {
                console.log(body);
                document.querySelector('#body').innerHTML = body;
            });
    }
});