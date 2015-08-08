$(document).ready(function() {
  $('.text-primary').text('hi codepen!');
});

var hitchcockUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Alfred%20Hitchcock&prop=revisions&rvprop=content&callback=wikiCallback';

$.ajax({
	dataType: 'jsonp',
	url: hitchcockUrl,
	//data: data,
	success: function(data) {
		//console.log('got data');
		//console.log(data);
		var content = data.query.pages['3483']['revisions']['0']['*'];
		console.log(content);
	}
});