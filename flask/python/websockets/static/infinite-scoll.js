document.addEventListener('DOMContentLoaded', () => {
    let alreadyScrolled = 0;

    let observers = [onAtEndOfPage];
    let postsLoadedAlready = 0;
    const postsToLoad = 10;


    window.onscroll = () => onScroll();

    getPosts();

    function onScroll() {
        const scrolled = getScrollProgress();

        if (scrolled != alreadyScrolled) {
            alreadyScrolled = scrolled;

            observers.forEach(fn => {
                fn(scrolled);
            });
        }
    }

    function getScrollProgress() {
        const documentHeight = document.body.offsetHeight;
        const documentWidth = document.body.offsetWidth;

        const viewableHeight = window.innerHeight;
        const viewableWidth = window.innerWidth;

        const scrollYOffset = window.scrollY;

        let progress = (scrollYOffset / (documentHeight - viewableHeight)) * 100;

        return Math.min(progress, 100);
    }

    function getPosts() {
        return fetch(`/api/posts?start=${postsLoadedAlready}&size=${postsToLoad}`)
            .then(body => body.json())
            .then(nodes => {
                postsLoadedAlready += nodes.length;
                nodes.forEach((node) => renderPost(node))
            });
    }

    function renderPost(post) {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.innerHTML = post;

        document.getElementById('posts').append(postEl);
    }

    function onAtEndOfPage(progress) {
        if (progress >= 100) {
            getPosts();
            console.log('on end of page');
        }
    };

});