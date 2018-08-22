$(function() {

	$.ajax({
		type: "GET",
		url: "http://504080.com/api/v1/services/categories",
		headers: {
			'Authorization': 'e6cbb450cdfed5a75eff6ebab85623d05888f138'
		},
		success: function(services) {
			renderServices(services.data);
		},
		error: function(error) {
			errorServices(error.responseJSON.error.description);
		}
	});

	function renderServices(data) {
		let servicesHtml = '';
		for(let service of data) {
			servicesHtml += `<li>
												<a href="">
													<div class="serviceImg"><img src="http:${service.icon}" alt="${service.title}" /></div>
													<h2>${service.title}</h2>
												</a>
											</li>`;
		}
		$('.services').show().find('ul').html(servicesHtml);
		new LastRow('.services ul', 'li');
	}

	function errorServices(description) {
		$.magnificPopup.open({
	  	items: {	
		  	src: `<div id="modal">
								<span>Error</span>
								<p>${description}</p>
							</div>`,
		  	type:'inline'
	  	}
		});
	}

	class LastRow {
		constructor(container, item) {
			this.item = $(container + ' ' + item);
			this.container = $(container);
			this.getSizes();
			this.amountItems = item.length;
			this.html();
		}

		getSizes() {
			this.widthRow = this.container.width();
			this.widthItem = this.item.outerWidth(true);
		}

		resize() {
			$(window).resize(function() {
				this.getSizes();
				this.html();
			});
		}

		amountLastRow() {
			let amountRow = Math.floor( this.widthRow / this.widthItem );
			return this.amountItems - Math.floor( this.amountItems / amountRow) * amountRow;
		}

		html() {
			this.container.remove('.stub');
			let stub = `<div class="stub" style="width:${this.widthItem}px;"></div>`;
			let allStub = ''; 
			let amountLastRow = this.amountLastRow();

			while(amountLastRow > 0) {
				amountLastRow--;
				allStub += stub;
			}

			this.container.append(allStub);
		}
	}

	function trancateText(element, size) {
		$(element).each(function() {
			let text = $(this).text();
			if(text.length > size){
				$(this).text(text.slice(0, size) + '...');
			}
		});
	}

	trancateText('.products .text p', 75);
	trancateText('.people .text p', 25);

});