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

    	// FIXME: isNetworkAvailable() does not work
		if (config.isMobile) {
			// if (device.isNetworkAvailable()) {
	    	if (true) {
	    		distance.requestDistance();
	    	} else {
	    		hideError();
	    		attachError(this);
	    		$('#formNetworkError').fadeIn(300);
	    	}
    	} else {
    		distance.requestDistance();
    	}
			
	};

	// validate form function starts
	function validateForm(currentForm, formType){		
		
		hideError();

		$('#' + currentForm + ' .requiredField').each(function(i){		   	 
			if($(this).val() == '' || $(this).val() == $(this).attr('data-dummy')){				
				attachError(this);
				$('#' + $(this).attr('id') + 'ErrorEmpty').fadeIn(300);
				return false;					   
			};			
			if($(this).hasClass('requiredPostalCodeField')){
				var cpText = $(this).val();
				var isnum = /^\d+$/.test(cpText);
				if (isnum) {
					var cpLength = cpText.length;
					if(cpLength < 4){
						attachError(this);
						$('#' + $(this).attr('id') + 'ErrorLength').fadeIn(300);
						return false;					   
					}
				} else {
					attachError(this);
					$('#' + $(this).attr('id') + 'ErrorCharacter').fadeIn(300);
					return false;
				}
			};			
			if(i == $('#' + currentForm + ' .requiredField').length - 1){
			 	submitData(currentForm, formType);
			};			  
   		});		
	};

	function hideError () {
	    $('.formValidationError').hide();
		$('.fieldHasError').removeClass('fieldHasError');
	};

	function attachError (obj) {
	    $(obj).val($(obj).attr('data-dummy'));	
		$(obj).focus();
		$(obj).addClass('fieldHasError');
	};
	
	$('#contactSubmitButton').click(function() {
		if (config.isMobile)
			cordova.plugins.Keyboard.close();	
		validateForm($(this).attr('data-formId'));	
	    return false;		
	});
	
	
	
});