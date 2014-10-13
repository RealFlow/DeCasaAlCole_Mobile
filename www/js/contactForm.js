var $ = jQuery.noConflict(); 

jQuery(document).ready(function($) {	

	$('#formSuccessMessageWrap').hide(0);
	$('.formValidationError').fadeOut(0);
	
	$('input[type="text"], input[type="password"], textarea').focus(function(){
		if($(this).val() == $(this).attr('data-dummy')){
			$(this).val('');
		};	
	});

	$('input, textarea').blur(function(){
    	if($(this).val() == ''){		    
			$(this).val($(this).attr('data-dummy'));				
		};			
	});
	   
    function submitData(currentForm, formType){ 

		var formInput = $('#' + currentForm).serialize();	

		var defaultSettings = {
			url : $('#' + currentForm).attr('action'),
			type: "POST",
		    data : formInput,
		    dataType: 'jsonp',
		    success: function(data, textStatus, jqXHR)
		    {

		    	console.log("Distance App: requestGeometry SUCCESS");
		    	$('#' + currentForm).hide();
				$('#formSuccessMessageWrap').fadeIn(500);
		    },
		    error: function (jqXHR, textStatus, errorThrown)
		    {
		    	var errorField = $("#formAjaxError");
				errorField.fadeIn(300);
		    }
		};

		
		// FIXME: isNetworkAvailable() does not work
		if (config.isMobile) {
			// if (device.isNetworkAvailable()) {
	    	if (true) {
	    		$.ajax(defaultSettings);
	    	} else {
	    		hideError();
	    		attachError(this);
	    		$('#formNetworkError').fadeIn(300);
	    	}
    	} else {
    		$.ajax(defaultSettings);
    	}
	};
	// submit form data function starts	
	// validate form function starts
	function validateForm(currentForm, formType){		
		// hide any error messages starts
	    $('.formValidationError').hide();
		$('.fieldHasError').removeClass('fieldHasError');
	    // hide any error messages end

		$('#' + currentForm + ' .requiredField').each(function(i){		   	 
			if($(this).val() == '' || $(this).val() == $(this).attr('data-dummy')){				
				$(this).val($(this).attr('data-dummy'));	
				$(this).focus();
				$(this).addClass('fieldHasError');
				$('#' + $(this).attr('id') + 'ErrorEmpty').fadeIn(300);
				return false;					   
			};			
			if($(this).hasClass('formContactRequiredEmailField')){
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				var tempField = '#' + $(this).attr('id');				
				if(!emailReg.test($(tempField).val())) {
					$(tempField).focus();
					$(tempField).addClass('fieldHasError');
					$(tempField + 'Error').fadeIn(300);
					return false;
				};		
			};			
			if(i == $('#' + currentForm + ' .requiredField').length - 1){
			 	submitData(currentForm, formType);
			};			  
   		});		
	};
	
	
	
	$('#contactSubmitButton').click(function() {
		if (config.isMobile)
			cordova.plugins.Keyboard.close();	

		validateForm($(this).attr('data-formId'));	
	    return false;		
	});
	
	
	
	
});