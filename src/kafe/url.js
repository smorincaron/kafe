/* @echo header */

	var
		// parse url
		_parseIt = function(str,type) {
			switch (type) {
				case 'params':
					var
						data  = {},
						pairs = str.toString().split('&')
					;
					for (var i in pairs) {
						var e = pairs[i].toString().split('=');
						data[e[0]] = decodeURI(e[1]);
					}
					return data;

				case 'path':
					return str.toString().split('/');
			}
		}
	;


	/**
	* ### Version <!-- @echo VERSION -->
	* Manipulation tools for route-based urls.
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var url = {};

	/**
	* Parses a querystring as a key/value list and creates a javascript object.
	*
	* @method parseSearchParams
	* @param {String} [querystring=CURRENT_LOCATION_SEARCH]
	* @return {Object} An object represention of the querystring.
	* @example
	*	<!-- @echo NAME_FULL -->.parseSearchParams('?group=players&team=blue&ranking=3');
	*	// returns Object {group: "players", team: "blue", ranking: "3"}
	*/
	url.parseSearchParams = function(s) {
		s = (s) ? s : global.location.search;
		return _parseIt(s.toString().substring(1), 'params');
	};


	/**
	* Parses a querystring as a path and creates an ordered array.
	*
	* @method parseSearchPath
	* @param {String} [querystring=CURRENT_LOCATION_SEARCH]
	* @return {Array(String)} An array represention of the querystring path.
	* @example
	*	<!-- @echo NAME_FULL -->.parseSearchPath('?/Players/Teams/Blue');
	*	// returns ["Players", "Teams", "Blue"]
	*/
	url.parseSearchPath = function(s) {
		s = (s) ? s : global.location.search;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};


	/**
	* Parses a hash string as a key/value list and creates a javascript object.
	*
	* @method parseHashParams
	* @param {String} [hash=CURRENT_LOCATION_HASH]
	* @return {Object} An object represention of the hash string.
	* @example
	*	<!-- @echo NAME_FULL -->.parseHashParams('#color=blue&size=large&extras=false');
	*	// returns Object {color: "blue", size: "large", extras: "false"}
	*/
	url.parseHashParams = function(s) {
		s = (s) ? s : global.location.hash;
		return _parseIt(s.toString().substring(1), 'params');
	};


	/**
	* Parses a hash string as a path and creates an ordered array.
	*
	* @method parseHashPath
	* @param {String} [hash=CURRENT_LOCATION_HASH]
	* @return {Array(String)} An array represention of the hash path.
	* @example
	*	<!-- @echo NAME_FULL -->.parseHashPath('#/clothing/man/shirts');
	*	// returns ["clothing", "man", "shirts"]
	*/
	url.parseHashPath = function(s) {
		s = (s) ? s : global.location.hash;
		return (s.toString().substring(1,2) == '/') ? _parseIt(s.toString().substring(2), 'path') : [];
	};


	/**
	* Parses a hashbang (#!) as a key/value list and creates a javascript object.
	*
	* @method parseAjaxParams
	* @param {String} [hashbang=CURRENT_LOCATION_HASH]
	* @return {Object} An object represention of the hashbang.
	* @example
	*	<!-- @echo NAME_FULL -->.parseAjaxParams('#!color=blue&size=large&extras=false');
	*	// returns Object {color: "blue", size: "large", extras: "false"}
	*/
	url.parseAjaxParams = function(s) {
		s = (s) ? s : global.location.hash;
		return (s.toString().substring(1,2) == '!') ? _parseIt(s.toString().substring(2), 'params') : {};
	};


	/**
	* Parses a hashbang (#!) as a path and creates an ordered array.
	*
	* @method parseAjaxPath
	* @param {String} [hashbang=CURRENT_LOCATION_HASH]
	* @return {Array(String)} An array represention of the hashbang path.
	* @example
	*	<!-- @echo NAME_FULL -->.parseAjaxPath('#!/clothing/man/shirts');
	*	// returns ["clothing", "man", "shirts"]
	*/
	url.parseAjaxPath = function(s) {
		s = (s) ? s : global.location.hash;
		return (s.toString().substring(1,3) == '!/') ? _parseIt(s.toString().substring(3), 'path') : [];
	};


	/**
	* Delay link until promises are resolved.
	*
	* @method followLinkWhen
	* @param {Event} event Original click event
	* @param {Array} promises Array of promises
	*
	* @example
	*	<!-- @echo NAME_FULL -->.followLinkWhen(event, [
	*		<!-- @echo MODULE -->.ext.googletagmanager.track('checkout-type', { type: 'guest' }),
	*		<!-- @echo MODULE -->.ext.googletagmanager.track('checkout-step', { number: 2 })
	*	]);
	*/
	url.followLinkWhen = function(event, promises) {

		var $target = $(event.currentTarget);

		// Trying to guess if user requested a new window
		if ( !( event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button == 1) || $target.is('[data-external], [target]:not([target="_self"]):not([target="_parent"]):not([target="_top"])') )) {
			event.preventDefault();

			$.when.apply(this, promises).always(function() {
				global.location.assign($target.attr('href'));
			});
		}

	};


	return url;

/* @echo footer */