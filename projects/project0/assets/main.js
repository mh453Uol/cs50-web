$(document).ready(function () {
    console.log("main.js loaded")
    $('.navbar-toggler').on('click', function () {
        $('#sidebar').toggleClass('sidebar-active');
    });
});