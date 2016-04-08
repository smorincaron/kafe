/* @echo header */

	var

		// Process data
		_processData = function(data, options) {
			data = _.clone(data);
			options = options || {};
			options.uri = options.uri || global.location.pathname;

			_.forEach(data, function(value, key) {
				var tmpl = _.template(value, {interpolate:/{{([\s\S]+?)}}/g});
				data[key] = tmpl(options);
			});

			return data;
		},

		// Push event
		_pushEvent = function(data) {
			global.dataLayer.push({
				event:         'ga_event',
				eventCategory: data.category,
				eventAction:   data.action,
				eventLabel:    data.label
			});
		},

		// Push checkout option
		_pushCheckoutOption = function(data) {
			global.dataLayer.push({
				event: 'checkoutOption',
				ecommerce: {
					checkout_option: {
						actionField: {
							step: data.step,
							option: data.option
						}
					}
				}
			});
		},

		_gtmEvents = {},

		_checkoutOptions = {}
	;



	/**
	* ### Version <!-- @echo VERSION -->
	* Extra methods for the Google Tag Manager.
	* Requires GTM to be included
	*
	* @module <!-- @echo MODULE -->
	* @class <!-- @echo NAME_FULL -->
	*/
	var googletagmanager = {};

	/**
	* Add named events to the list of possible event to be triggered, with the possibility of replacement tokens.
	* Default tokens provided:
	*	- {{uri}}: Current pathname
	*
	* @method addEvents
	* @param {Object} events List of possible events and their config
	*	@param {String} events.category The `eventCategory` value.
	*	@param {String} events.action The `eventAction` value.
	*	@param {String} events.label The `eventLabel` value.
	*
	* @example
	*	// Create named events
	*	<!-- @echo NAME_FULL -->.addEvents({
	*		'newsletter-subscribed': {
	*			category: 'Subscription',
	*			action:   'Newsletter',
	*			label:    '{{uri}}'
	*		},
	*		'product-addedtocart': {
	*			category: 'Cart',
	*			action:   'Product added - {{uri}}',
	*			label:    '{{productname}}'
	*		}
	*	});
	*/
	googletagmanager.addEvents = function(events) {
		_.merge(_gtmEvents, events);
	};


	/**
	* Push a `ga_event` into the `dataLayer`.
	*
	* @method triggerEvent
	*	@param {String} event Event name
	*	@param {Object} [options] List of replacement tokens
	*
	* @example
	*	<!-- @echo NAME_FULL -->.triggerEvent('product-addedtocart', { productname: 'Sexy rainbow pants' });
	*/
	googletagmanager.triggerEvent = function(event, options) {
		var data = _gtmEvents[event];
		if (data) {
			_pushEvent( _processData(data, options) );
		}
	};


	/**
	* Add named checkout options to the list of possible options to be triggered, with the possibility of replacement tokens.
	* Default tokens provided:
	*	- {{uri}}: Current pathname
	*
	* @method addCheckoutOptions
	* @param {Object} checkoutOptions List of possible checkout options and their config
	*	@param {String} checkoutOptions.step The `step` value.
	*	@param {String} checkoutOptions.option The `option` value.
	*
	* @example
	*	// Create named checkout options
	*	<!-- @echo NAME_FULL -->.addCheckoutOptions({
	*		'checkout-type': {
	*			step:  'Identification',
	*			label: 'Identified as {{type}}'
	*		},
	*		'checkout-shipping': {
	*			step:  'Shipping method',
	*			label: 'Shipped via {{method}}'
	*		}
	*	});
	*/
	googletagmanager.addCheckoutOptions = function(checkoutOptions) {
		_.merge(_checkoutOptions, checkoutOptions);
	};


	/**
	* Push a `checkoutOption` into the `dataLayer`.
	*
	* @method triggerCheckoutOption
	*	@param {String} checkoutOption Checkout option name
	*	@param {Object} [options] List of replacement tokens
	*
	* @example
	*	<!-- @echo NAME_FULL -->.triggerCheckoutOption('checkout-type', { type: 'guest' });
	*/
	googletagmanager.triggerCheckoutOption = function(checkoutOption, options) {
		var data = _checkoutOptions[checkoutOption];
		if (data) {
			_pushCheckoutOption( _processData(data, options) );
		}
	};


	return googletagmanager;

/* @echo footer */