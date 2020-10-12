document.addEventListener("DOMContentLoaded", function (event) {
    const locationField = document.getElementById("js-location");

    console.log(locationField);


    function j() {
        console.log(locationField.value);
    }

    locationField.onkeyup = j;  

});