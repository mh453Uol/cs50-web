document.addEventListener('DOMContentLoaded', () => {
    getDimensions();

    window.onscroll = () => {
        getDimensions();
    }

    function getDimensions() {
        console.log('window.innerHeight', window.innerHeight);
        console.log('window.innerWidth', window.innerWidth);
        console.log('---------------------------------');
        console.log('document.body.offsetHeight', document.body.offsetHeight);
        console.log('document.body.offsetWidth', document.body.offsetWidth);
        console.log('---------------------------------');
        console.log('window.scrollY', window.scrollY);
        console.log('**************************************');

        const progress = getScrollProgress();
        const progressEl = document.querySelector('#progress');

        progressEl.style.width = `${progress}%`; 
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
});