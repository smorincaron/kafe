// @import 'libs/vendor/jquery/cookie'
// @import 'libs/vendor/jquery/json'
// @import 'libs/kafe/string'

/* {%= HEADER %} */

	var
		Modernizr = kafe.dependencies.Modernizr,

		LOCAL   = 1,
		SESSION = 2,


		// if storage type is available
		_isAvailable = function() {
			return (arguments[0] == LOCAL) ? Modernizr.localstorage : Modernizr.sessionstorage;
		},


		// get storage obj
		_getStorageObj = function() {
			return (arguments[0] == LOCAL) ? localStorage : sessionStorage;
		},



		// get data from storage
		_get = function(type, key) {
			if (_isAvailable(type)) {
				var
					sData = _getStorageObj(type).getItem(key),
					data = (sData) ? kafe.string.toObject(sData) : undefined
				;
				if (!!data) {

					if (!!data.expires && _.isDate(data.expires) && data.expires < new Date()) {
						_remove(type,key);

					} else if (!!data.expires && _.isString(data.expires)) {

						if (data.cookie != $.cookie(data.expires)) {
							_remove(type,key);

						} else {
							return data.data;
						}
					} else {
						return data.data;
					}
				}
			}
			return undefined;
		},


		// set data in storage
		_set = function(type,key,value,options) {
			if (_isAvailable(type)) {
				options = options || {};
				var data = {
					//modified: new Date(),
					data: value
				};

				if (!!options.expires) {
					if (_.isString(options.expires)) {
						data.cookie = $.cookie(options.expires);
						data.expires = options.expires;
					} else {
						data.expires = new Date( new Date().getTime()+(options.expires * 1000) );
					}
				}

				_getStorageObj(type).setItem(key, $.toJSON(data));
			}
		},



		// remove data from storage
		_remove = function(type,key) {
			if (_isAvailable(type)) {
				_getStorageObj(type).removeItem(key);
			}
		},


		// get namespace keys from storage
		_getNamespaceKeys = function(type,name) {
			if (_isAvailable(type)) {
				var
					data = [],
					root = _get(type, name),
					s    = _getStorageObj(type),
					r    = new RegExp('^'+name+':')
				;

				if (root !== undefined) {
					data.push(name);
				}

				for (var i in s) {
					if (r.test(i)) {
						if (_get(type,i) !== undefined) {
							data.push(i);
						}
					}
				}

				return data;
			}
			return undefined;
		},


		// get namespace data from storage
		_getNamespaceItems = function(type,name) {
			if (_isAvailable(type)) {

				var
					data = [],
					root = _get(type, name),
					s    = _getStorageObj(type),
					r    = new RegExp('^'+name+':')
				;
				if (root !== undefined) {
					data[name] = root;
				}

				for (var i in s) {
					if (r.test(i)) {
						var d = _get(type,i);
						if (d !== undefined) {
							data[i] = d;
						}
					}
				}

				return data;
			}
			return undefined;
		},


		// remove namespace data from storage
		_removeNamespace = function(type,name) {
			if (_isAvailable(type)) {

				_remove(type,name);

				var
					s = _getStorageObj(type),
					r = new RegExp('^'+name+':')
				;
				for (var i in s) {
					if (r.test(i)) {
						_remove(type,i);
					}
				}
			}
		},




		// get all keys from storage
		_getAllKeys = function(type) {
			if (_isAvailable(type)) {
				var
					data = [],
					s    = _getStorageObj(type)
				;
				for (var i in s) {
					if (_get(type,i) !== undefined) {
						data.push(i);
					}
				}

				return data;
			}
			return undefined;
		},


		// get all data from storage
		_getAllItems = function(type) {
			if (_isAvailable(type)) {
				var
					data = {},
					s    = _getStorageObj(type)
				;
				for (var i in s) {
					var d = _get(type,i);
					if (d !== undefined) {
						data[i] = d;
					}
				}

				return data;
			}
			return undefined;
		},


		// remove all data from storage
		_removeAll = function(type) {
			if (_isAvailable(type)) {
				_getStorageObj(type).clear();
			}
		}
	;




	/**
	* ### Version <%= VERSION %>
	* Easily access, sort and manipulate local and session storage values.
	*
	* @module <%= MODULE %>
	* @class <%= NAME_FULL %> 
	*/
	var storage = {};

	/**
	* Returns the local value for a specific key.
	*
	* @method getPersistentItem
	* @param {String} key
	* @return {String} If not expiration flag was trigged (cookie or datetime), returns the local storage value. Otherwise, returns *undefined*.
	* @example
	*	<%= NAME_FULL %>.getPersistentItem('history:last-visit');
	*/
	storage.getPersistentItem = function(key) {
		return _get(LOCAL,key);
	};


	/**
	* Returns the session value for a specific key.
	*
	* @method getSessionItem
	* @param {String} key
	* @return {String} If not expiration flag was trigged (cookie or datetime), returns the session storage value. Otherwise, returns *undefined*.
	* @example
	*	<%= NAME_FULL %>.getSessionItem('user:first-name');
	*/
	storage.getSessionItem = function(key) {
		return _get(SESSION,key);
	};


	/**
	* Sets the local value for a specific key with or without an expiration flag. Namespacing can be defined by using the ':' character.
	*
	* @method setPersistentItem
	* @param {String} key
	* @param {String} value
	* @param {Object} [options] Expiration parameters
	*	@param {String} [options.expires] Sets a cookie of the specified key as the expiration flag. Changes to the cookie's value will flag the local storage value for the provided key as expired.
	*	@param {Number} [options.expires] Sets a time based expiration flag in *seconds*. After that time period, the local storage value for the provided key will be flagged as expired.
	* @example
	*	<%= NAME_FULL %>.setPersistentItem('history:last-visit', '2013-07-21', { expires: 3600 });
	*	// The local storage value will return undefined in one hour.
	* @example
	*	<%= NAME_FULL %>.setPersistentItem('history:last-visit', '2013-07-21', { expires: 'last-visit-cookie' });
	*	// The local storage value will return undefined if the value of the cookie 'last-visit-cookie' is changed.
	*/
	storage.setPersistentItem = function(key,value,options) {
		_set(LOCAL,key,value,options);
	};


	/**
	* Sets the session value for a specific key with or without an expiration flag. Namespacing can be defined by using the ':' character.
	*
	* @method setSessionItem
	* @param {String} key
	* @param {String} value
	* @param {Object} [options] Expiration parameters
	*	@param {String} [options.expires] Sets a cookie of the specified key as the expiration flag. Changes to the cookie's value will flag the session storage value for the provided key as expired.
	*	@param {Number} [options.expires] Sets a time based expiration flag in *seconds*. After that time period, the session storage value for the provided key will be flagged as expired.
	* @example
	*	<%= NAME_FULL %>.setSessionItem('user:first-name', 'John', { expires: 3600 });
	*	// The session storage value will return undefined in one hour.
	* @example
	*	<%= NAME_FULL %>.setSessionItem('user:first-name', 'John', { expires: 'logged-user' });
	*	// The session storage value will return undefined if the value of the cookie 'logged-user' is changed.
	*/
	storage.setSessionItem = function(key,value,options) {
		_set(SESSION,key,value,options);
	};


	/**
	* Removes the local storage value for a specific key.
	*
	* @method removePersistentItem
	* @param {String} key
	* @example
	*	<%= NAME_FULL %>.removePersistentItem('history:last-visit');
	*/
	storage.removePersistentItem = function(key) {
		_remove(LOCAL,key);
	};


	/**
	* Removes the session storage value for a specific key.
	*
	* @method removeSessionItem
	* @param {String} key
	* @example
	*	<%= NAME_FULL %>.removeSessionItem('user:first-name');
	*/
	storage.removeSessionItem = function(key) {
		_remove(SESSION,key);
	};


	/**
	* Returns an array of local storage keys for a specific namespace.
	*
	* @method getPersistentNamespaceKeys
	* @param {String} namespace
	* @return {Array(String)} A list of keys.
	* @example
	*	<%= NAME_FULL %>.setPersistentItem('history:last-visit', '2013-07-21');
	*	<%= NAME_FULL %>.setPersistentItem('history:last-page', '/about-us');
	*	
	*	<%= NAME_FULL %>.getPersistentNamespaceKeys('history');
	*	// returns ["history:last-page", "history:last-visit"]
	*/
	storage.getPersistentNamespaceKeys = function(name) {
		return _getNamespaceKeys(LOCAL,name);
	};


	/**
	* Returns an array of session storage keys for a specific namespace.
	*
	* @method getSessionNamespaceKeys
	* @param {String} namespace
	* @return {Array(String)} A list of keys.
	* @example
	*	<%= NAME_FULL %>.setSessionItem('user:first-name', 'John');
	*	<%= NAME_FULL %>.setSessionItem('user:last-name', 'Doe');
	*	
	*	<%= NAME_FULL %>.getSessionNamespaceKeys('user');
	*	// returns ["user:first-name", "user:last-name"]
	*/
	storage.getSessionNamespaceKeys = function(name) {
		return _getNamespaceKeys(SESSION,name);
	};


	/**
	* Returns all local storage key values for a specific namespace.
	*
	* @method getPersistentNamespaceItems
	* @param {String} namespace
	* @return {Object} An object containing all local key/value combinations for the namespace.
	* @example
	*	<%= NAME_FULL %>.setPersistentItem('history:last-visit', '2013-07-21');
	*	<%= NAME_FULL %>.setPersistentItem('history:last-page', '/about-us');
	*	
	*	<%= NAME_FULL %>.getPersistentNamespaceItems('history');
	*	// returns { "history:last-page": "/about-us", "history:last-visit": "2013-07-21" }
	*/
	storage.getPersistentNamespaceItems = function(name) {
		return _getNamespaceItems(LOCAL,name);
	};


	/**
	* Returns all session storage key values for a specific namespace.
	*
	* @method getSessionNamespaceItems
	* @param {String} namespace
	* @return {Object} An object containing all session key/value combinations for the namespace.
	* @example
	*	<%= NAME_FULL %>.setSessionItem('user:first-name', 'John');
	*	<%= NAME_FULL %>.setSessionItem('user:last-name', 'Doe');
	*	
	*	<%= NAME_FULL %>.getSessionNamespaceItems('user');
	*	// returns { "user:first-name": "John", "user:last-name": "Doe" }
	*/
	storage.getSessionNamespaceItems = function(name) {
		return _getNamespaceItems(SESSION,name);
	};


	/**
	* Removes all local storage keys of a specific namespace.
	*
	* @method removePersistentNamespace
	* @param {String} namespace
	* @example
	*	<%= NAME_FULL %>.removePersistentNamespace('history');
	*/
	storage.removePersistentNamespace = function(name) {
		_removeNamespace(LOCAL,name);
	};


	/**
	* Removes all session storage keys of a specific namespace.
	*
	* @method removeSessionNamespace
	* @param {String} namespace
	* @example
	*	<%= NAME_FULL %>.removeSessionNamespace('user');
	*/
	storage.removeSessionNamespace = function(name) {
		_removeNamespace(SESSION,name);
	};


	/**
	* Returns an array of all local storage keys.
	*
	* @method getAllPersistentKeys
	* @return {Array(String)} A list of keys.
	* @example
	*	<%= NAME_FULL %>.setPersistentItem('history:last-visit', '2013-07-21');
	*	<%= NAME_FULL %>.setPersistentItem('website:show-ads', 'true');
	*	
	*	<%= NAME_FULL %>.getAllPersistentKeys();
	*	// returns ["history:last-visit", "website:show-ads"]
	*/
	storage.getAllPersistentKeys = function() {
		return _getAllKeys(LOCAL);
	};


	/**
	* Returns an array of all session storage keys.
	*
	* @method getAllSessionKeys
	* @return {Array(String)} A list of keys.
	* @example
	*	<%= NAME_FULL %>.setSessionItem('user:first-name', 'John');
	*	<%= NAME_FULL %>.setSessionItem('preferences:tutorials', 'false');
	*	
	*	<%= NAME_FULL %>.getAllSessionKeys();
	*	// returns ["user:first-name", "preferences:tutorials"]
	*/
	storage.getAllSessionKeys = function() {
		return _getAllKeys(SESSION);
	};


	/**
	* Returns all local storage key values.
	*
	* @method getAllPersistentItems
	* @return {Object} An object containing all local key/value combinations.
	* @example
	*	<%= NAME_FULL %>.setPersistentItem('history:last-visit', '2013-07-21');
	*	<%= NAME_FULL %>.setPersistentItem('website:show-ads', 'true');
	*	
	*	<%= NAME_FULL %>.getAllPersistentItems();
	*	// returns { "history:last-visit": "2013-07-21", "settings:show-ads": "true" }
	*/
	storage.getAllPersistentItems = function() {
		return _getAllItems(LOCAL);
	};


	/**
	* Returns all session storage key values.
	*
	* @method getAllSessionItems
	* @return {Object} An object containing all session key/value combinations.
	* @example
	*	<%= NAME_FULL %>.setSessionItem('user:first-name', 'John');
	*	<%= NAME_FULL %>.setSessionItem('preferences:tutorials', 'false');
	*	
	*	<%= NAME_FULL %>.getAllSessionItems();
	*	// returns { "preferences:tutorials": "false", "user:first-name": "John" }
	*/
	storage.getAllSessionItems = function() {
		return _getAllItems(SESSION);
	};


	/**
	* Removes all local storage keys.
	*
	* @method removeAllPersistent
	* @example
	*	<%= NAME_FULL %>.removeAllPersistent();
	*/
	storage.removeAllPersistent = function() {
		_removeAll(LOCAL);
	};


	/**
	* Removes all session storage keys.
	*
	* @method removeAllSession
	* @example
	*	<%= NAME_FULL %>.removeAllSession();
	*/
	storage.removeAllSession = function() {
		_removeAll(SESSION);
	};


	/**
	* Get the JSON response of a webservice and keep it in the session storage with or without an expiration flag. Use this shorthand method to prevent unnecessary communication with the server on ajax heavy websites. All session keys used with this method are part of the *<%= NAME_ATTR %>-getJSON* namespace.
	*
	* @method getJSON
	* @param {String} url URL address of the webservice.
	* @param {Object} [options] Other parameters
	*	@param {String} [options.expires] Sets a cookie of the specified key as the expiration flag. Changes to the cookie's value will force a new call to the webservice on the next use.
	*	@param {Number} [options.expires] Sets a time based expiration flag in *seconds*. After that time period, the next use will call the webservice instead of using the session storage.
	*	@param {Function} [options.callback] Callback triggered if the response is successful or a session stored value exists. The response (or stored value) is passed as the first argument.
	* @example
	*	<%= NAME_FULL %>.getJSON('/UserServices/GetUserInfos?username=john_doe', { expires: 3600 });
	*	// Using this same line will use the session stored value instead of calling the service unless one hour has passed.
	*/
	storage.getJSON = function() {
		if (_isAvailable(SESSION)) {
			var
				url      = arguments[0],
				options  = (typeof(arguments[1]) != 'function') ? arguments[1] : {expires:600},
				callback = (typeof(arguments[1]) != 'function') ? arguments[2] : arguments[1],
				key      = '<%= NAME_ATTR %>-getJSON:'+url.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
				cache    = storage.getSessionItem(key)
			;

			if (cache !== undefined) {
				callback(cache);
			} else {
				$.getJSON(url, function(data) {
					storage.setSessionItem(key, data, options);
					callback(data);
				});
			}
		}
	};


	return storage;

/* {%= FOOTER %} */