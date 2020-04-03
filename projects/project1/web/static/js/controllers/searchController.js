var SearchController = function () {

    let timeout = null;
    let loading = false;
    let data = [];
    let name = "majid"

    /**
     * 
     * @param {string} query 
     */
    function onSearch(query) {
        loading = true;

        debounce(500, () => {
            SearchService.getBookSuggestions(query)
                .then((data) => {
                    this.data = data;
                });
        })
    }

    function debounce(debounceDuration, callback) {
        // clearTimeout removes the timeout so if we type again it removes the previous one
        clearTimeout(timeout);

        // after debounceDuration execute the callback i.e call the server
        timeout = setTimeout(callback, debounceDuration)
    }

    return {
        onSearch: onSearch
    }

}(SearchService);