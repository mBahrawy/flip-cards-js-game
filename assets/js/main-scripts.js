// Add radio button effect

$('input[type="radio"]').change(function () {

    $('input[type="radio"]').next('label').removeClass('checked');
    if ($(this).is(':checked')) {
        $(this).next('label').addClass('checked');
        } else {
        $(this).next('label').removeClass('checked');
    }
});

