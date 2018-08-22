$(function() {
	
	$.ajax({
		type: "GET",
		url: "http://504080.com/api/v1/directories/enquiry-types",
		success: function(enquiryType) {
			renderEnquiryType(enquiryType.data);			
		}
	});

	function renderEnquiryType(data) {
		let enquiryTypes = '';
		for(let type in data) {
			enquiryTypes += `<option value="${+type+1}">${data[type].name}</option>`;
		}
		let val = $('#enquiryType').html(enquiryTypes);
		let input = $('input[name="enquiry_type"]').val(data[0].name);
		
		$('#enquiryType').change(function() {
			let val = $(this).val();
			if($(this).val() == 7) {
				input.attr('type', 'text');
				input.val('');
			} else {
				input.attr('type', 'hidden');
				input.val($(this).find(`option[value="${val}"]`).text());
			}
		});
	}


	function characterСounter(elem, count) {
		elem.on('input', function() {
			count.text($(this).val().length);
		});
	}

	characterСounter($('#descriptionForm'), $('.counterText span'));

	$('#form').validate({
		rules: {
			department: {
				required: true,
			},
			enquiry_type: {
				required: true,
			},
			user_name: {
				required: true,
			},
			email: {
				required: true,
				email: true,
			},
			subject: {
				required: true,
			},
			description: {
				required: true,
				maxlength: 1000
			}
		},
		submitHandler: function(form) {
			let fd = new FormData();

			if($('#fileForm')[0].files[0]) {
				fd.append('file', $('#fileForm')[0].files[0]);
			}

			let data = $(form).serializeArray();
			$.each(data, function(key, input){
				fd.append(input.name,input.value);
			});

	   	$.ajax({
				type: "POST",
				url: "http://504080.com/api/v1/support",
				data: fd,
				contentType: false,
				processData: false,
				success: function(data) {
					modal('Success', data.data.message);
					$(form).trigger('reset');
					$('.counterText span').text('0');
					$('.wrapperFile label .wrapperImg').remove();
					$('#other').attr('type', 'hidden');
				},
				error: function(error) {
					modal('Error', error.responseJSON.error.description);
				}
			});
 		}
	});

	function modal(type, message) {
		$.magnificPopup.open({
	  	items: {	
		  	src: `<div id="modal">
								<span>${type}</span>
								<p>${message}</p>
							</div>`,
		  	type:'inline'
	  	}
		});
	}

	function readURL(input, maxSize, maxWidth, maxHeight, errorContainer) {
		errorContainer.html('');
		$('.wrapperFile label .wrapperImg').remove();

		let file = input.files;
	  if (file && file[0]) {
	    let reader = new FileReader();

	    let type = file[0].type;
  		if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png') {
  			$('#fileForm').val('');
  			errorContainer.html(`<label class="errorFile">Unsupported file type.</label>`);
  			return false;
  		}
  		if(file[0].size > maxSize) {
  			$('#fileForm').val('');
  			errorContainer.html(`<label class="errorFile">Maximum size of the uploaded image should not exceed 5MB.</label>`);
  			return false;
  		} 
  		
	    reader.onload = function(e) {
  			let img = new Image();
  			img.src = e.target.result;
  			img.onload = function() {
        	if(this.width > maxWidth || this.height > maxHeight) {
        		$('#fileForm').val('');
        		errorContainer.html(`<label class="errorFile">Maximum size of 300x300.</label>`);
        	} else {
  					$('.wrapperFile label').append(`<div class="wrapperImg"><img src="${e.target.result}" alt="" /></div>`);
        	}
      	}
	    }
	    reader.readAsDataURL(file[0]);
	  }
	}

	$('#fileForm').change(function() {
  	readURL(this, 50000, 300, 300, $('#errorContainer'));
	});

});