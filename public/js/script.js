
//-------------      OPEN DIALOG 		  

function OpenDialog(id, parameters) {

    if (!parameters.hasOwnProperty('resizable')) {
        parameters.resizable = false;
    }
    parameters.modal = true;
    // closeonescape only works when the focus is on the dialog
    // focus in only activated if there is at least on input in the dialog
    jQuery('#' + id).dialog(parameters);
    if (parameters.hasOwnProperty("closeOnEscape")) {
        if (jQuery("#" + id).find("input").length == 0) {
            jQuery("#" + id + " a.button").focus();
        }
    }
    jQuery('.ui-widget-overlay').show();
    jQuery('body').addClass('no-scroll');
}
(function ($) {
jQuery('.dialog_training_close').click(function (e) {
    e.preventDefault();
    jQuery('#dialog_training_center_detail').dialog('close');
    jQuery('.ui-widget-overlay').hide();
    jQuery('body').removeClass('no-scroll');
});

jQuery('.info-slider').slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    // adaptiveHeight: true,
});
})(jQuery)