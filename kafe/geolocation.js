window.kafe.bonify({name:'geolocation', version:'1.0', obj:(function(kafe,undefined){
	var
		$         = kafe.dependencies.jQuery,
		Modernizr = kafe.dependencies.Modernizr,

		// dictonary
		_dict = {
			fr: {
				search:      'Recherche de votre positionnement',
				position:    'Votre position',
				unavailable: 'Service de localisation non-disponible',
				deactivated: 'Service de localisation désactivé',
				notFound:    'Position indisponible',
				timeout:     'Délai expiré',
				error:       'Il y a eu un problème'
			},
			en: {
				search:      'Searching your location',
				position:    'Your position',
				unavailable: 'Location service unavailable',
				deactivated: 'Location service deactivated',
				notFound:    'Position not found',
				timeout:     'Timeout',
				error:       'There has been a problem'
			}
		},

		// get a valid lang
		_lang = function(lang) {
			return kafe.fn.lang(_dict,lang);
		}
	;



	/**
	* ### Version 1.0
	* Methods to access geolocalization information about the client.
	*
	* @module kafe
	* @class kafe.geolocation 
	*/
	var geolocation = {};

	// locate user
	/**
	* Get the current geolocalization information of the client.
	*
	* @method locate
	* @param {Object} parameters Parameters for the current request.
	* 	@param {String|jQueryObject|DOMElement} [parameters.msgContainer=undefined] Element used to show status messages.
	* 	@param {String} [parameters.lang=CURRENT_ENV_LANG] A two character language code.
	* 	@param {Function} [parameters.success=undefined] Callback triggered when geolocalization informations have been successful retrieved. An object containing the informations is passed as the first argument.
	* 	@param {Function} [parameters.error=undefined] Callback triggered on geolocalization errors. The error message is passed as the first argument.
	* @example
	* 	kafe.geolocation.locate({
	* 		msgContainer: '#GeoLocStatus', lang: 'en',
	* 		success: function(coords) {
	* 			kafe.log('latitude: ' + coords.latitude);
	* 			kafe.log('longitude: ' + coords.longitude);
	* 		}
	* 		error: function(msg) {
	* 			kafe.log('Cannot geoloc: ' + msg);
	* 		}
	* 	});
	*/
	geolocation.locate = function(options) {
		var
			d               = _dict[_lang(options.lang)],
			$msg            = $(options.msgContainer),
			errorCallback   = options.error,
			successCallback = options.success
		;

		// if service available
		if (Modernizr.geolocation) {
			$msg.html('... '+d.search+' ...');

			// try to get coords
			navigator.geolocation.getCurrentPosition(

				// success
				function(position) {
					$msg.html(d.position + ': ' + position.coords.latitude + ', ' +  position.coords.longitude);
					if (!!successCallback) {
						successCallback({coords:position.coords});
					}
				},

				// failure
				function(error) {
					var msg = '';
					switch (error.code) {
						case 1:	msg = d.deactivated; break;
						case 2:	msg = d.notFound; break;
						case 3:	msg = d.timeout; break;
					}

					$msg.html(msg);
					if (!!errorCallback) {
						errorCallback({message:msg});
					}
				}
			);

		// if service unavailable
		} else {
			var msg = d.unavailable;
			$msg.html(msg);
			if (!!errorCallback) {
				errorCallback({message:msg});
			}
		}
	};

	return geolocation;

})(window.kafe)});
