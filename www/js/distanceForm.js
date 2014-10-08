var $ = jQuery.noConflict(); 
var formSubmitted = 'false';

jQuery(document).ready(function($) {	

	$('#formSuccessMessageWrap').hide(0);
	$('.formValidationError').fadeOut(0);
	
	// fields focus function starts
	$('input[type="text"], input[type="password"], textarea').focus(function(){
		if($(this).val() == $(this).attr('data-dummy')){
			$(this).val('');
		};	
	});
	// fields focus function ends
		
	// fields blur function starts
	$('input, textarea').blur(function(){
    	if($(this).val() == ''){		    
			$(this).val($(this).attr('data-dummy'));				
		};			
	});
	// fields blur function ends
		
	// submit form data starts	   
    function submitData(currentForm, formType){     
		// formSubmitted = 'true';
		distance.requestDistance();
	};
	// submit form data function starts	
	// validate form function starts
	function validateForm(currentForm, formType){		
		// hide any error messages starts
	    $('.formValidationError').hide();
		$('.fieldHasError').removeClass('fieldHasError');
	    // hide any error messages ends	
		$('#' + currentForm + ' .requiredField').each(function(i){		   	 
			if($(this).val() == '' || $(this).val() == $(this).attr('data-dummy')){				
				$(this).val($(this).attr('data-dummy'));	
				$(this).focus();
				$(this).addClass('fieldHasError');
				$('#' + $(this).attr('id') + 'ErrorEmpty').fadeIn(300);
				return false;					   
			};			
			if($(this).hasClass('requiredPostalCodeField')){
				var cpText = $(this).val();
				var isnum = /^\d+$/.test(cpText);
				if (isnum) {
					var cpLength = cpText.length;
					if(cpLength < 4){
						$(this).val($(this).attr('data-dummy'));	
						$(this).focus();
						$(this).addClass('fieldHasError');
						$('#' + $(this).attr('id') + 'ErrorLength').fadeIn(300);
						return false;					   
					}
				} else {
					$(this).val($(this).attr('data-dummy'));	
					$(this).focus();
					$(this).addClass('fieldHasError');
					$('#' + $(this).attr('id') + 'ErrorCharacter').fadeIn(300);
					return false;
				}
			};			
			if(formSubmitted == 'false' && i == $('#' + currentForm + ' .requiredField').length - 1){
			 	submitData(currentForm, formType);
			};			  
   		});		
	};
	// validate form function ends	
	
	// contact button function starts
	$('#contactSubmitButton').click(function() {	
		validateForm($(this).attr('data-formId'));	
	    return false;		
	});
	// contact button function ends
	
	
	
});
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*//////////////////// Document Ready Function Ends                                                                       */
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
