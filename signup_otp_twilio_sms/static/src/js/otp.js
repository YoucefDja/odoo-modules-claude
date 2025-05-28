odoo.define('signup_otp_twilio_sms.otp', function(require) {
    "'use strict';\n";
    var core = require('web.core');
    var ajax = require('web.ajax');
    var rpc = require('web.rpc');
    var Dialog = require('web.Dialog');
    var QWeb = core.qweb;
    var _t = core._t;

    var phone ;
    var otp_value;
    var final_result;
    var reset_phone;
    var alert_dismiss_delay = 3000;

    $(document).ready(function(){
        if($(this).find(".reset-otp")){
         $(this).find(".reset-otp").addClass('o_hidden')
        }
        if($(this).find(".reset-otp-verify")){
         $(this).find(".reset-otp-verify").addClass('o_hidden')
        }
        if($(this).find("#success-alert")){
         $(this).find("#success-alert").addClass('o_hidden')
        }
        if($(this).find("#danger-alert-partner")){
         $(this).find("#danger-alert-partner").addClass('o_hidden')
        }
        if($(this).find("#success-alert-partner")){
         $(this).find("#success-alert-partner").addClass('o_hidden')
        }

        if($(this).find("#reset_password_page").val() == 'true'){
            $(this).find("#reset_password_page").addClass('o_hidden');
            $(this).find(".field-mobile").addClass('o_hidden');
            $(this).find(".field-email").addClass('o_hidden');
            var login_value = $(this).find("#login").val();
            var emailReg = new RegExp("^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$");

            if(!emailReg.test(login_value)){
                $(this).find("#label_login").text("Your Mobile");
                $(this).find("#mobile").val(login_value);
            }
            else{
                $(this).find("#email").val(login_value);
            }

        }


        if(document.querySelector("#otp") && $("#signup_field_set").val() =='true'){
            var self = this;
            var signup_user_btn = $(this).find(".btn-signup-user")
            var sigup_button = $(this).find(".btn");
            var verify_button = $(this).find(".verify-signup");
            var signup_resend_otp_link = $(this).find(".signup-resend-otp");

            sigup_button.addClass('o_hidden');
            verify_button.addClass('o_hidden');
            signup_user_btn.addClass('o_hidden');

            var otp_button = $(this).find(".otp-verify");
            otp_button.addClass('btn-primary btn');
            otp_button.removeClass('o_hidden');


            $(this).find(".otp-verify").on('click', function(ev){
                ev.preventDefault();
                if (!$(".oe_signup_form")[0].checkValidity()) {
                    $(".oe_signup_form").find("#submit-hidden").click();
                }
                else{

                sigup_button.addClass('o_hidden');
                otp_button.addClass('o_hidden');
                verify_button.removeClass('o_hidden');

                

                if($(self).find("#phone")){
                    var phone_value = $(self).find("#phone").val()
                    var code = $(self).find("#countrycode").val()
                    var symbol = '+'
                    phone = symbol.concat(code,phone_value);
                    ajax.jsonRpc('/otp', 'call', {'phone': phone}).then(function (result) {
                        if (result[0] == 'config_parameter')
                        {
                        $(".field-confirm_password").after($('<p>', {
                                id:"config_msg",
                                class: 'alert-danger',
                                text: "Please check your config parameter."}))
                        $(self).find("#config_msg").fadeTo(10000, 100).slideUp(100, function(){
                            $(self).find("#config_msg").slideUp(100);
                        });

                        }
                        if (result[0] == true)
                        {
                        // if every thing is good from twillo response 

                            // hide input field
                            $(self).find(".field-login").addClass('o_hidden');
                            $(self).find(".field-email").addClass('o_hidden');
                            $(self).find(".field-otp").removeClass('o_hidden');
                            $(self).find(".field-name").addClass('o_hidden');
                            $(self).find(".field-password").addClass('o_hidden');
                            $(self).find(".field-confirm_password").addClass('o_hidden');
                            $(self).find("#phone").attr('readonly', 'readonly');


                        $(self).find("#success-alert-signup").removeClass('o_hidden')
                        $(self).find("#success-alert-signup").fadeTo(60000, 500).slideUp(500, function(){
                        $(self).find("#success-alert-signup").slideUp(500);
                        });
                                var countDownDate = new Date();
                                countDownDate.setMinutes( countDownDate.getMinutes() + 5 );
                                // countDownDate = new Date().getTime();

                                // Update the count down every 1 second
                                var x = setInterval(function() {

                                  // Get today's date and time
                                  var now = new Date().getTime();

                                  // Find the distance between now and the count down date
                                  var distance = countDownDate - now;
                                  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                                  // Output the result in an element with id="demo"
                                  document.getElementById("demo").innerHTML = "Resend OTP in: " +  minutes + " min : " + seconds + " sec. ";
                                  signup_resend_otp_link.addClass('o_hidden');
                                  if (distance < 0) {
                                    clearInterval(x);
                                    document.getElementById("demo").innerHTML = "";
                                    signup_resend_otp_link.removeClass('o_hidden');
                                  }
                                }, 1000);
                            }
                        else
                        {
                        // if something is wrong is from twillo response 
                        $(".field-confirm_password").after($('<p>', {
                                id:"warning_msg",
                                class: 'alert-danger',
                                text: result[2]}))
                        $(self).find("#warning_msg").fadeTo(20000, 100).slideUp(100, function(){
                            $(self).find("#warning_msg").slideUp(100);
                        });

                            var verify_button = $(".verify-signup");
                            verify_button.addClass('o_hidden')
                            var verify_otp_button = $(".otp-verify");
                            verify_otp_button.removeClass('o_hidden')
                        }

                    });
                }
                }
            });
            $(this).find("#signup-resend-otp-link").on('click', function(ev){
                ev.preventDefault();
                sigup_button.addClass('o_hidden');
                otp_button.addClass('o_hidden');
                verify_button.removeClass('o_hidden');

                // hide input field
                $(self).find(".field-login").addClass('o_hidden');
                $(self).find(".field-email").addClass('o_hidden');
                $(self).find(".field-otp").removeClass('o_hidden');
                $(self).find(".field-name").addClass('o_hidden');
                $(self).find(".field-password").addClass('o_hidden');
                $(self).find(".field-confirm_password").addClass('o_hidden');
                $(self).find("#phone").attr('readonly', 'readonly');

                if($(self).find("#phone")){
                    var phone_value = $(self).find("#phone").val()
                    var code = $(self).find("#countrycode").val()
                    var symbol = '+'
                    phone = symbol.concat(code,phone_value);
                    ajax.jsonRpc('/otp', 'call', {'phone': phone}).then(function (result) {
                        $(self).find("#success-alert-signup").removeClass('o_hidden')
                        $(self).find("#success-alert-signup").fadeTo(60000, 500).slideUp(500, function(){
                        $(self).find("#success-alert-signup").slideUp(500);
                        });
                                var countDownDate = new Date();
                                countDownDate.setMinutes( countDownDate.getMinutes() + 5 );
                                // countDownDate = new Date().getTime();

                                // Update the count down every 1 second
                                var x = setInterval(function() {

                                  // Get today's date and time
                                  var now = new Date().getTime();

                                  // Find the distance between now and the count down date
                                  var distance = countDownDate - now;
                                  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                                  // Output the result in an element with id="demo"
                                  document.getElementById("demo").innerHTML = "Resend OTP in: " +  minutes + " min : " + seconds + " sec. ";
                                  signup_resend_otp_link.addClass('o_hidden');
                                  if (distance < 0) {
                                    clearInterval(x);
                                    document.getElementById("demo").innerHTML = "";
                                    signup_resend_otp_link.removeClass('o_hidden');
                                  }
                                }, 1000);
                    });
                }


            });

            verify_button.addClass('btn-primary btn');

            $(this).find(".verify-signup").on('click', function(ev){
                ev.preventDefault();
                var new_signup_button = $(this).find(".otp-verify");
                otp_value = $(self).find("#otp").val();
                ajax.jsonRpc('/otp/verify', 'call', {'phone': phone,'otp_value':otp_value}).then(function (result) {
                    final_result = result;
                    if(phone){
                        if(final_result == true){
                            new_signup_button.addClass('o_hidden');
                            verify_button.addClass('o_hidden');
                            $(self).find(".field-mobile").addClass('o_hidden');
                            $(self).find(".field-otp").addClass('o_hidden');
                            signup_user_btn.click();
                        }
                        else{
                            $(self).find("#danger-alert").removeClass('o_hidden')
                            $(self).find("#danger-alert").fadeTo(alert_dismiss_delay, 500).slideUp(500, function(){
                              $(self).find("#danger-alert").slideUp(500);
                            });
                            $(self).find("#otp").val('')
                        }
                    }
                });
            });
            signup_user_btn.on('click', function(ev){
                $(self).find(".field-login").removeClass('o_hidden');
                $(self).find(".field-email").removeClass('o_hidden');
                $(self).find(".field-name").removeClass('o_hidden');
                $(self).find(".field-password").removeClass('o_hidden');
                $(self).find(".field-confirm_password").removeClass('o_hidden');
            });
        }

        var field_login = $(this).find(".field-login");
        var field_mobile = $(this).find(".field-mobile");
        var confirm_button = $(this).find(".btn-primary");
        var reset_otp_button = $(this).find(".reset-otp");
        var otp_verify_button = $(this).find(".reset-otp-verify");
        var radio_button_value ;
        var phone_value_reset;
        var reset_otp_field = $(this).find(".reset-otp-field");

        if($(this).find("#reset_number").val() =='true'){
            var resend_otp_link = $(this).find(".reset-resend-otp");
            $("#success-alert").hide();
            field_login.addClass('o_hidden');
            confirm_button.addClass('o_hidden');
            reset_otp_button.addClass('o_hidden');
            reset_otp_field.addClass('o_hidden');
            otp_verify_button.addClass('o_hidden');
            var self = this;

            if($("input:radio[name=selectAll]").val()== 'email'){
                field_login.removeClass('o_hidden');
                confirm_button.removeClass('o_hidden');
                reset_otp_button.addClass('o_hidden');
                otp_verify_button.addClass('o_hidden');
                reset_otp_field.addClass('o_hidden');
            }

            $("input:radio[name=selectAll]").on( "change", function() {
                $(self).find(".field-login").val('');
                $(self).find(".field-mobile").val('');
                 if($(this).val() == 'email'){
                    location.reload();
                    $(".reset-otp").removeClass("button disabled");
                    $(".reset-otp").removeAttr('disabled', 'disabled');
                    radio_button_value = $(this).val();
                    field_mobile.addClass('o_hidden');
                    field_login.removeClass('o_hidden');
                    $(self).find(".field-login").val('');
                    $(self).find(".field-mobile").val('');
                    confirm_button.removeClass('o_hidden');
                    reset_otp_button.addClass('o_hidden');
                    otp_verify_button.addClass('o_hidden');
                    reset_otp_field.addClass('o_hidden');
                    $(self).find("#mobile").removeAttr('readonly');
                 }

                 if($(this).val() == 'mobile'){
                    var input = document.querySelector("#mobile");
                    var errorMsg = document.querySelector("#error-msg");
                    var validMsg = document.querySelector("#valid-msg");
                    var iti = window.intlTelInput(input, {
                        initialCountry: "auto",
                        autoPlaceholder: "aggressive",
                        separateDialCode: true,
                        geoIpLookup: function(success, failure) {
                            $.get("http://ip-api.com/json/?fields=status,countryCode", function() {}, "jsonp").always(function(resp) {
                                var countryCode = (resp && resp.countryCode) ? resp.countryCode : "us";
                                success(countryCode);
                            });
                        },
                        customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
                            return selectedCountryPlaceholder;
                        },
                    });

                    // here, the index maps to the error code returned from getValidationError - see readme
                    var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
                    var reset = function() {
                        input.classList.remove("error");
                        errorMsg.innerHTML = "";
                        errorMsg.classList.add("o_hidden");
                        validMsg.classList.add("o_hidden");
                    };

                    var countryData = iti.getSelectedCountryData();
                    select_val = countryData['dialCode']
                    $("#countrycode").val(select_val);

                    var checkMobileNumber = function() {
                        reset();
                        if (input.value.trim()) {
                            if (iti.isValidNumber()) {
                                $(".btn-primary").removeClass("button disabled");
                                $(".btn-primary").removeAttr('disabled', 'disabled');
                                validMsg.classList.remove("o_hidden");
                                codenumber = $("#mobile").val();
                                var symbol = '+'
                                var res = symbol.concat(select_val,codenumber);
                                var mobile_number = $("#numbercode").val(res);
                                $("#login").val(res);
                            } else {
                                $(".btn-primary").attr('disabled', 'disabled');
                                $(".btn-primary").addClass("button disabled");
                                input.classList.add("error");
                                var errorCode = iti.getValidationError();
                                errorMsg.innerHTML = errorMap[errorCode];
                                errorMsg.classList.remove("o_hidden");
                            };
                        };
                    };

                    input.addEventListener("countrychange", function() {
                        // do something with iti.getSelectedCountryData()
                        var countryData = iti.getSelectedCountryData();
                        select_val = countryData['dialCode']
                        $("#countrycode").val(select_val);
                        checkMobileNumber();
                    });

                    if($("#mobile")){
                        $(".btn-primary").attr('disabled', 'disabled');
                        $(".btn-primary").addClass("button disabled");
                        $(".field-login").addClass('o_hidden');
                    };
             // on keyup: validate and check mobile number
                    input.addEventListener('keyup', checkMobileNumber);
            // change flag: reset
                    input.addEventListener('change', reset);
                    $(".reset-otp").attr('disabled', 'disabled');
                    $(".reset-otp").addClass("button disabled");
                    radio_button_value =  $(this).val();
                    field_login.addClass('o_hidden');
                    field_mobile.removeClass('o_hidden');
                    $(self).find(".field-login").val('');
                    $(self).find("#mobile").val('');
                    var validMsg = document.querySelector("#valid-msg");
                    validMsg.classList.add("o_hidden");
                    confirm_button.addClass('o_hidden');
                    reset_otp_button.removeClass('o_hidden');
                    otp_verify_button.addClass('o_hidden');
                 }
            });

            $(this).find(".reset-otp").on('click', function(ev){
                ev.preventDefault();
                $(self).find("#mobile").attr('readonly', 'readonly');
                if(radio_button_value == 'mobile'){
                    phone_value_reset = $(self).find("#mobile").val()
                    var code = $(self).find("#countrycode").val()
                    var symbol = '+'
                    reset_phone = symbol.concat(code,phone_value_reset);
                    ajax.jsonRpc('/partner_verify/otp', 'call', {'phone': reset_phone,'check_phone':phone_value_reset}).then(function (result) {
                        if(result == false){
                            $(self).find(".field-login").val('');
                            $(self).find(".field-mobile").val('');
                            reset_otp_field.addClass('o_hidden');
                            $(self).find("#mobile").removeAttr('readonly');
                            otp_verify_button.addClass('o_hidden');
                            reset_otp_button.removeClass('o_hidden');

                            $(self).find("#danger-alert-partner").removeClass('o_hidden')
                            $(self).find("#danger-alert-partner").fadeTo(5000, 500).slideUp(500, function(){
                              $(self).find("#danger-alert-partner").slideUp(500);
                            });

                        }else{
                            reset_otp_field.removeClass('o_hidden');
                            $(self).find("#mobile").attr('readonly');
                            otp_verify_button.removeClass('o_hidden');
                            reset_otp_button.addClass('o_hidden');
                            $(self).find("#success-alert-partner").removeClass('o_hidden')
                            $(self).find("#success-alert-partner").fadeTo(60000, 500).slideUp(500, function(){
                              $(self).find("#success-alert-partner").slideUp(500);
                            });
                                // Set the date we're counting down to
                                var countDownDate = new Date();
                                countDownDate.setMinutes( countDownDate.getMinutes() + 5 );
                                // countDownDate = new Date().getTime();

                                // Update the count down every 1 second
                                var x = setInterval(function() {

                                  // Get today's date and time
                                  var now = new Date().getTime();

                                  // Find the distance between now and the count down date
                                  var distance = countDownDate - now;

                                  // Time calculations for days, hours, minutes and seconds
                                  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                                  // Output the result in an element with id="demo"
                                  document.getElementById("demo").innerHTML = "Resend OTP in: " +  minutes + " min : " + seconds + " sec. ";
                                  resend_otp_link.addClass('o_hidden');
                                  if (distance < 0) {
                                    clearInterval(x);
                                    document.getElementById("demo").innerHTML = "";
                                    resend_otp_link.removeClass('o_hidden');
                                  }
                                }, 1000);
                        }
                    });

                }
            });
            $(this).find("#reset-resend-otp-link").on('click', function(ev){
                ev.preventDefault();
                ajax.jsonRpc('/partner_verify/otp', 'call', {'phone': reset_phone,'check_phone':phone_value_reset}).then(function (result) {
                resend_otp_link.addClass('o_hidden');
                if(result == false){
                            $(self).find(".field-login").val('');
                            $(self).find(".field-mobile").val('');
                            reset_otp_field.addClass('o_hidden');
                            $(self).find("#mobile").removeAttr('readonly');
                            otp_verify_button.addClass('o_hidden');
                            reset_otp_button.removeClass('o_hidden');


                            $(self).find("#danger-alert-partner").removeClass('o_hidden')
                            $(self).find("#danger-alert-partner").fadeTo(5000, 500).slideUp(500, function(){
                              $(self).find("#danger-alert-partner").slideUp(500);
                            });

                        }else{
                            reset_otp_field.removeClass('o_hidden');
                            $(self).find("#mobile").attr('readonly');
                            otp_verify_button.removeClass('o_hidden');
                            reset_otp_button.addClass('o_hidden');
                            $(self).find("#success-alert-partner").removeClass('o_hidden')
                            $(self).find("#success-alert-partner").fadeTo(60000, 500).slideUp(500, function(){
                              $(self).find("#success-alert-partner").slideUp(500);
                            });

                                // Set the date we're counting down to
                                var countDownDate = new Date();
                                countDownDate.setMinutes( countDownDate.getMinutes() + 5 );
                                // countDownDate = new Date().getTime();

                                // Update the count down every 1 second
                                var x = setInterval(function() {

                                  // Get today's date and time
                                  var now = new Date().getTime();

                                  // Find the distance between now and the count down date
                                  var distance = countDownDate - now;

                                  // Time calculations for days, hours, minutes and seconds
                                  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                                  // Output the result in an element with id="demo"
                                  document.getElementById("demo").innerHTML = "Resend OTP in: " + minutes + " min : " + seconds + " sec. ";
                                  resend_otp_link.addClass('o_hidden');
                                  if (distance < 0) {
                                    clearInterval(x);
                                    document.getElementById("demo").innerHTML = "";
                                    resend_otp_link.removeClass('o_hidden');
                                  }
                                }, 1000);
                        }
                });

            });

            otp_verify_button.on('click', function(ev){
                ev.preventDefault();
                otp_value = $(self).find("#reset-otp-field").val();
                ajax.jsonRpc('/otp/verify', 'call', {'phone': reset_phone,'otp_value':otp_value}).then(function (result) {
                    final_result = result;
                    if(final_result == true){
                        ajax.jsonRpc('/otp/reset', 'call', {'phone': reset_phone,'check_phone':phone_value_reset}).then(function (result) {
                            var reset_url = encodeURI(result);
                            window.location.replace(reset_url);
                        });
                    }
                    else{
                        $(self).find("#reset-otp-field").val('')
                        $(self).find("#success-alert").removeClass('o_hidden')
                        $(self).find("#success-alert").fadeTo(alert_dismiss_delay, 500).slideUp(500, function(){
                          $(self).find("#success-alert").slideUp(500);
                        });
                    }
                });
            });
        }
    });
});
