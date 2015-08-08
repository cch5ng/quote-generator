
//event handler
function btnClickHandler(evt) {
	var hitchcockUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Alfred%20Hitchcock&prop=revisions&rvprop=content&callback=wikiCallback';

	$.ajax({
		dataType: 'jsonp',
		url: hitchcockUrl,
		success: function(data) {
			//console.log('got data');
			//console.log(data);
			var content = data.query.pages['3483']['revisions']['0']['*'];
			console.log(content);
		}
	});

}

//event listener
var btn = document.getElementById('quoteBtn');
btn.addEventListener('click', btnClickHandler);