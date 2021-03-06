
//helper function

(function(DOMParser) {
	"use strict";

	var
	  proto = DOMParser.prototype
	, nativeParse = proto.parseFromString
	;

	// Firefox/Opera/IE throw errors on unsupported types
	try {
		// WebKit returns null on unsupported types
		if ((new DOMParser()).parseFromString("", "text/html")) {
			// text/html parsing is natively supported
			return;
		}
	} catch (ex) {}

	proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var
			  doc = document.implementation.createHTMLDocument("")
			;
	      		if (markup.toLowerCase().indexOf('<!doctype') > -1) {
        			doc.documentElement.innerHTML = markup;
      			}
      			else {
        			doc.body.innerHTML = markup;
      			}
			return doc;
		} else {
			return nativeParse.apply(this, arguments);
		}
	};
}(DOMParser));

//given length of array, returns a random index of the array
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIdx(length) {
	return Math.floor(Math.random() * (length));
}

//event handler
function quoteBtnClickHandler(evt) {
	// var hitchcockUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Alfred%20Hitchcock&prop=revisions&rvprop=content&callback=wikiCallback';
	// var kubrickUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Stanley%20Kubrick&prop=revisions&rvprop=content&callback=wikiCallback';
	var aesopUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Aesop&prop=revisions&rvprop=content&callback=wikiCallback';
	// var okeefeUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Georgia%20O%27Keeffe&prop=revisions&rvprop=content&callback=wikiCallback';
	//var grimmUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Brothers%20Grimm&prop=revisions&rvprop=content&callback=wikiCallback';
	//var andersenUrl = 'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Hans%20Christian%20Andersen&prop=revisions&rvprop=content&callback=wikiCallback';

	// var urlAr = [
	// 			'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Alfred%20Hitchcock&prop=revisions&rvprop=content&callback=wikiCallback',
	// 			'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Stanley%20Kubrick&prop=revisions&rvprop=content&callback=wikiCallback',
	// 			'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Aesop&prop=revisions&rvprop=content&callback=wikiCallback',
	// 			'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Georgia%20O%27Keeffe&prop=revisions&rvprop=content&callback=wikiCallback',
	// 			'https://en.wikiquote.org/w/api.php?format=json&action=query&titles=Brothers%20Grimm&prop=revisions&rvprop=content&callback=wikiCallback'
	// ];

	var randomIdx,
			quotesText = [];

	//var readBtn = document.getElementById('readBtn');
	$('#readBtn').removeClass('hidden');

	$.ajax({
		dataType: 'jsonp',
		url: aesopUrl, //urlAr[getRandomIdx(urlAr.length)],
		success: function(data) {
			var content = data.query.pages['79']['revisions']['0']['*']; //andersen
			var htmlData = markdown.toHTML(content);
			console.log('htmlData: ' + htmlData);
			//remove line breaks from HTML
			var htmlDataNoBreaks = htmlData.replace(/\r|\n/g, '');

			var parser = new DOMParser();
			var doc = parser.parseFromString(htmlDataNoBreaks, 'text/html');

			var quotes = doc.querySelectorAll('li > p'); //getElementsByTagName('li').$find('p');

			//skipping the last quote because it has such quirky formatting
			for (var i = 0; i < quotes.length - 1; i++) {
				var quoteObj = {};
				var quoteText = quotes[i].innerHTML;
				quoteText = quoteText.replace('**', '\n');
				//console.log(quoteText);

				//finding the index where the quote source begins
				var re = /'{2}/g;
				var idxSource = quoteText.search(re);
				//idxSource -= 2;

				//separating the source from the quote text
				var source = quoteText.slice(idxSource);
				console.log('uncleaned source: ' + source);
				//cleaning up formatting of source
				source = source.replace(re, "");
				source = source.replace(".", "");
				// var sourceAr = source.split('|');
				// source = sourceAr[0];
				quoteObj.source = '~' + source + '~';

				quoteObj.text = quoteText.slice(0, idxSource);

				quotesText.push(quoteObj);
			}

			randomIdx = getRandomIdx(quotesText.length);

			$('.quote').text(quotesText[randomIdx].text);
			$('.source').text(quotesText[randomIdx].source);

		}
	});


}

			//read button click handler
			function readBtnClickHandler() {
				var curQuote = document.querySelector('.quote');
				var curQuoteText = curQuote.innerText; //quotesText[randomIdx].text;
				console.log(curQuoteText);
				var voicePlayer = document.getElementById('voice-player');
				voicePlayer.setAttribute('text', curQuoteText);
				voicePlayer.speak();
			}

			//read button event listener
			var readBtn = document.getElementById('readBtn');
			readBtn.addEventListener('click', readBtnClickHandler);



//event listener
var quoteBtn = document.getElementById('quoteBtn');
quoteBtn.addEventListener('click', quoteBtnClickHandler);