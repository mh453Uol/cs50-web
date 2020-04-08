var SearchController = function () {

    let timeout = null;

    let view = {
        loading: false,
        data: {}
    }


    /**
     * 
     * @param {string} query 
     */
    function onSearch(query) {
        view.loading = true;
        updateSearchIcon();

        debounce(500, () => {
            SearchService.getBookSuggestions(query)
                .then((response) => {
                    view.loading = false;
                    view.data = response;
                    populateSuggestions(view.data);
                    updateSearchIcon();
                });
        })
    }

    function populateSuggestions(suggestions) {
        var source = document.getElementById("search-template").innerHTML;
        var template = Handlebars.compile(source);
        console.log(suggestions);
        var html = template(suggestions);

        document.getElementById("suggestions").innerHTML = html;
    }

    function updateSearchIcon() {
        let loadingIcon = document.getElementsByClassName("fa-spinner")[0]
        let searchIcon = document.getElementsByClassName("fa-search")[0]

        //console.log(loadingIcon, searchIcon);

        if (view.loading) {
            // show loading icon
            loadingIcon.classList.remove('d-none')
            searchIcon.classList.add('d-none')
        } else {
            // remove loading icon
            loadingIcon.classList.add('d-none')
            searchIcon.classList.remove('d-none')
        }
    }

    function debounce(debounceDuration, callback) {
        // clearTimeout removes the timeout so if we type again it removes the previous one
        clearTimeout(timeout);

        // after debounceDuration execute the callback i.e call the server
        timeout = setTimeout(callback, debounceDuration)
    }

    return {
        onSearch: onSearch,
        view: view
    }

}(SearchService);