var SearchService = function () {
    function getBookSuggestions(query, params) {
        return fetch(`/suggestions?q=${query}`, params)
            .then((response) => response.json())

    }

    return {
        getBookSuggestions: getBookSuggestions
    }
}();