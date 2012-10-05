//-------------------------------------------
// kafe.ext.twitter
//-------------------------------------------
kafe.extend({name:'twitter', version:'1.1.1', obj:(function(K,undefined){
	var $ = K.jQuery;

	// default params
	var _params = {
		href:        '', 
		text:        '',
		via:         '',
		related:     '',
		relatedText: '',
		type:        'none',
		lang:        K.env('lang')
	};

	
	// _mergeParams (options)
	// return merged params
	//-------------------------------------------
	function _mergeParams(options,defaults) {
		return $.extend({}, defaults, options);
	}


	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var twitter = {};
	
	// button (selector,options)
	// output tweet button in selector
	//-------------------------------------------
	twitter.button = function(selector,options) {
		K.required('//platform.twitter.com/widgets.js');
		var p = _mergeParams(options,_params);
		$(selector).html('<a href="//twitter.com/share" class="twitter-share-button" data-url="'+p.href+'" data-text="'+p.text+'" data-via="'+p.via+'" data-related="'+((p.related) ? p.related+((p.relatedText) ? ':'+p.relatedText : '') : '')+'" data-count="'+p.type+'" data-lang="'+p.lang+'">tweet</a>');
	};

	// setButtonParams (options)
	// set default tweet button params
	//-------------------------------------------
	twitter.setButtonParams = function() {
		_params = _mergeParams(arguments[0],_params);
	};

	// linkifyTweet (tweet, [options])
	// output tweet with links
	//-------------------------------------------
	twitter.linkifyTweet = function(tweet,options) {

		function _link($tmpl,data,link) {
			var $a = 
				$tmpl.clone()
					.attr('href', link+data)
					.text(data)
			;
			return $('<div>').append($a).html();
		}
		
		options   = (!!options) ? options : {}
		var $link = (!!options.link) ? $(options.link) : $('<a rel="external">');
		var $user = (!!options.user) ? $(options.user) : $('<a rel="external">');
		var $hash = (!!options.hash) ? $(options.hash) : $('<a rel="external">');

		tweet = tweet.replace(/[a-z]+:\/\/[a-z0-9-_]+\.[a-z0-9-_:~%&#\?\/.=]+[^:\.,\)\s*$]/ig, function (link) {
			return _link($link,link,'');
		});
		tweet = tweet.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15})/g, function (blank, prev, user) {
			return prev + '@' + _link($user,user,'//twitter.com/');
		});
		tweet = tweet.replace(/(^|[^\w'"]+)\#([a-zA-Z0-9_]+)/g, function (blank, prev, hash) {
			return prev + '#' + _link($hash,hash,'//search.twitter.com/search?q=%23');
		});
		
		return tweet;
	};

	return twitter;

})(kafe)});