(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  (function (process){(function (){
  /**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */
  
  exports = module.exports = require('./debug');
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = 'undefined' != typeof chrome
                 && 'undefined' != typeof chrome.storage
                    ? chrome.storage.local
                    : localstorage();
  
  /**
   * Colors.
   */
  
  exports.colors = [
    'lightseagreen',
    'forestgreen',
    'goldenrod',
    'dodgerblue',
    'darkorchid',
    'crimson'
  ];
  
  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */
  
  function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
      return true;
    }
  
    // is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
      // is firebug? http://stackoverflow.com/a/398120/376773
      (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
      // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
      // double check webkit in userAgent just in case we are in a worker
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }
  
  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */
  
  exports.formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return '[UnexpectedJSONParseError]: ' + err.message;
    }
  };
  
  
  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */
  
  function formatArgs(args) {
    var useColors = this.useColors;
  
    args[0] = (useColors ? '%c' : '')
      + this.namespace
      + (useColors ? ' %c' : ' ')
      + args[0]
      + (useColors ? '%c ' : ' ')
      + '+' + exports.humanize(this.diff);
  
    if (!useColors) return;
  
    var c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit')
  
    // the final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function(match) {
      if ('%%' === match) return;
      index++;
      if ('%c' === match) {
        // we only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });
  
    args.splice(lastC, 0, c);
  }
  
  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */
  
  function log() {
    // this hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return 'object' === typeof console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
  
  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */
  
  function save(namespaces) {
    try {
      if (null == namespaces) {
        exports.storage.removeItem('debug');
      } else {
        exports.storage.debug = namespaces;
      }
    } catch(e) {}
  }
  
  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */
  
  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch(e) {}
  
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
      r = process.env.DEBUG;
    }
  
    return r;
  }
  
  /**
   * Enable namespaces listed in `localStorage.debug` initially.
   */
  
  exports.enable(load());
  
  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */
  
  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {}
  }
  
  }).call(this)}).call(this,require('_process'))
  },{"./debug":2,"_process":46}],2:[function(require,module,exports){
  
  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */
  
  exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = require('ms');
  
  /**
   * The currently active debug mode names, and names to skip.
   */
  
  exports.names = [];
  exports.skips = [];
  
  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
   */
  
  exports.formatters = {};
  
  /**
   * Previous log timestamp.
   */
  
  var prevTime;
  
  /**
   * Select a color.
   * @param {String} namespace
   * @return {Number}
   * @api private
   */
  
  function selectColor(namespace) {
    var hash = 0, i;
  
    for (i in namespace) {
      hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
  
    return exports.colors[Math.abs(hash) % exports.colors.length];
  }
  
  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */
  
  function createDebug(namespace) {
  
    function debug() {
      // disabled?
      if (!debug.enabled) return;
  
      var self = debug;
  
      // set `diff` timestamp
      var curr = +new Date();
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
  
      // turn the `arguments` into a proper Array
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
  
      args[0] = exports.coerce(args[0]);
  
      if ('string' !== typeof args[0]) {
        // anything else let's inspect with %O
        args.unshift('%O');
      }
  
      // apply any `formatters` transformations
      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
        // if we encounter an escaped % then don't increase the array index
        if (match === '%%') return match;
        index++;
        var formatter = exports.formatters[format];
        if ('function' === typeof formatter) {
          var val = args[index];
          match = formatter.call(self, val);
  
          // now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });
  
      // apply env-specific formatting (colors, etc.)
      exports.formatArgs.call(self, args);
  
      var logFn = debug.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }
  
    debug.namespace = namespace;
    debug.enabled = exports.enabled(namespace);
    debug.useColors = exports.useColors();
    debug.color = selectColor(namespace);
  
    // env-specific initialization logic for debug instances
    if ('function' === typeof exports.init) {
      exports.init(debug);
    }
  
    return debug;
  }
  
  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */
  
  function enable(namespaces) {
    exports.save(namespaces);
  
    exports.names = [];
    exports.skips = [];
  
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;
  
    for (var i = 0; i < len; i++) {
      if (!split[i]) continue; // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        exports.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }
  
  /**
   * Disable debug output.
   *
   * @api public
   */
  
  function disable() {
    exports.enable('');
  }
  
  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */
  
  function enabled(name) {
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */
  
  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }
  
  },{"ms":7}],3:[function(require,module,exports){
  var debug;
  
  module.exports = function () {
    if (!debug) {
      try {
        /* eslint global-require: off */
        debug = require("debug")("follow-redirects");
      }
      catch (error) { /* */ }
      if (typeof debug !== "function") {
        debug = function () { /* */ };
      }
    }
    debug.apply(null, arguments);
  };
  
  },{"debug":1}],4:[function(require,module,exports){
  var url = require("url");
  var URL = url.URL;
  var http = require("http");
  var https = require("https");
  var Writable = require("stream").Writable;
  var assert = require("assert");
  var debug = require("./debug");
  
  // Create handlers that pass events from native requests
  var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
  var eventHandlers = Object.create(null);
  events.forEach(function (event) {
    eventHandlers[event] = function (arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });
  
  // Error types with codes
  var RedirectionError = createErrorType(
    "ERR_FR_REDIRECTION_FAILURE",
    ""
  );
  var TooManyRedirectsError = createErrorType(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded"
  );
  var MaxBodyLengthExceededError = createErrorType(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  );
  var WriteAfterEndError = createErrorType(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  );
  
  // An HTTP(S) request that can be redirected
  function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
  
    // Attach a callback if passed
    if (responseCallback) {
      this.on("response", responseCallback);
    }
  
    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function (response) {
      self._processResponse(response);
    };
  
    // Perform the first request
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);
  
  RedirectableRequest.prototype.abort = function () {
    abortRequest(this._currentRequest);
    this.emit("abort");
  };
  
  // Writes buffered data to the current native request
  RedirectableRequest.prototype.write = function (data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
      throw new WriteAfterEndError();
    }
  
    // Validate input and shift parameters if necessary
    if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }
  
    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({ data: data, encoding: encoding });
      this._currentRequest.write(data, encoding, callback);
    }
    // Error when we exceed the maximum body length
    else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };
  
  // Ends the current native request
  RedirectableRequest.prototype.end = function (data, encoding, callback) {
    // Shift parameters if necessary
    if (typeof data === "function") {
      callback = data;
      data = encoding = null;
    }
    else if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }
  
    // Write data if needed and end
    if (!data) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    }
    else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data, encoding, function () {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };
  
  // Sets a header value on the current native request
  RedirectableRequest.prototype.setHeader = function (name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };
  
  // Clears a header value on the current native request
  RedirectableRequest.prototype.removeHeader = function (name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };
  
  // Global timeout for all underlying requests
  RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
    var self = this;
  
    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
      socket.setTimeout(msecs);
      socket.removeListener("timeout", socket.destroy);
      socket.addListener("timeout", socket.destroy);
    }
  
    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
      if (self._timeout) {
        clearTimeout(self._timeout);
      }
      self._timeout = setTimeout(function () {
        self.emit("timeout");
        clearTimer();
      }, msecs);
      destroyOnTimeout(socket);
    }
  
    // Stops a timeout from triggering
    function clearTimer() {
      if (self._timeout) {
        clearTimeout(self._timeout);
        self._timeout = null;
      }
      if (callback) {
        self.removeListener("timeout", callback);
      }
      if (!self.socket) {
        self._currentRequest.removeListener("socket", startTimer);
      }
    }
  
    // Attach callback if passed
    if (callback) {
      this.on("timeout", callback);
    }
  
    // Start the timer if or when the socket is opened
    if (this.socket) {
      startTimer(this.socket);
    }
    else {
      this._currentRequest.once("socket", startTimer);
    }
  
    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.once("response", clearTimer);
    this.once("error", clearTimer);
  
    return this;
  };
  
  // Proxy all other public ClientRequest methods
  [
    "flushHeaders", "getHeader",
    "setNoDelay", "setSocketKeepAlive",
  ].forEach(function (method) {
    RedirectableRequest.prototype[method] = function (a, b) {
      return this._currentRequest[method](a, b);
    };
  });
  
  // Proxy all public ClientRequest properties
  ["aborted", "connection", "socket"].forEach(function (property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function () { return this._currentRequest[property]; },
    });
  });
  
  RedirectableRequest.prototype._sanitizeOptions = function (options) {
    // Ensure headers are always present
    if (!options.headers) {
      options.headers = {};
    }
  
    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
      // Use hostname if set, because it has precedence
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }
  
    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      }
      else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };
  
  
  // Executes the next native request (initial or redirect)
  RedirectableRequest.prototype._performRequest = function () {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      this.emit("error", new TypeError("Unsupported protocol " + protocol));
      return;
    }
  
    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
      var scheme = protocol.substr(0, protocol.length - 1);
      this._options.agent = this._options.agents[scheme];
    }
  
    // Create the native request
    var request = this._currentRequest =
          nativeProtocol.request(this._options, this._onNativeResponse);
    this._currentUrl = url.format(this._options);
  
    // Set up event handlers
    request._redirectable = this;
    for (var e = 0; e < events.length; e++) {
      request.on(events[e], eventHandlers[events[e]]);
    }
  
    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
      // Write the request entity and end.
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        // Only write if this request has not been redirected yet
        /* istanbul ignore else */
        if (request === self._currentRequest) {
          // Report any write errors
          /* istanbul ignore if */
          if (error) {
            self.emit("error", error);
          }
          // Write the next buffer if there are still left
          else if (i < buffers.length) {
            var buffer = buffers[i++];
            /* istanbul ignore else */
            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          }
          // End the request if `end` has been called on us
          else if (self._ended) {
            request.end();
          }
        }
      }());
    }
  };
  
  // Processes a response from the current native request
  RedirectableRequest.prototype._processResponse = function (response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode: statusCode,
      });
    }
  
    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    var location = response.headers.location;
    if (location && this._options.followRedirects !== false &&
        statusCode >= 300 && statusCode < 400) {
      // Abort the current request
      abortRequest(this._currentRequest);
      // Discard the remainder of the response to avoid waiting for data
      response.destroy();
  
      // RFC7231§6.4: A client SHOULD detect and intervene
      // in cyclical redirections (i.e., "infinite" redirection loops).
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
      }
  
      // RFC7231§6.4: Automatic redirection needs to done with
      // care for methods not known to be safe, […]
      // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
      // the request method from POST to GET for the subsequent request.
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
          // RFC7231§6.4.4: The 303 (See Other) status code indicates that
          // the server is redirecting the user agent to a different resource […]
          // A user agent can perform a retrieval request targeting that URI
          // (a GET or HEAD request if using HTTP) […]
          (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
  
      // Drop the Host header, as the redirect might lead to a different host
      var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) ||
        url.parse(this._currentUrl).hostname;
  
      // Create the redirected request
      var redirectUrl = url.resolve(this._currentUrl, location);
      debug("redirecting to", redirectUrl);
      this._isRedirect = true;
      var redirectUrlParts = url.parse(redirectUrl);
      Object.assign(this._options, redirectUrlParts);
  
      // Drop the Authorization header if redirecting to another host
      if (redirectUrlParts.hostname !== previousHostName) {
        removeMatchingHeaders(/^authorization$/i, this._options.headers);
      }
  
      // Evaluate the beforeRedirect callback
      if (typeof this._options.beforeRedirect === "function") {
        var responseDetails = { headers: response.headers };
        try {
          this._options.beforeRedirect.call(null, this._options, responseDetails);
        }
        catch (err) {
          this.emit("error", err);
          return;
        }
        this._sanitizeOptions(this._options);
      }
  
      // Perform the redirected request
      try {
        this._performRequest();
      }
      catch (cause) {
        var error = new RedirectionError("Redirected request failed: " + cause.message);
        error.cause = cause;
        this.emit("error", error);
      }
    }
    else {
      // The response is not a redirect; return it as-is
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);
  
      // Clean up
      this._requestBodyBuffers = [];
    }
  };
  
  // Wraps the key/value object of protocols with redirect functionality
  function wrap(protocols) {
    // Default settings
    var exports = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024,
    };
  
    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function (scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
  
      // Executes a request, following redirects
      function request(input, options, callback) {
        // Parse parameters
        if (typeof input === "string") {
          var urlStr = input;
          try {
            input = urlToOptions(new URL(urlStr));
          }
          catch (err) {
            /* istanbul ignore next */
            input = url.parse(urlStr);
          }
        }
        else if (URL && (input instanceof URL)) {
          input = urlToOptions(input);
        }
        else {
          callback = options;
          options = input;
          input = { protocol: protocol };
        }
        if (typeof options === "function") {
          callback = options;
          options = null;
        }
  
        // Set defaults
        options = Object.assign({
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, input, options);
        options.nativeProtocols = nativeProtocols;
  
        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug("options", options);
        return new RedirectableRequest(options, callback);
      }
  
      // Executes a GET request, following redirects
      function get(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        wrappedRequest.end();
        return wrappedRequest;
      }
  
      // Expose the properties on the wrapped protocol
      Object.defineProperties(wrappedProtocol, {
        request: { value: request, configurable: true, enumerable: true, writable: true },
        get: { value: get, configurable: true, enumerable: true, writable: true },
      });
    });
    return exports;
  }
  
  /* istanbul ignore next */
  function noop() { /* empty */ }
  
  // from https://github.com/nodejs/node/blob/master/lib/internal/url.js
  function urlToOptions(urlObject) {
    var options = {
      protocol: urlObject.protocol,
      hostname: urlObject.hostname.startsWith("[") ?
        /* istanbul ignore next */
        urlObject.hostname.slice(1, -1) :
        urlObject.hostname,
      hash: urlObject.hash,
      search: urlObject.search,
      pathname: urlObject.pathname,
      path: urlObject.pathname + urlObject.search,
      href: urlObject.href,
    };
    if (urlObject.port !== "") {
      options.port = Number(urlObject.port);
    }
    return options;
  }
  
  function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for (var header in headers) {
      if (regex.test(header)) {
        lastValue = headers[header];
        delete headers[header];
      }
    }
    return lastValue;
  }
  
  function createErrorType(code, defaultMessage) {
    function CustomError(message) {
      Error.captureStackTrace(this, this.constructor);
      this.message = message || defaultMessage;
    }
    CustomError.prototype = new Error();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    CustomError.prototype.code = code;
    return CustomError;
  }
  
  function abortRequest(request) {
    for (var e = 0; e < events.length; e++) {
      request.removeListener(events[e], eventHandlers[events[e]]);
    }
    request.on("error", noop);
    request.abort();
  }
  
  // Exports
  module.exports = wrap({ http: http, https: https });
  module.exports.wrap = wrap;
  
  },{"./debug":3,"assert":14,"http":68,"https":38,"stream":51,"url":89}],5:[function(require,module,exports){
  (function (process,global){(function (){
  /**
   * [js-sha3]{@link https://github.com/emn178/js-sha3}
   *
   * @version 0.8.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2015-2018
   * @license MIT
   */
  /*jslint bitwise: true */
  (function () {
    'use strict';
  
    var INPUT_ERROR = 'input is invalid type';
    var FINALIZE_ERROR = 'finalize already called';
    var WINDOW = typeof window === 'object';
    var root = WINDOW ? window : {};
    if (root.JS_SHA3_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === 'object';
    var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
      root = global;
    } else if (WEB_WORKER) {
      root = self;
    }
    var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === 'object' && module.exports;
    var AMD = typeof define === 'function' && define.amd;
    var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
    var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
    var KECCAK_PADDING = [1, 256, 65536, 16777216];
    var PADDING = [6, 1536, 393216, 100663296];
    var SHIFT = [0, 8, 16, 24];
    var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
      0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
      2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
      2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
      2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
    var BITS = [224, 256, 384, 512];
    var SHAKE_BITS = [128, 256];
    var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
    var CSHAKE_BYTEPAD = {
      '128': 168,
      '256': 136
    };
  
    if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };
    }
  
    if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function (obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }
  
    var createOutputMethod = function (bits, padding, outputType) {
      return function (message) {
        return new Keccak(bits, padding, bits).update(message)[outputType]();
      };
    };
  
    var createShakeOutputMethod = function (bits, padding, outputType) {
      return function (message, outputBits) {
        return new Keccak(bits, padding, outputBits).update(message)[outputType]();
      };
    };
  
    var createCshakeOutputMethod = function (bits, padding, outputType) {
      return function (message, outputBits, n, s) {
        return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
      };
    };
  
    var createKmacOutputMethod = function (bits, padding, outputType) {
      return function (key, message, outputBits, s) {
        return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
      };
    };
  
    var createOutputMethods = function (method, createMethod, bits, padding) {
      for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createMethod(bits, padding, type);
      }
      return method;
    };
  
    var createMethod = function (bits, padding) {
      var method = createOutputMethod(bits, padding, 'hex');
      method.create = function () {
        return new Keccak(bits, padding, bits);
      };
      method.update = function (message) {
        return method.create().update(message);
      };
      return createOutputMethods(method, createOutputMethod, bits, padding);
    };
  
    var createShakeMethod = function (bits, padding) {
      var method = createShakeOutputMethod(bits, padding, 'hex');
      method.create = function (outputBits) {
        return new Keccak(bits, padding, outputBits);
      };
      method.update = function (message, outputBits) {
        return method.create(outputBits).update(message);
      };
      return createOutputMethods(method, createShakeOutputMethod, bits, padding);
    };
  
    var createCshakeMethod = function (bits, padding) {
      var w = CSHAKE_BYTEPAD[bits];
      var method = createCshakeOutputMethod(bits, padding, 'hex');
      method.create = function (outputBits, n, s) {
        if (!n && !s) {
          return methods['shake' + bits].create(outputBits);
        } else {
          return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
        }
      };
      method.update = function (message, outputBits, n, s) {
        return method.create(outputBits, n, s).update(message);
      };
      return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
    };
  
    var createKmacMethod = function (bits, padding) {
      var w = CSHAKE_BYTEPAD[bits];
      var method = createKmacOutputMethod(bits, padding, 'hex');
      method.create = function (key, outputBits, s) {
        return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
      };
      method.update = function (key, message, outputBits, s) {
        return method.create(key, outputBits, s).update(message);
      };
      return createOutputMethods(method, createKmacOutputMethod, bits, padding);
    };
  
    var algorithms = [
      { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
      { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
      { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
      { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
      { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
    ];
  
    var methods = {}, methodNames = [];
  
    for (var i = 0; i < algorithms.length; ++i) {
      var algorithm = algorithms[i];
      var bits = algorithm.bits;
      for (var j = 0; j < bits.length; ++j) {
        var methodName = algorithm.name + '_' + bits[j];
        methodNames.push(methodName);
        methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
        if (algorithm.name !== 'sha3') {
          var newMethodName = algorithm.name + bits[j];
          methodNames.push(newMethodName);
          methods[newMethodName] = methods[methodName];
        }
      }
    }
  
    function Keccak(bits, padding, outputBits) {
      this.blocks = [];
      this.s = [];
      this.padding = padding;
      this.outputBits = outputBits;
      this.reset = true;
      this.finalized = false;
      this.block = 0;
      this.start = 0;
      this.blockCount = (1600 - (bits << 1)) >> 5;
      this.byteCount = this.blockCount << 2;
      this.outputBlocks = outputBits >> 5;
      this.extraBytes = (outputBits & 31) >> 3;
  
      for (var i = 0; i < 50; ++i) {
        this.s[i] = 0;
      }
    }
  
    Keccak.prototype.update = function (message) {
      if (this.finalized) {
        throw new Error(FINALIZE_ERROR);
      }
      var notString, type = typeof message;
      if (type !== 'string') {
        if (type === 'object') {
          if (message === null) {
            throw new Error(INPUT_ERROR);
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw new Error(INPUT_ERROR);
            }
          }
        } else {
          throw new Error(INPUT_ERROR);
        }
        notString = true;
      }
      var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
        blockCount = this.blockCount, index = 0, s = this.s, i, code;
  
      while (index < length) {
        if (this.reset) {
          this.reset = false;
          blocks[0] = this.block;
          for (i = 1; i < blockCount + 1; ++i) {
            blocks[i] = 0;
          }
        }
        if (notString) {
          for (i = this.start; index < length && i < byteCount; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        } else {
          for (i = this.start; index < length && i < byteCount; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
              blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            }
          }
        }
        this.lastByteIndex = i;
        if (i >= byteCount) {
          this.start = i - byteCount;
          this.block = blocks[blockCount];
          for (i = 0; i < blockCount; ++i) {
            s[i] ^= blocks[i];
          }
          f(s);
          this.reset = true;
        } else {
          this.start = i;
        }
      }
      return this;
    };
  
    Keccak.prototype.encode = function (x, right) {
      var o = x & 255, n = 1;
      var bytes = [o];
      x = x >> 8;
      o = x & 255;
      while (o > 0) {
        bytes.unshift(o);
        x = x >> 8;
        o = x & 255;
        ++n;
      }
      if (right) {
        bytes.push(n);
      } else {
        bytes.unshift(n);
      }
      this.update(bytes);
      return bytes.length;
    };
  
    Keccak.prototype.encodeString = function (str) {
      var notString, type = typeof str;
      if (type !== 'string') {
        if (type === 'object') {
          if (str === null) {
            throw new Error(INPUT_ERROR);
          } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
            str = new Uint8Array(str);
          } else if (!Array.isArray(str)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
              throw new Error(INPUT_ERROR);
            }
          }
        } else {
          throw new Error(INPUT_ERROR);
        }
        notString = true;
      }
      var bytes = 0, length = str.length;
      if (notString) {
        bytes = length;
      } else {
        for (var i = 0; i < str.length; ++i) {
          var code = str.charCodeAt(i);
          if (code < 0x80) {
            bytes += 1;
          } else if (code < 0x800) {
            bytes += 2;
          } else if (code < 0xd800 || code >= 0xe000) {
            bytes += 3;
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
            bytes += 4;
          }
        }
      }
      bytes += this.encode(bytes * 8);
      this.update(str);
      return bytes;
    };
  
    Keccak.prototype.bytepad = function (strs, w) {
      var bytes = this.encode(w);
      for (var i = 0; i < strs.length; ++i) {
        bytes += this.encodeString(strs[i]);
      }
      var paddingBytes = w - bytes % w;
      var zeros = [];
      zeros.length = paddingBytes;
      this.update(zeros);
      return this;
    };
  
    Keccak.prototype.finalize = function () {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
      blocks[i >> 2] |= this.padding[i & 3];
      if (this.lastByteIndex === this.byteCount) {
        blocks[0] = blocks[blockCount];
        for (i = 1; i < blockCount + 1; ++i) {
          blocks[i] = 0;
        }
      }
      blocks[blockCount - 1] |= 0x80000000;
      for (i = 0; i < blockCount; ++i) {
        s[i] ^= blocks[i];
      }
      f(s);
    };
  
    Keccak.prototype.toString = Keccak.prototype.hex = function () {
      this.finalize();
  
      var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
      var hex = '', block;
      while (j < outputBlocks) {
        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
          block = s[i];
          hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
            HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
            HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
            HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
        }
        if (j % blockCount === 0) {
          f(s);
          i = 0;
        }
      }
      if (extraBytes) {
        block = s[i];
        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
        if (extraBytes > 1) {
          hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
        }
        if (extraBytes > 2) {
          hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
        }
      }
      return hex;
    };
  
    Keccak.prototype.arrayBuffer = function () {
      this.finalize();
  
      var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
      var bytes = this.outputBits >> 3;
      var buffer;
      if (extraBytes) {
        buffer = new ArrayBuffer((outputBlocks + 1) << 2);
      } else {
        buffer = new ArrayBuffer(bytes);
      }
      var array = new Uint32Array(buffer);
      while (j < outputBlocks) {
        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
          array[j] = s[i];
        }
        if (j % blockCount === 0) {
          f(s);
        }
      }
      if (extraBytes) {
        array[i] = s[i];
        buffer = buffer.slice(0, bytes);
      }
      return buffer;
    };
  
    Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
  
    Keccak.prototype.digest = Keccak.prototype.array = function () {
      this.finalize();
  
      var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
        extraBytes = this.extraBytes, i = 0, j = 0;
      var array = [], offset, block;
      while (j < outputBlocks) {
        for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
          offset = j << 2;
          block = s[i];
          array[offset] = block & 0xFF;
          array[offset + 1] = (block >> 8) & 0xFF;
          array[offset + 2] = (block >> 16) & 0xFF;
          array[offset + 3] = (block >> 24) & 0xFF;
        }
        if (j % blockCount === 0) {
          f(s);
        }
      }
      if (extraBytes) {
        offset = j << 2;
        block = s[i];
        array[offset] = block & 0xFF;
        if (extraBytes > 1) {
          array[offset + 1] = (block >> 8) & 0xFF;
        }
        if (extraBytes > 2) {
          array[offset + 2] = (block >> 16) & 0xFF;
        }
      }
      return array;
    };
  
    function Kmac(bits, padding, outputBits) {
      Keccak.call(this, bits, padding, outputBits);
    }
  
    Kmac.prototype = new Keccak();
  
    Kmac.prototype.finalize = function () {
      this.encode(this.outputBits, true);
      return Keccak.prototype.finalize.call(this);
    };
  
    var f = function (s) {
      var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
        b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
        b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
        b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
      for (n = 0; n < 48; n += 2) {
        c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
        c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
        c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
        c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
        c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
        c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
        c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
        c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
        c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
        c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
  
        h = c8 ^ ((c2 << 1) | (c3 >>> 31));
        l = c9 ^ ((c3 << 1) | (c2 >>> 31));
        s[0] ^= h;
        s[1] ^= l;
        s[10] ^= h;
        s[11] ^= l;
        s[20] ^= h;
        s[21] ^= l;
        s[30] ^= h;
        s[31] ^= l;
        s[40] ^= h;
        s[41] ^= l;
        h = c0 ^ ((c4 << 1) | (c5 >>> 31));
        l = c1 ^ ((c5 << 1) | (c4 >>> 31));
        s[2] ^= h;
        s[3] ^= l;
        s[12] ^= h;
        s[13] ^= l;
        s[22] ^= h;
        s[23] ^= l;
        s[32] ^= h;
        s[33] ^= l;
        s[42] ^= h;
        s[43] ^= l;
        h = c2 ^ ((c6 << 1) | (c7 >>> 31));
        l = c3 ^ ((c7 << 1) | (c6 >>> 31));
        s[4] ^= h;
        s[5] ^= l;
        s[14] ^= h;
        s[15] ^= l;
        s[24] ^= h;
        s[25] ^= l;
        s[34] ^= h;
        s[35] ^= l;
        s[44] ^= h;
        s[45] ^= l;
        h = c4 ^ ((c8 << 1) | (c9 >>> 31));
        l = c5 ^ ((c9 << 1) | (c8 >>> 31));
        s[6] ^= h;
        s[7] ^= l;
        s[16] ^= h;
        s[17] ^= l;
        s[26] ^= h;
        s[27] ^= l;
        s[36] ^= h;
        s[37] ^= l;
        s[46] ^= h;
        s[47] ^= l;
        h = c6 ^ ((c0 << 1) | (c1 >>> 31));
        l = c7 ^ ((c1 << 1) | (c0 >>> 31));
        s[8] ^= h;
        s[9] ^= l;
        s[18] ^= h;
        s[19] ^= l;
        s[28] ^= h;
        s[29] ^= l;
        s[38] ^= h;
        s[39] ^= l;
        s[48] ^= h;
        s[49] ^= l;
  
        b0 = s[0];
        b1 = s[1];
        b32 = (s[11] << 4) | (s[10] >>> 28);
        b33 = (s[10] << 4) | (s[11] >>> 28);
        b14 = (s[20] << 3) | (s[21] >>> 29);
        b15 = (s[21] << 3) | (s[20] >>> 29);
        b46 = (s[31] << 9) | (s[30] >>> 23);
        b47 = (s[30] << 9) | (s[31] >>> 23);
        b28 = (s[40] << 18) | (s[41] >>> 14);
        b29 = (s[41] << 18) | (s[40] >>> 14);
        b20 = (s[2] << 1) | (s[3] >>> 31);
        b21 = (s[3] << 1) | (s[2] >>> 31);
        b2 = (s[13] << 12) | (s[12] >>> 20);
        b3 = (s[12] << 12) | (s[13] >>> 20);
        b34 = (s[22] << 10) | (s[23] >>> 22);
        b35 = (s[23] << 10) | (s[22] >>> 22);
        b16 = (s[33] << 13) | (s[32] >>> 19);
        b17 = (s[32] << 13) | (s[33] >>> 19);
        b48 = (s[42] << 2) | (s[43] >>> 30);
        b49 = (s[43] << 2) | (s[42] >>> 30);
        b40 = (s[5] << 30) | (s[4] >>> 2);
        b41 = (s[4] << 30) | (s[5] >>> 2);
        b22 = (s[14] << 6) | (s[15] >>> 26);
        b23 = (s[15] << 6) | (s[14] >>> 26);
        b4 = (s[25] << 11) | (s[24] >>> 21);
        b5 = (s[24] << 11) | (s[25] >>> 21);
        b36 = (s[34] << 15) | (s[35] >>> 17);
        b37 = (s[35] << 15) | (s[34] >>> 17);
        b18 = (s[45] << 29) | (s[44] >>> 3);
        b19 = (s[44] << 29) | (s[45] >>> 3);
        b10 = (s[6] << 28) | (s[7] >>> 4);
        b11 = (s[7] << 28) | (s[6] >>> 4);
        b42 = (s[17] << 23) | (s[16] >>> 9);
        b43 = (s[16] << 23) | (s[17] >>> 9);
        b24 = (s[26] << 25) | (s[27] >>> 7);
        b25 = (s[27] << 25) | (s[26] >>> 7);
        b6 = (s[36] << 21) | (s[37] >>> 11);
        b7 = (s[37] << 21) | (s[36] >>> 11);
        b38 = (s[47] << 24) | (s[46] >>> 8);
        b39 = (s[46] << 24) | (s[47] >>> 8);
        b30 = (s[8] << 27) | (s[9] >>> 5);
        b31 = (s[9] << 27) | (s[8] >>> 5);
        b12 = (s[18] << 20) | (s[19] >>> 12);
        b13 = (s[19] << 20) | (s[18] >>> 12);
        b44 = (s[29] << 7) | (s[28] >>> 25);
        b45 = (s[28] << 7) | (s[29] >>> 25);
        b26 = (s[38] << 8) | (s[39] >>> 24);
        b27 = (s[39] << 8) | (s[38] >>> 24);
        b8 = (s[48] << 14) | (s[49] >>> 18);
        b9 = (s[49] << 14) | (s[48] >>> 18);
  
        s[0] = b0 ^ (~b2 & b4);
        s[1] = b1 ^ (~b3 & b5);
        s[10] = b10 ^ (~b12 & b14);
        s[11] = b11 ^ (~b13 & b15);
        s[20] = b20 ^ (~b22 & b24);
        s[21] = b21 ^ (~b23 & b25);
        s[30] = b30 ^ (~b32 & b34);
        s[31] = b31 ^ (~b33 & b35);
        s[40] = b40 ^ (~b42 & b44);
        s[41] = b41 ^ (~b43 & b45);
        s[2] = b2 ^ (~b4 & b6);
        s[3] = b3 ^ (~b5 & b7);
        s[12] = b12 ^ (~b14 & b16);
        s[13] = b13 ^ (~b15 & b17);
        s[22] = b22 ^ (~b24 & b26);
        s[23] = b23 ^ (~b25 & b27);
        s[32] = b32 ^ (~b34 & b36);
        s[33] = b33 ^ (~b35 & b37);
        s[42] = b42 ^ (~b44 & b46);
        s[43] = b43 ^ (~b45 & b47);
        s[4] = b4 ^ (~b6 & b8);
        s[5] = b5 ^ (~b7 & b9);
        s[14] = b14 ^ (~b16 & b18);
        s[15] = b15 ^ (~b17 & b19);
        s[24] = b24 ^ (~b26 & b28);
        s[25] = b25 ^ (~b27 & b29);
        s[34] = b34 ^ (~b36 & b38);
        s[35] = b35 ^ (~b37 & b39);
        s[44] = b44 ^ (~b46 & b48);
        s[45] = b45 ^ (~b47 & b49);
        s[6] = b6 ^ (~b8 & b0);
        s[7] = b7 ^ (~b9 & b1);
        s[16] = b16 ^ (~b18 & b10);
        s[17] = b17 ^ (~b19 & b11);
        s[26] = b26 ^ (~b28 & b20);
        s[27] = b27 ^ (~b29 & b21);
        s[36] = b36 ^ (~b38 & b30);
        s[37] = b37 ^ (~b39 & b31);
        s[46] = b46 ^ (~b48 & b40);
        s[47] = b47 ^ (~b49 & b41);
        s[8] = b8 ^ (~b0 & b2);
        s[9] = b9 ^ (~b1 & b3);
        s[18] = b18 ^ (~b10 & b12);
        s[19] = b19 ^ (~b11 & b13);
        s[28] = b28 ^ (~b20 & b22);
        s[29] = b29 ^ (~b21 & b23);
        s[38] = b38 ^ (~b30 & b32);
        s[39] = b39 ^ (~b31 & b33);
        s[48] = b48 ^ (~b40 & b42);
        s[49] = b49 ^ (~b41 & b43);
  
        s[0] ^= RC[n];
        s[1] ^= RC[n + 1];
      }
    };
  
    if (COMMON_JS) {
      module.exports = methods;
    } else {
      for (i = 0; i < methodNames.length; ++i) {
        root[methodNames[i]] = methods[methodNames[i]];
      }
      if (AMD) {
        define(function () {
          return methods;
        });
      }
    }
  })();
  
  }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"_process":46}],6:[function(require,module,exports){
  (function (Buffer){(function (){
  'use strict';
  
  var STREAM = require('stream'),
      UTIL = require('util'),
      StringDecoder = require('string_decoder').StringDecoder;
  
  function MemoryReadableStream(data, options) {
      if (!(this instanceof MemoryReadableStream))
          return new MemoryReadableStream(data, options);
      MemoryReadableStream.super_.call(this, options);
      this.init(data, options);
  }
  UTIL.inherits(MemoryReadableStream, STREAM.Readable);
  
  
  function MemoryWritableStream(data, options) {
      if (!(this instanceof MemoryWritableStream))
          return new MemoryWritableStream(data, options);
      MemoryWritableStream.super_.call(this, options);
      this.init(data, options);
  }
  UTIL.inherits(MemoryWritableStream, STREAM.Writable);
  
  
  function MemoryDuplexStream(data, options) {
      if (!(this instanceof MemoryDuplexStream))
          return new MemoryDuplexStream(data, options);
      MemoryDuplexStream.super_.call(this, options);
      this.init(data, options);
  }
  UTIL.inherits(MemoryDuplexStream, STREAM.Duplex);
  
  
  MemoryReadableStream.prototype.init =
  MemoryWritableStream.prototype.init =
  MemoryDuplexStream.prototype.init = function init (data, options) {
      var self = this;
      this.queue = [];
  
      if (data) {
          if (!Array.isArray(data)) {
              data = [ data ];
          }
  
          data.forEach(function (chunk) {
              if (!(chunk instanceof Buffer)) {
                  chunk = new Buffer(chunk);
              }
              self.queue.push(chunk);
          });
  
      }
      
      options = options || {};
      
      this.maxbufsize = options.hasOwnProperty('maxbufsize') ? options.maxbufsize
              : null;
      this.bufoverflow = options.hasOwnProperty('bufoverflow') ? options.bufoverflow
              : null;
      this.frequence = options.hasOwnProperty('frequence') ? options.frequence
              : null;
  };
  
  function MemoryStream (data, options) {
      if (!(this instanceof MemoryStream))
          return new MemoryStream(data, options);
      
      options = options || {};
      
      var readable = options.hasOwnProperty('readable') ? options.readable : true,
          writable = options.hasOwnProperty('writable') ? options.writable : true;
      
      if (readable && writable) {
          return new MemoryDuplexStream(data, options);
      } else if (readable) {
          return new MemoryReadableStream(data, options);
      } else if (writable) {
          return new MemoryWritableStream(data, options);
      } else {
          throw new Error("Unknown stream type  Readable, Writable or Duplex ");
      }
  }
  
  
  MemoryStream.createReadStream = function (data, options) {
      options = options || {};
      options.readable = true;
      options.writable = false;
  
      return new MemoryStream(data, options);
  };
  
  
  MemoryStream.createWriteStream = function (data, options) {
      options = options || {};
      options.readable = false;
      options.writable = true;
  
      return new MemoryStream(data, options);
  };
  
  
  MemoryReadableStream.prototype._read =
  MemoryDuplexStream.prototype._read = function _read (n) {
      var self = this,
          frequence = self.frequence || 0,
          wait_data = this instanceof STREAM.Duplex && ! this._writableState.finished ? true : false;
      if ( ! this.queue.length && ! wait_data) {
          this.push(null);// finish stream
      } else if (this.queue.length) {
          setTimeout(function () {
              if (self.queue.length) {
                  var chunk = self.queue.shift();
                  if (chunk && ! self._readableState.ended) {
                      if ( ! self.push(chunk) ) {
                          self.queue.unshift(chunk);
                      }
                  }
              }
          }, frequence);
      }
  };
  
  
  MemoryWritableStream.prototype._write =
  MemoryDuplexStream.prototype._write = function _write (chunk, encoding, cb) {
      var decoder = null;
      try {
          decoder = this.decodeStrings && encoding ? new StringDecoder(encoding) : null;
      } catch (err){
          return cb(err);
      }
      
      var decoded_chunk = decoder ? decoder.write(chunk) : chunk,
          queue_size = this._getQueueSize(),
          chunk_size = decoded_chunk.length;
      
      if (this.maxbufsize && (queue_size + chunk_size) > this.maxbufsize ) {
          if (this.bufoverflow) {
              return cb("Buffer overflowed (" + this.bufoverflow + "/" + queue_size + ")");
          } else {
              return cb();
          }
      }
      
      if (this instanceof STREAM.Duplex) {
          while (this.queue.length) {
              this.push(this.queue.shift());
          }
          this.push(decoded_chunk);
      } else {
          this.queue.push(decoded_chunk);
      }
      cb();
  };
  
  
  MemoryDuplexStream.prototype.end = function (chunk, encoding, cb) {
      var self = this;
      return MemoryDuplexStream.super_.prototype.end.call(this, chunk, encoding, function () {
          self.push(null);//finish readble stream too
          if (cb) cb();
      });
  };
  
  
  MemoryReadableStream.prototype._getQueueSize =  
  MemoryWritableStream.prototype._getQueueSize = 
  MemoryDuplexStream.prototype._getQueueSize = function () {
      var queuesize = 0, i;
      for (i = 0; i < this.queue.length; i++) {
          queuesize += Array.isArray(this.queue[i]) ? this.queue[i][0].length
                  : this.queue[i].length;
      }
      return queuesize;
  };
  
  
  MemoryWritableStream.prototype.toString = 
  MemoryDuplexStream.prototype.toString = 
  MemoryReadableStream.prototype.toString = 
  MemoryWritableStream.prototype.getAll = 
  MemoryDuplexStream.prototype.getAll = 
  MemoryReadableStream.prototype.getAll = function () {
      var self = this,
          ret = '';
      this.queue.forEach(function (data) {
          ret += data;
      });
      return ret;
  };
  
  
  MemoryWritableStream.prototype.toBuffer = 
  MemoryDuplexStream.prototype.toBuffer = 
  MemoryReadableStream.prototype.toBuffer = function () {
      var buffer = new Buffer(this._getQueueSize()),
          currentOffset = 0;
  
      this.queue.forEach(function (data) {
          var data_buffer = data instanceof Buffer ? data : new Buffer(data);
          data_buffer.copy(buffer, currentOffset);
          currentOffset += data.length;
      });
      return buffer;
  };
  
  
  module.exports = MemoryStream;
  
  }).call(this)}).call(this,require("buffer").Buffer)
  },{"buffer":24,"stream":51,"string_decoder":23,"util":94}],7:[function(require,module,exports){
  /**
   * Helpers.
   */
  
  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;
  
  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */
  
  module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
  };
  
  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */
  
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }
  
  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */
  
  function fmtShort(ms) {
    if (ms >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (ms >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (ms >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (ms >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }
  
  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */
  
  function fmtLong(ms) {
    return plural(ms, d, 'day') ||
      plural(ms, h, 'hour') ||
      plural(ms, m, 'minute') ||
      plural(ms, s, 'second') ||
      ms + ' ms';
  }
  
  /**
   * Pluralization helper.
   */
  
  function plural(ms, n, name) {
    if (ms < n) {
      return;
    }
    if (ms < n * 1.5) {
      return Math.floor(ms / n) + ' ' + name;
    }
    return Math.ceil(ms / n) + ' ' + name + 's';
  }
  
  },{}],8:[function(require,module,exports){
  'use strict';
  
  var Module = require('module');
  var path = require('path');
  
  module.exports = function requireFromString(code, filename, opts) {
    if (typeof filename === 'object') {
      opts = filename;
      filename = undefined;
    }
  
    opts = opts || {};
    filename = filename || '';
  
    opts.appendPaths = opts.appendPaths || [];
    opts.prependPaths = opts.prependPaths || [];
  
    if (typeof code !== 'string') {
      throw new Error('code must be a string, not ' + typeof code);
    }
  
    var paths = Module._nodeModulePaths(path.dirname(filename));
  
    var parent = module.parent;
    var m = new Module(filename, parent);
    m.filename = filename;
    m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
    m._compile(code, filename);
  
    var exports = m.exports;
    parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1);
  
    return exports;
  };
  
  },{"module":21,"path":45}],9:[function(require,module,exports){
  (function (process){(function (){
  exports = module.exports = SemVer
  
  var debug
  /* istanbul ignore next */
  if (typeof process === 'object' &&
      process.env &&
      process.env.NODE_DEBUG &&
      /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
    debug = function () {
      var args = Array.prototype.slice.call(arguments, 0)
      args.unshift('SEMVER')
      console.log.apply(console, args)
    }
  } else {
    debug = function () {}
  }
  
  // Note: this is the semver.org version of the spec that it implements
  // Not necessarily the package version of this code.
  exports.SEMVER_SPEC_VERSION = '2.0.0'
  
  var MAX_LENGTH = 256
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
    /* istanbul ignore next */ 9007199254740991
  
  // Max safe segment length for coercion.
  var MAX_SAFE_COMPONENT_LENGTH = 16
  
  // The actual regexps go on exports.re
  var re = exports.re = []
  var src = exports.src = []
  var R = 0
  
  // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.
  
  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.
  
  var NUMERICIDENTIFIER = R++
  src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
  var NUMERICIDENTIFIERLOOSE = R++
  src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'
  
  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.
  
  var NONNUMERICIDENTIFIER = R++
  src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'
  
  // ## Main Version
  // Three dot-separated numeric identifiers.
  
  var MAINVERSION = R++
  src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                     '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                     '(' + src[NUMERICIDENTIFIER] + ')'
  
  var MAINVERSIONLOOSE = R++
  src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                          '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                          '(' + src[NUMERICIDENTIFIERLOOSE] + ')'
  
  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.
  
  var PRERELEASEIDENTIFIER = R++
  src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                              '|' + src[NONNUMERICIDENTIFIER] + ')'
  
  var PRERELEASEIDENTIFIERLOOSE = R++
  src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                   '|' + src[NONNUMERICIDENTIFIER] + ')'
  
  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.
  
  var PRERELEASE = R++
  src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                    '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'
  
  var PRERELEASELOOSE = R++
  src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                         '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'
  
  // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.
  
  var BUILDIDENTIFIER = R++
  src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'
  
  // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.
  
  var BUILD = R++
  src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
               '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'
  
  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.
  
  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.
  
  var FULL = R++
  var FULLPLAIN = 'v?' + src[MAINVERSION] +
                  src[PRERELEASE] + '?' +
                  src[BUILD] + '?'
  
  src[FULL] = '^' + FULLPLAIN + '$'
  
  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                   src[PRERELEASELOOSE] + '?' +
                   src[BUILD] + '?'
  
  var LOOSE = R++
  src[LOOSE] = '^' + LOOSEPLAIN + '$'
  
  var GTLT = R++
  src[GTLT] = '((?:<|>)?=?)'
  
  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  var XRANGEIDENTIFIERLOOSE = R++
  src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
  var XRANGEIDENTIFIER = R++
  src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'
  
  var XRANGEPLAIN = R++
  src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                     '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                     '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                     '(?:' + src[PRERELEASE] + ')?' +
                     src[BUILD] + '?' +
                     ')?)?'
  
  var XRANGEPLAINLOOSE = R++
  src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:' + src[PRERELEASELOOSE] + ')?' +
                          src[BUILD] + '?' +
                          ')?)?'
  
  var XRANGE = R++
  src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
  var XRANGELOOSE = R++
  src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'
  
  // Coercion.
  // Extract anything that could conceivably be a part of a valid semver
  var COERCE = R++
  src[COERCE] = '(?:^|[^\\d])' +
                '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
                '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
                '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
                '(?:$|[^\\d])'
  
  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  var LONETILDE = R++
  src[LONETILDE] = '(?:~>?)'
  
  var TILDETRIM = R++
  src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
  re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
  var tildeTrimReplace = '$1~'
  
  var TILDE = R++
  src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
  var TILDELOOSE = R++
  src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'
  
  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  var LONECARET = R++
  src[LONECARET] = '(?:\\^)'
  
  var CARETTRIM = R++
  src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
  re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
  var caretTrimReplace = '$1^'
  
  var CARET = R++
  src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
  var CARETLOOSE = R++
  src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'
  
  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  var COMPARATORLOOSE = R++
  src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
  var COMPARATOR = R++
  src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'
  
  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  var COMPARATORTRIM = R++
  src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                        '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'
  
  // this one has to use the /g flag
  re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
  var comparatorTrimReplace = '$1$2$3'
  
  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  var HYPHENRANGE = R++
  src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                     '\\s+-\\s+' +
                     '(' + src[XRANGEPLAIN] + ')' +
                     '\\s*$'
  
  var HYPHENRANGELOOSE = R++
  src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                          '\\s+-\\s+' +
                          '(' + src[XRANGEPLAINLOOSE] + ')' +
                          '\\s*$'
  
  // Star ranges basically just allow anything at all.
  var STAR = R++
  src[STAR] = '(<|>)?=?\\s*\\*'
  
  // Compile to actual regexp objects.
  // All are flag-free, unless they were created above with a flag.
  for (var i = 0; i < R; i++) {
    debug(i, src[i])
    if (!re[i]) {
      re[i] = new RegExp(src[i])
    }
  }
  
  exports.parse = parse
  function parse (version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
  
    if (version instanceof SemVer) {
      return version
    }
  
    if (typeof version !== 'string') {
      return null
    }
  
    if (version.length > MAX_LENGTH) {
      return null
    }
  
    var r = options.loose ? re[LOOSE] : re[FULL]
    if (!r.test(version)) {
      return null
    }
  
    try {
      return new SemVer(version, options)
    } catch (er) {
      return null
    }
  }
  
  exports.valid = valid
  function valid (version, options) {
    var v = parse(version, options)
    return v ? v.version : null
  }
  
  exports.clean = clean
  function clean (version, options) {
    var s = parse(version.trim().replace(/^[=v]+/, ''), options)
    return s ? s.version : null
  }
  
  exports.SemVer = SemVer
  
  function SemVer (version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
    if (version instanceof SemVer) {
      if (version.loose === options.loose) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError('Invalid Version: ' + version)
    }
  
    if (version.length > MAX_LENGTH) {
      throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
    }
  
    if (!(this instanceof SemVer)) {
      return new SemVer(version, options)
    }
  
    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
  
    var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])
  
    if (!m) {
      throw new TypeError('Invalid Version: ' + version)
    }
  
    this.raw = version
  
    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]
  
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }
  
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }
  
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }
  
    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map(function (id) {
        if (/^[0-9]+$/.test(id)) {
          var num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }
  
    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }
  
  SemVer.prototype.format = function () {
    this.version = this.major + '.' + this.minor + '.' + this.patch
    if (this.prerelease.length) {
      this.version += '-' + this.prerelease.join('.')
    }
    return this.version
  }
  
  SemVer.prototype.toString = function () {
    return this.version
  }
  
  SemVer.prototype.compare = function (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }
  
    return this.compareMain(other) || this.comparePre(other)
  }
  
  SemVer.prototype.compareMain = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }
  
    return compareIdentifiers(this.major, other.major) ||
           compareIdentifiers(this.minor, other.minor) ||
           compareIdentifiers(this.patch, other.patch)
  }
  
  SemVer.prototype.comparePre = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }
  
    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }
  
    var i = 0
    do {
      var a = this.prerelease[i]
      var b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }
  
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  SemVer.prototype.inc = function (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break
  
      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (this.minor !== 0 ||
            this.patch !== 0 ||
            this.prerelease.length === 0) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          var i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break
  
      default:
        throw new Error('invalid increment argument: ' + release)
    }
    this.format()
    this.raw = this.version
    return this
  }
  
  exports.inc = inc
  function inc (version, release, loose, identifier) {
    if (typeof (loose) === 'string') {
      identifier = loose
      loose = undefined
    }
  
    try {
      return new SemVer(version, loose).inc(release, identifier).version
    } catch (er) {
      return null
    }
  }
  
  exports.diff = diff
  function diff (version1, version2) {
    if (eq(version1, version2)) {
      return null
    } else {
      var v1 = parse(version1)
      var v2 = parse(version2)
      var prefix = ''
      if (v1.prerelease.length || v2.prerelease.length) {
        prefix = 'pre'
        var defaultResult = 'prerelease'
      }
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return prefix + key
          }
        }
      }
      return defaultResult // may be undefined
    }
  }
  
  exports.compareIdentifiers = compareIdentifiers
  
  var numeric = /^[0-9]+$/
  function compareIdentifiers (a, b) {
    var anum = numeric.test(a)
    var bnum = numeric.test(b)
  
    if (anum && bnum) {
      a = +a
      b = +b
    }
  
    return a === b ? 0
      : (anum && !bnum) ? -1
      : (bnum && !anum) ? 1
      : a < b ? -1
      : 1
  }
  
  exports.rcompareIdentifiers = rcompareIdentifiers
  function rcompareIdentifiers (a, b) {
    return compareIdentifiers(b, a)
  }
  
  exports.major = major
  function major (a, loose) {
    return new SemVer(a, loose).major
  }
  
  exports.minor = minor
  function minor (a, loose) {
    return new SemVer(a, loose).minor
  }
  
  exports.patch = patch
  function patch (a, loose) {
    return new SemVer(a, loose).patch
  }
  
  exports.compare = compare
  function compare (a, b, loose) {
    return new SemVer(a, loose).compare(new SemVer(b, loose))
  }
  
  exports.compareLoose = compareLoose
  function compareLoose (a, b) {
    return compare(a, b, true)
  }
  
  exports.rcompare = rcompare
  function rcompare (a, b, loose) {
    return compare(b, a, loose)
  }
  
  exports.sort = sort
  function sort (list, loose) {
    return list.sort(function (a, b) {
      return exports.compare(a, b, loose)
    })
  }
  
  exports.rsort = rsort
  function rsort (list, loose) {
    return list.sort(function (a, b) {
      return exports.rcompare(a, b, loose)
    })
  }
  
  exports.gt = gt
  function gt (a, b, loose) {
    return compare(a, b, loose) > 0
  }
  
  exports.lt = lt
  function lt (a, b, loose) {
    return compare(a, b, loose) < 0
  }
  
  exports.eq = eq
  function eq (a, b, loose) {
    return compare(a, b, loose) === 0
  }
  
  exports.neq = neq
  function neq (a, b, loose) {
    return compare(a, b, loose) !== 0
  }
  
  exports.gte = gte
  function gte (a, b, loose) {
    return compare(a, b, loose) >= 0
  }
  
  exports.lte = lte
  function lte (a, b, loose) {
    return compare(a, b, loose) <= 0
  }
  
  exports.cmp = cmp
  function cmp (a, op, b, loose) {
    switch (op) {
      case '===':
        if (typeof a === 'object')
          a = a.version
        if (typeof b === 'object')
          b = b.version
        return a === b
  
      case '!==':
        if (typeof a === 'object')
          a = a.version
        if (typeof b === 'object')
          b = b.version
        return a !== b
  
      case '':
      case '=':
      case '==':
        return eq(a, b, loose)
  
      case '!=':
        return neq(a, b, loose)
  
      case '>':
        return gt(a, b, loose)
  
      case '>=':
        return gte(a, b, loose)
  
      case '<':
        return lt(a, b, loose)
  
      case '<=':
        return lte(a, b, loose)
  
      default:
        throw new TypeError('Invalid operator: ' + op)
    }
  }
  
  exports.Comparator = Comparator
  function Comparator (comp, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
  
    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }
  
    if (!(this instanceof Comparator)) {
      return new Comparator(comp, options)
    }
  
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)
  
    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }
  
    debug('comp', this)
  }
  
  var ANY = {}
  Comparator.prototype.parse = function (comp) {
    var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
    var m = comp.match(r)
  
    if (!m) {
      throw new TypeError('Invalid comparator: ' + comp)
    }
  
    this.operator = m[1]
    if (this.operator === '=') {
      this.operator = ''
    }
  
    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }
  
  Comparator.prototype.toString = function () {
    return this.value
  }
  
  Comparator.prototype.test = function (version) {
    debug('Comparator.test', version, this.options.loose)
  
    if (this.semver === ANY) {
      return true
    }
  
    if (typeof version === 'string') {
      version = new SemVer(version, this.options)
    }
  
    return cmp(version, this.operator, this.semver, this.options)
  }
  
  Comparator.prototype.intersects = function (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }
  
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
  
    var rangeTmp
  
    if (this.operator === '') {
      rangeTmp = new Range(comp.value, options)
      return satisfies(this.value, rangeTmp, options)
    } else if (comp.operator === '') {
      rangeTmp = new Range(this.value, options)
      return satisfies(comp.semver, rangeTmp, options)
    }
  
    var sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    var sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    var sameSemVer = this.semver.version === comp.semver.version
    var differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    var oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      ((this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '<=' || comp.operator === '<'))
    var oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      ((this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '>=' || comp.operator === '>'))
  
    return sameDirectionIncreasing || sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
  }
  
  exports.Range = Range
  function Range (range, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
  
    if (range instanceof Range) {
      if (range.loose === !!options.loose &&
          range.includePrerelease === !!options.includePrerelease) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }
  
    if (range instanceof Comparator) {
      return new Range(range.value, options)
    }
  
    if (!(this instanceof Range)) {
      return new Range(range, options)
    }
  
    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease
  
    // First, split based on boolean or ||
    this.raw = range
    this.set = range.split(/\s*\|\|\s*/).map(function (range) {
      return this.parseRange(range.trim())
    }, this).filter(function (c) {
      // throw out any that are not relevant for whatever reason
      return c.length
    })
  
    if (!this.set.length) {
      throw new TypeError('Invalid SemVer Range: ' + range)
    }
  
    this.format()
  }
  
  Range.prototype.format = function () {
    this.range = this.set.map(function (comps) {
      return comps.join(' ').trim()
    }).join('||').trim()
    return this.range
  }
  
  Range.prototype.toString = function () {
    return this.range
  }
  
  Range.prototype.parseRange = function (range) {
    var loose = this.options.loose
    range = range.trim()
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
    range = range.replace(hr, hyphenReplace)
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range, re[COMPARATORTRIM])
  
    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[TILDETRIM], tildeTrimReplace)
  
    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[CARETTRIM], caretTrimReplace)
  
    // normalize spaces
    range = range.split(/\s+/).join(' ')
  
    // At this point, the range is completely trimmed and
    // ready to be split into comparators.
  
    var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
    var set = range.split(' ').map(function (comp) {
      return parseComparator(comp, this.options)
    }, this).join(' ').split(/\s+/)
    if (this.options.loose) {
      // in loose mode, throw out any that are not valid comparators
      set = set.filter(function (comp) {
        return !!comp.match(compRe)
      })
    }
    set = set.map(function (comp) {
      return new Comparator(comp, this.options)
    }, this)
  
    return set
  }
  
  Range.prototype.intersects = function (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }
  
    return this.set.some(function (thisComparators) {
      return thisComparators.every(function (thisComparator) {
        return range.set.some(function (rangeComparators) {
          return rangeComparators.every(function (rangeComparator) {
            return thisComparator.intersects(rangeComparator, options)
          })
        })
      })
    })
  }
  
  // Mostly just for testing and legacy API reasons
  exports.toComparators = toComparators
  function toComparators (range, options) {
    return new Range(range, options).set.map(function (comp) {
      return comp.map(function (c) {
        return c.value
      }).join(' ').trim().split(' ')
    })
  }
  
  // comprised of xranges, tildes, stars, and gtlt's at this point.
  // already replaced the hyphen ranges
  // turn into a set of JUST comparators.
  function parseComparator (comp, options) {
    debug('comp', comp, options)
    comp = replaceCarets(comp, options)
    debug('caret', comp)
    comp = replaceTildes(comp, options)
    debug('tildes', comp)
    comp = replaceXRanges(comp, options)
    debug('xrange', comp)
    comp = replaceStars(comp, options)
    debug('stars', comp)
    return comp
  }
  
  function isX (id) {
    return !id || id.toLowerCase() === 'x' || id === '*'
  }
  
  // ~, ~> --> * (any, kinda silly)
  // ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
  // ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
  // ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
  // ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
  // ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
  function replaceTildes (comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceTilde(comp, options)
    }).join(' ')
  }
  
  function replaceTilde (comp, options) {
    var r = options.loose ? re[TILDELOOSE] : re[TILDE]
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('tilde', comp, _, M, m, p, pr)
      var ret
  
      if (isX(M)) {
        ret = ''
      } else if (isX(m)) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
      } else if (isX(p)) {
        // ~1.2 == >=1.2.0 <1.3.0
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else if (pr) {
        debug('replaceTilde pr', pr)
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + M + '.' + (+m + 1) + '.0'
      } else {
        // ~1.2.3 == >=1.2.3 <1.3.0
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + M + '.' + (+m + 1) + '.0'
      }
  
      debug('tilde return', ret)
      return ret
    })
  }
  
  // ^ --> * (any, kinda silly)
  // ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
  // ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
  // ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
  // ^1.2.3 --> >=1.2.3 <2.0.0
  // ^1.2.0 --> >=1.2.0 <2.0.0
  function replaceCarets (comp, options) {
    return comp.trim().split(/\s+/).map(function (comp) {
      return replaceCaret(comp, options)
    }).join(' ')
  }
  
  function replaceCaret (comp, options) {
    debug('caret', comp, options)
    var r = options.loose ? re[CARETLOOSE] : re[CARET]
    return comp.replace(r, function (_, M, m, p, pr) {
      debug('caret', comp, _, M, m, p, pr)
      var ret
  
      if (isX(M)) {
        ret = ''
      } else if (isX(m)) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
      } else if (isX(p)) {
        if (M === '0') {
          ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
        } else {
          ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
        }
      } else if (pr) {
        debug('replaceCaret pr', pr)
        if (M === '0') {
          if (m === '0') {
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                  ' <' + M + '.' + m + '.' + (+p + 1)
          } else {
            ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                  ' <' + M + '.' + (+m + 1) + '.0'
          }
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + (+M + 1) + '.0.0'
        }
      } else {
        debug('no pr')
        if (M === '0') {
          if (m === '0') {
            ret = '>=' + M + '.' + m + '.' + p +
                  ' <' + M + '.' + m + '.' + (+p + 1)
          } else {
            ret = '>=' + M + '.' + m + '.' + p +
                  ' <' + M + '.' + (+m + 1) + '.0'
          }
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + (+M + 1) + '.0.0'
        }
      }
  
      debug('caret return', ret)
      return ret
    })
  }
  
  function replaceXRanges (comp, options) {
    debug('replaceXRanges', comp, options)
    return comp.split(/\s+/).map(function (comp) {
      return replaceXRange(comp, options)
    }).join(' ')
  }
  
  function replaceXRange (comp, options) {
    comp = comp.trim()
    var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
      debug('xRange', comp, ret, gtlt, M, m, p, pr)
      var xM = isX(M)
      var xm = xM || isX(m)
      var xp = xm || isX(p)
      var anyX = xp
  
      if (gtlt === '=' && anyX) {
        gtlt = ''
      }
  
      if (xM) {
        if (gtlt === '>' || gtlt === '<') {
          // nothing is allowed
          ret = '<0.0.0'
        } else {
          // nothing is forbidden
          ret = '*'
        }
      } else if (gtlt && anyX) {
        // we know patch is an x, because we have any x at all.
        // replace X with 0
        if (xm) {
          m = 0
        }
        p = 0
  
        if (gtlt === '>') {
          // >1 => >=2.0.0
          // >1.2 => >=1.3.0
          // >1.2.3 => >= 1.2.4
          gtlt = '>='
          if (xm) {
            M = +M + 1
            m = 0
            p = 0
          } else {
            m = +m + 1
            p = 0
          }
        } else if (gtlt === '<=') {
          // <=0.7.x is actually <0.8.0, since any 0.7.x should
          // pass.  Similarly, <=7.x is actually <8.0.0, etc.
          gtlt = '<'
          if (xm) {
            M = +M + 1
          } else {
            m = +m + 1
          }
        }
  
        ret = gtlt + M + '.' + m + '.' + p
      } else if (xm) {
        ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
      } else if (xp) {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      }
  
      debug('xRange return', ret)
  
      return ret
    })
  }
  
  // Because * is AND-ed with everything else in the comparator,
  // and '' means "any version", just remove the *s entirely.
  function replaceStars (comp, options) {
    debug('replaceStars', comp, options)
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re[STAR], '')
  }
  
  // This function is passed to string.replace(re[HYPHENRANGE])
  // M, m, patch, prerelease, build
  // 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  // 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
  // 1.2 - 3.4 => >=1.2.0 <3.5.0
  function hyphenReplace ($0,
    from, fM, fm, fp, fpr, fb,
    to, tM, tm, tp, tpr, tb) {
    if (isX(fM)) {
      from = ''
    } else if (isX(fm)) {
      from = '>=' + fM + '.0.0'
    } else if (isX(fp)) {
      from = '>=' + fM + '.' + fm + '.0'
    } else {
      from = '>=' + from
    }
  
    if (isX(tM)) {
      to = ''
    } else if (isX(tm)) {
      to = '<' + (+tM + 1) + '.0.0'
    } else if (isX(tp)) {
      to = '<' + tM + '.' + (+tm + 1) + '.0'
    } else if (tpr) {
      to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
    } else {
      to = '<=' + to
    }
  
    return (from + ' ' + to).trim()
  }
  
  // if ANY of the sets match ALL of its comparators, then pass
  Range.prototype.test = function (version) {
    if (!version) {
      return false
    }
  
    if (typeof version === 'string') {
      version = new SemVer(version, this.options)
    }
  
    for (var i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
  
  function testSet (set, version, options) {
    for (var i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false
      }
    }
  
    if (version.prerelease.length && !options.includePrerelease) {
      // Find the set of versions that are allowed to have prereleases
      // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
      // That should allow `1.2.3-pr.2` to pass.
      // However, `1.2.4-alpha.notready` should NOT be allowed,
      // even though it's within the range set by the comparators.
      for (i = 0; i < set.length; i++) {
        debug(set[i].semver)
        if (set[i].semver === ANY) {
          continue
        }
  
        if (set[i].semver.prerelease.length > 0) {
          var allowed = set[i].semver
          if (allowed.major === version.major &&
              allowed.minor === version.minor &&
              allowed.patch === version.patch) {
            return true
          }
        }
      }
  
      // Version has a -pre, but it's not one of the ones we like.
      return false
    }
  
    return true
  }
  
  exports.satisfies = satisfies
  function satisfies (version, range, options) {
    try {
      range = new Range(range, options)
    } catch (er) {
      return false
    }
    return range.test(version)
  }
  
  exports.maxSatisfying = maxSatisfying
  function maxSatisfying (versions, range, options) {
    var max = null
    var maxSV = null
    try {
      var rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!max || maxSV.compare(v) === -1) {
          // compare(max, v, true)
          max = v
          maxSV = new SemVer(max, options)
        }
      }
    })
    return max
  }
  
  exports.minSatisfying = minSatisfying
  function minSatisfying (versions, range, options) {
    var min = null
    var minSV = null
    try {
      var rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!min || minSV.compare(v) === 1) {
          // compare(min, v, true)
          min = v
          minSV = new SemVer(min, options)
        }
      }
    })
    return min
  }
  
  exports.minVersion = minVersion
  function minVersion (range, loose) {
    range = new Range(range, loose)
  
    var minver = new SemVer('0.0.0')
    if (range.test(minver)) {
      return minver
    }
  
    minver = new SemVer('0.0.0-0')
    if (range.test(minver)) {
      return minver
    }
  
    minver = null
    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i]
  
      comparators.forEach(function (comparator) {
        // Clone to avoid manipulating the comparator's semver object.
        var compver = new SemVer(comparator.semver.version)
        switch (comparator.operator) {
          case '>':
            if (compver.prerelease.length === 0) {
              compver.patch++
            } else {
              compver.prerelease.push(0)
            }
            compver.raw = compver.format()
            /* fallthrough */
          case '':
          case '>=':
            if (!minver || gt(minver, compver)) {
              minver = compver
            }
            break
          case '<':
          case '<=':
            /* Ignore maximum versions */
            break
          /* istanbul ignore next */
          default:
            throw new Error('Unexpected operation: ' + comparator.operator)
        }
      })
    }
  
    if (minver && range.test(minver)) {
      return minver
    }
  
    return null
  }
  
  exports.validRange = validRange
  function validRange (range, options) {
    try {
      // Return '*' instead of '' so that truthiness works.
      // This will throw if it's invalid anyway
      return new Range(range, options).range || '*'
    } catch (er) {
      return null
    }
  }
  
  // Determine if version is less than all the versions possible in the range
  exports.ltr = ltr
  function ltr (version, range, options) {
    return outside(version, range, '<', options)
  }
  
  // Determine if version is greater than all the versions possible in the range.
  exports.gtr = gtr
  function gtr (version, range, options) {
    return outside(version, range, '>', options)
  }
  
  exports.outside = outside
  function outside (version, range, hilo, options) {
    version = new SemVer(version, options)
    range = new Range(range, options)
  
    var gtfn, ltefn, ltfn, comp, ecomp
    switch (hilo) {
      case '>':
        gtfn = gt
        ltefn = lte
        ltfn = lt
        comp = '>'
        ecomp = '>='
        break
      case '<':
        gtfn = lt
        ltefn = gte
        ltfn = gt
        comp = '<'
        ecomp = '<='
        break
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"')
    }
  
    // If it satisifes the range it is not outside
    if (satisfies(version, range, options)) {
      return false
    }
  
    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.
  
    for (var i = 0; i < range.set.length; ++i) {
      var comparators = range.set[i]
  
      var high = null
      var low = null
  
      comparators.forEach(function (comparator) {
        if (comparator.semver === ANY) {
          comparator = new Comparator('>=0.0.0')
        }
        high = high || comparator
        low = low || comparator
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator
        }
      })
  
      // If the edge version comparator has a operator then our version
      // isn't outside it
      if (high.operator === comp || high.operator === ecomp) {
        return false
      }
  
      // If the lowest version comparator has an operator and our version
      // is less than it then it isn't higher than the range
      if ((!low.operator || low.operator === comp) &&
          ltefn(version, low.semver)) {
        return false
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false
      }
    }
    return true
  }
  
  exports.prerelease = prerelease
  function prerelease (version, options) {
    var parsed = parse(version, options)
    return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
  }
  
  exports.intersects = intersects
  function intersects (r1, r2, options) {
    r1 = new Range(r1, options)
    r2 = new Range(r2, options)
    return r1.intersects(r2)
  }
  
  exports.coerce = coerce
  function coerce (version) {
    if (version instanceof SemVer) {
      return version
    }
  
    if (typeof version !== 'string') {
      return null
    }
  
    var match = version.match(re[COERCE])
  
    if (match == null) {
      return null
    }
  
    return parse(match[1] +
      '.' + (match[2] || '0') +
      '.' + (match[3] || '0'))
  }
  
  }).call(this)}).call(this,require('_process'))
  },{"_process":46}],10:[function(require,module,exports){
  var assert = require('assert');
  var keccak256 = require('js-sha3').keccak256;
  
  function libraryHashPlaceholder (input) {
    return '$' + keccak256(input).slice(0, 34) + '$';
  }
  
  var linkBytecode = function (bytecode, libraries) {
    assert(typeof bytecode === 'string');
    assert(typeof libraries === 'object');
    // NOTE: for backwards compatibility support old compiler which didn't use file names
    var librariesComplete = {};
    for (var libraryName in libraries) {
      if (typeof libraries[libraryName] === 'object') {
        // API compatible with the standard JSON i/o
        for (var lib in libraries[libraryName]) {
          librariesComplete[lib] = libraries[libraryName][lib];
          librariesComplete[libraryName + ':' + lib] = libraries[libraryName][lib];
        }
      } else {
        // backwards compatible API for early solc-js versions
        var parsed = libraryName.match(/^([^:]+):(.+)$/);
        if (parsed) {
          librariesComplete[parsed[2]] = libraries[libraryName];
        }
        librariesComplete[libraryName] = libraries[libraryName];
      }
    }
  
    for (libraryName in librariesComplete) {
      var hexAddress = librariesComplete[libraryName];
      if (hexAddress.slice(0, 2) !== '0x' || hexAddress.length > 42) {
        throw new Error('Invalid address specified for ' + libraryName);
      }
      // remove 0x prefix
      hexAddress = hexAddress.slice(2);
      hexAddress = Array(40 - hexAddress.length + 1).join('0') + hexAddress;
  
      // Support old (library name) and new (hash of library name)
      // placeholders.
      var replace = function (name) {
        // truncate to 37 characters
        var truncatedName = name.slice(0, 36);
        var libLabel = '__' + truncatedName + Array(37 - truncatedName.length).join('_') + '__';
        while (bytecode.indexOf(libLabel) >= 0) {
          bytecode = bytecode.replace(libLabel, hexAddress);
        }
      };
  
      replace(libraryName);
      replace(libraryHashPlaceholder(libraryName));
    }
  
    return bytecode;
  };
  
  var findLinkReferences = function (bytecode) {
    assert(typeof bytecode === 'string');
    // find 40 bytes in the pattern of __...<36 digits>...__
    // e.g. __Lib.sol:L_____________________________
    var linkReferences = {};
    var offset = 0;
    while (true) {
      var found = bytecode.match(/__(.{36})__/);
      if (!found) {
        break;
      }
  
      var start = found.index;
      // trim trailing underscores
      // NOTE: this has no way of knowing if the trailing underscore was part of the name
      var libraryName = found[1].replace(/_+$/gm, '');
  
      if (!linkReferences[libraryName]) {
        linkReferences[libraryName] = [];
      }
  
      linkReferences[libraryName].push({
        // offsets are in bytes in binary representation (and not hex)
        start: (offset + start) / 2,
        length: 20
      });
  
      offset += start + 20;
  
      bytecode = bytecode.slice(start + 20);
    }
    return linkReferences;
  };
  
  module.exports = {
    linkBytecode: linkBytecode,
    findLinkReferences: findLinkReferences
  };
  
  },{"assert":14,"js-sha3":5}],11:[function(require,module,exports){
  var linker = require('./linker.js');
  
  /// Translate old style version numbers to semver.
  /// Old style: 0.3.6-3fc68da5/Release-Emscripten/clang
  ///            0.3.5-371690f0/Release-Emscripten/clang/Interpreter
  ///            0.3.5-0/Release-Emscripten/clang/Interpreter
  ///            0.2.0-e7098958/.-Emscripten/clang/int linked to libethereum-1.1.1-bbb80ab0/.-Emscripten/clang/int
  ///            0.1.3-0/.-/clang/int linked to libethereum-0.9.92-0/.-/clang/int
  ///            0.1.2-5c3bfd4b*/.-/clang/int
  ///            0.1.1-6ff4cd6b/RelWithDebInfo-Emscripten/clang/int
  /// New style: 0.4.5+commit.b318366e.Emscripten.clang
  function versionToSemver (version) {
    // FIXME: parse more detail, but this is a good start
    var parsed = version.match(/^([0-9]+\.[0-9]+\.[0-9]+)-([0-9a-f]{8})[/*].*$/);
    if (parsed) {
      return parsed[1] + '+commit.' + parsed[2];
    }
    if (version.indexOf('0.1.3-0') !== -1) {
      return '0.1.3';
    }
    if (version.indexOf('0.3.5-0') !== -1) {
      return '0.3.5';
    }
    // assume it is already semver compatible
    return version;
  }
  
  function translateErrors (ret, errors) {
    for (var error in errors) {
      var type = 'error';
      var extractType = /^(.*):(\d+):(\d+):(.*):/;
      extractType = extractType.exec(errors[error]);
      if (extractType) {
        type = extractType[4].trim();
      } else if (errors[error].indexOf(': Warning:')) {
        type = 'Warning';
      } else if (errors[error].indexOf(': Error:')) {
        type = 'Error';
      }
      ret.push({
        type: type,
        component: 'general',
        severity: (type === 'Warning') ? 'warning' : 'error',
        message: errors[error],
        formattedMessage: errors[error]
      });
    }
  }
  
  function translateGasEstimates (gasEstimates) {
    if (gasEstimates === null) {
      return 'infinite';
    }
  
    if (typeof gasEstimates === 'number') {
      return gasEstimates.toString();
    }
  
    var gasEstimatesTranslated = {};
    for (var func in gasEstimates) {
      gasEstimatesTranslated[func] = translateGasEstimates(gasEstimates[func]);
    }
    return gasEstimatesTranslated;
  }
  
  function translateJsonCompilerOutput (output, libraries) {
    var ret = {};
  
    ret['errors'] = [];
    var errors;
    if (output['error']) {
      errors = [ output['error'] ];
    } else {
      errors = output['errors'];
    }
    translateErrors(ret['errors'], errors);
  
    ret['contracts'] = {};
    for (var contract in output['contracts']) {
      // Split name first, can be `contract`, `:contract` or `filename:contract`
      var tmp = contract.match(/^(([^:]*):)?([^:]+)$/);
      if (tmp.length !== 4) {
        // Force abort
        return null;
      }
      var fileName = tmp[2];
      if (fileName === undefined) {
        // this is the case of `contract`
        fileName = '';
      }
      var contractName = tmp[3];
  
      var contractInput = output['contracts'][contract];
  
      var gasEstimates = contractInput['gasEstimates'];
      var translatedGasEstimates = {};
  
      if (gasEstimates['creation']) {
        translatedGasEstimates['creation'] = {
          'codeDepositCost': translateGasEstimates(gasEstimates['creation'][1]),
          'executionCost': translateGasEstimates(gasEstimates['creation'][0])
        };
      }
      if (gasEstimates['internal']) {
        translatedGasEstimates['internal'] = translateGasEstimates(gasEstimates['internal']);
      }
      if (gasEstimates['external']) {
        translatedGasEstimates['external'] = translateGasEstimates(gasEstimates['external']);
      }
  
      var contractOutput = {
        'abi': JSON.parse(contractInput['interface']),
        'metadata': contractInput['metadata'],
        'evm': {
          'legacyAssembly': contractInput['assembly'],
          'bytecode': {
            'object': contractInput['bytecode'] && linker.linkBytecode(contractInput['bytecode'], libraries || {}),
            'opcodes': contractInput['opcodes'],
            'sourceMap': contractInput['srcmap'],
            'linkReferences': contractInput['bytecode'] && linker.findLinkReferences(contractInput['bytecode'])
          },
          'deployedBytecode': {
            'object': contractInput['runtimeBytecode'] && linker.linkBytecode(contractInput['runtimeBytecode'], libraries || {}),
            'sourceMap': contractInput['srcmapRuntime'],
            'linkReferences': contractInput['runtimeBytecode'] && linker.findLinkReferences(contractInput['runtimeBytecode'])
          },
          'methodIdentifiers': contractInput['functionHashes'],
          'gasEstimates': translatedGasEstimates
        }
      };
  
      if (!ret['contracts'][fileName]) {
        ret['contracts'][fileName] = {};
      }
  
      ret['contracts'][fileName][contractName] = contractOutput;
    }
  
    var sourceMap = {};
    for (var sourceId in output['sourceList']) {
      sourceMap[output['sourceList'][sourceId]] = sourceId;
    }
  
    ret['sources'] = {};
    for (var source in output['sources']) {
      ret['sources'][source] = {
        id: sourceMap[source],
        legacyAST: output['sources'][source].AST
      };
    }
  
    return ret;
  }
  
  function escapeString (text) {
    return text
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
  
  // 'asm' can be an object or a string
  function formatAssemblyText (asm, prefix, source) {
    if (typeof asm === 'string' || asm === null || asm === undefined) {
      return prefix + (asm || '') + '\n';
    }
    var text = prefix + '.code\n';
    asm['.code'].forEach(function (item, i) {
      var v = item.value === undefined ? '' : item.value;
      var src = '';
      if (source !== undefined && item.begin !== undefined && item.end !== undefined) {
        src = escapeString(source.slice(item.begin, item.end));
      }
      if (src.length > 30) {
        src = src.slice(0, 30) + '...';
      }
      if (item.name !== 'tag') {
        text += '  ';
      }
      text += prefix + item.name + ' ' + v + '\t\t\t' + src + '\n';
    });
    text += prefix + '.data\n';
    var asmData = asm['.data'] || [];
    for (var i in asmData) {
      var item = asmData[i];
      text += '  ' + prefix + '' + i + ':\n';
      text += formatAssemblyText(item, prefix + '    ', source);
    }
    return text;
  }
  
  function prettyPrintLegacyAssemblyJSON (assembly, source) {
    return formatAssemblyText(assembly, '', source);
  }
  
  module.exports = {
    versionToSemver: versionToSemver,
    translateJsonCompilerOutput: translateJsonCompilerOutput,
    prettyPrintLegacyAssemblyJSON: prettyPrintLegacyAssemblyJSON
  };
  
  },{"./linker.js":10}],12:[function(require,module,exports){
  var assert = require('assert');
  var translate = require('./translate.js');
  var requireFromString = require('require-from-string');
  var https = require('follow-redirects').https;
  var MemoryStream = require('memorystream');
  var semver = require('semver');
  
  function setupMethods (soljson) {
    var version;
    if ('_solidity_version' in soljson) {
      version = soljson.cwrap('solidity_version', 'string', []);
    } else {
      version = soljson.cwrap('version', 'string', []);
    }
  
    var versionToSemver = function () {
      return translate.versionToSemver(version());
    };
  
    var isVersion6 = semver.gt(versionToSemver(), '0.5.99');
  
    var license;
    if ('_solidity_license' in soljson) {
      license = soljson.cwrap('solidity_license', 'string', []);
    } else if ('_license' in soljson) {
      license = soljson.cwrap('license', 'string', []);
    } else {
      // pre 0.4.14
      license = function () {
        // return undefined
      };
    }
  
    var alloc;
    if ('_solidity_alloc' in soljson) {
      alloc = soljson.cwrap('solidity_alloc', 'number', [ 'number' ]);
    } else {
      alloc = soljson._malloc;
      assert(alloc, 'Expected malloc to be present.');
    }
  
    var reset;
    if ('_solidity_reset' in soljson) {
      reset = soljson.cwrap('solidity_reset', null, []);
    }
  
    var copyToCString = function (str, ptr) {
      var length = soljson.lengthBytesUTF8(str);
      // This is allocating memory using solc's allocator.
      //
      // Before 0.6.0:
      //   Assuming copyToCString is only used in the context of wrapCallback, solc will free these pointers.
      //   See https://github.com/ethereum/solidity/blob/v0.5.13/libsolc/libsolc.h#L37-L40
      //
      // After 0.6.0:
      //   The duty is on solc-js to free these pointers. We accomplish that by calling `reset` at the end.
      var buffer = alloc(length + 1);
      soljson.stringToUTF8(str, buffer, length + 1);
      soljson.setValue(ptr, buffer, '*');
    };
  
    // This is to support multiple versions of Emscripten.
    // Take a single `ptr` and returns a `str`.
    var copyFromCString = soljson.UTF8ToString || soljson.Pointer_stringify;
  
    var wrapCallback = function (callback) {
      assert(typeof callback === 'function', 'Invalid callback specified.');
      return function (data, contents, error) {
        var result = callback(copyFromCString(data));
        if (typeof result.contents === 'string') {
          copyToCString(result.contents, contents);
        }
        if (typeof result.error === 'string') {
          copyToCString(result.error, error);
        }
      };
    };
  
    var wrapCallbackWithKind = function (callback) {
      assert(typeof callback === 'function', 'Invalid callback specified.');
      return function (context, kind, data, contents, error) {
        // Must be a null pointer.
        assert(context === 0, 'Callback context must be null.');
        var result = callback(copyFromCString(kind), copyFromCString(data));
        if (typeof result.contents === 'string') {
          copyToCString(result.contents, contents);
        }
        if (typeof result.error === 'string') {
          copyToCString(result.error, error);
        }
      };
    };
  
    // This calls compile() with args || cb
    var runWithCallbacks = function (callbacks, compile, args) {
      if (callbacks) {
        assert(typeof callbacks === 'object', 'Invalid callback object specified.');
      } else {
        callbacks = {};
      }
  
      var readCallback = callbacks.import;
      if (readCallback === undefined) {
        readCallback = function (data) {
          return {
            error: 'File import callback not supported'
          };
        };
      }
  
      var singleCallback;
      if (isVersion6) {
        // After 0.6.x multiple kind of callbacks are supported.
        var smtSolverCallback = callbacks.smtSolver;
        if (smtSolverCallback === undefined) {
          smtSolverCallback = function (data) {
            return {
              error: 'SMT solver callback not supported'
            };
          };
        }
  
        singleCallback = function (kind, data) {
          if (kind === 'source') {
            return readCallback(data);
          } else if (kind === 'smt-query') {
            return smtSolverCallback(data);
          } else {
            assert(false, 'Invalid callback kind specified.');
          }
        };
  
        singleCallback = wrapCallbackWithKind(singleCallback);
      } else {
        // Old Solidity version only supported imports.
        singleCallback = wrapCallback(readCallback);
      }
  
      // This is to support multiple versions of Emscripten.
      var addFunction = soljson.addFunction || soljson.Runtime.addFunction;
      var removeFunction = soljson.removeFunction || soljson.Runtime.removeFunction;
  
      var cb = addFunction(singleCallback, 'viiiii');
      var output;
      try {
        args.push(cb);
        if (isVersion6) {
          // Callback context.
          args.push(null);
        }
        output = compile.apply(undefined, args);
      } catch (e) {
        removeFunction(cb);
        throw e;
      }
      removeFunction(cb);
      if (reset) {
        // Explicitly free memory.
        //
        // NOTE: cwrap() of "compile" will copy the returned pointer into a
        //       Javascript string and it is not possible to call free() on it.
        //       reset() however will clear up all allocations.
        reset();
      }
      return output;
    };
  
    var compileJSON = null;
    if ('_compileJSON' in soljson) {
      // input (text), optimize (bool) -> output (jsontext)
      compileJSON = soljson.cwrap('compileJSON', 'string', ['string', 'number']);
    }
  
    var compileJSONMulti = null;
    if ('_compileJSONMulti' in soljson) {
      // input (jsontext), optimize (bool) -> output (jsontext)
      compileJSONMulti = soljson.cwrap('compileJSONMulti', 'string', ['string', 'number']);
    }
  
    var compileJSONCallback = null;
    if ('_compileJSONCallback' in soljson) {
      // input (jsontext), optimize (bool), callback (ptr) -> output (jsontext)
      var compileInternal = soljson.cwrap('compileJSONCallback', 'string', ['string', 'number', 'number']);
      compileJSONCallback = function (input, optimize, readCallback) {
        return runWithCallbacks(readCallback, compileInternal, [ input, optimize ]);
      };
    }
  
    var compileStandard = null;
    if ('_compileStandard' in soljson) {
      // input (jsontext), callback (ptr) -> output (jsontext)
      var compileStandardInternal = soljson.cwrap('compileStandard', 'string', ['string', 'number']);
      compileStandard = function (input, readCallback) {
        return runWithCallbacks(readCallback, compileStandardInternal, [ input ]);
      };
    }
    if ('_solidity_compile' in soljson) {
      var solidityCompile;
      if (isVersion6) {
        // input (jsontext), callback (ptr), callback_context (ptr) -> output (jsontext)
        solidityCompile = soljson.cwrap('solidity_compile', 'string', ['string', 'number', 'number']);
      } else {
        // input (jsontext), callback (ptr) -> output (jsontext)
        solidityCompile = soljson.cwrap('solidity_compile', 'string', ['string', 'number']);
      }
      compileStandard = function (input, callbacks) {
        return runWithCallbacks(callbacks, solidityCompile, [ input ]);
      };
    }
  
    // Expects a Standard JSON I/O but supports old compilers
    var compileStandardWrapper = function (input, readCallback) {
      if (compileStandard !== null) {
        return compileStandard(input, readCallback);
      }
  
      function formatFatalError (message) {
        return JSON.stringify({
          errors: [
            {
              'type': 'JSONError',
              'component': 'solcjs',
              'severity': 'error',
              'message': message,
              'formattedMessage': 'Error: ' + message
            }
          ]
        });
      }
  
      try {
        input = JSON.parse(input);
      } catch (e) {
        return formatFatalError('Invalid JSON supplied: ' + e.message);
      }
  
      if (input['language'] !== 'Solidity') {
        return formatFatalError('Only "Solidity" is supported as a language.');
      }
  
      // NOTE: this is deliberately `== null`
      if (input['sources'] == null || input['sources'].length === 0) {
        return formatFatalError('No input sources specified.');
      }
  
      function isOptimizerEnabled (input) {
        return input['settings'] && input['settings']['optimizer'] && input['settings']['optimizer']['enabled'];
      }
  
      function translateSources (input) {
        var sources = {};
        for (var source in input['sources']) {
          if (input['sources'][source]['content'] !== null) {
            sources[source] = input['sources'][source]['content'];
          } else {
            // force failure
            return null;
          }
        }
        return sources;
      }
  
      function librariesSupplied (input) {
        if (input['settings']) {
          return input['settings']['libraries'];
        }
      }
  
      function translateOutput (output, libraries) {
        try {
          output = JSON.parse(output);
        } catch (e) {
          return formatFatalError('Compiler returned invalid JSON: ' + e.message);
        }
        output = translate.translateJsonCompilerOutput(output, libraries);
        if (output == null) {
          return formatFatalError('Failed to process output.');
        }
        return JSON.stringify(output);
      }
  
      var sources = translateSources(input);
      if (sources === null || Object.keys(sources).length === 0) {
        return formatFatalError('Failed to process sources.');
      }
  
      // Try linking if libraries were supplied
      var libraries = librariesSupplied(input);
  
      // Try to wrap around old versions
      if (compileJSONCallback !== null) {
        return translateOutput(compileJSONCallback(JSON.stringify({ 'sources': sources }), isOptimizerEnabled(input), readCallback), libraries);
      }
  
      if (compileJSONMulti !== null) {
        return translateOutput(compileJSONMulti(JSON.stringify({ 'sources': sources }), isOptimizerEnabled(input)), libraries);
      }
  
      // Try our luck with an ancient compiler
      if (compileJSON !== null) {
        if (Object.keys(sources).length !== 1) {
          return formatFatalError('Multiple sources provided, but compiler only supports single input.');
        }
        return translateOutput(compileJSON(sources[Object.keys(sources)[0]], isOptimizerEnabled(input)), libraries);
      }
  
      return formatFatalError('Compiler does not support any known interface.');
    };
  
    return {
      version: version,
      semver: versionToSemver,
      license: license,
      lowlevel: {
        compileSingle: compileJSON,
        compileMulti: compileJSONMulti,
        compileCallback: compileJSONCallback,
        compileStandard: compileStandard
      },
      features: {
        legacySingleInput: compileJSON !== null,
        multipleInputs: compileJSONMulti !== null || compileStandard !== null,
        importCallback: compileJSONCallback !== null || compileStandard !== null,
        nativeStandardJSON: compileStandard !== null
      },
      compile: compileStandardWrapper,
      // Loads the compiler of the given version from the github repository
      // instead of from the local filesystem.
      loadRemoteVersion: function (versionString, cb) {
        var mem = new MemoryStream(null, {readable: false});
        var url = 'https://binaries.soliditylang.org/bin/soljson-' + versionString + '.js';
        https.get(url, function (response) {
          if (response.statusCode !== 200) {
            cb(new Error('Error retrieving binary: ' + response.statusMessage));
          } else {
            response.pipe(mem);
            response.on('end', function () {
              cb(null, setupMethods(requireFromString(mem.toString(), 'soljson-' + versionString + '.js')));
            });
          }
        }).on('error', function (error) {
          cb(error);
        });
      },
      // Use this if you want to add wrapper functions around the pure module.
      setupMethods: setupMethods
    };
  }
  
  module.exports = setupMethods;
  
  },{"./translate.js":11,"assert":14,"follow-redirects":4,"memorystream":6,"require-from-string":8,"semver":9}],13:[function(require,module,exports){
  const wrapper = require('solc/wrapper')
  
  ;(async () => {
    await importScripts('https://solc-bin.ethereum.org/bin/soljson-latest.js')
  
    const solc = wrapper(window.Module)
  
    window.solc = solc
  })()
  
  },{"solc/wrapper":12}],14:[function(require,module,exports){
  (function (global){(function (){
  'use strict';
  
  var objectAssign = require('object-assign');
  
  // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
  // original notice:
  
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  function compare(a, b) {
    if (a === b) {
      return 0;
    }
  
    var x = a.length;
    var y = b.length;
  
    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
  
    if (x < y) {
      return -1;
    }
    if (y < x) {
      return 1;
    }
    return 0;
  }
  function isBuffer(b) {
    if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
      return global.Buffer.isBuffer(b);
    }
    return !!(b != null && b._isBuffer);
  }
  
  // based on node assert, original notice:
  // NB: The URL to the CommonJS spec is kept just for tradition.
  //     node-assert has evolved a lot since then, both in API and behavior.
  
  // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
  //
  // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
  //
  // Originally from narwhal.js (http://narwhaljs.org)
  // Copyright (c) 2009 Thomas Robinson <280north.com>
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy
  // of this software and associated documentation files (the 'Software'), to
  // deal in the Software without restriction, including without limitation the
  // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
  // sell copies of the Software, and to permit persons to whom the Software is
  // furnished to do so, subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in
  // all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  var util = require('util/');
  var hasOwn = Object.prototype.hasOwnProperty;
  var pSlice = Array.prototype.slice;
  var functionsHaveNames = (function () {
    return function foo() {}.name === 'foo';
  }());
  function pToString (obj) {
    return Object.prototype.toString.call(obj);
  }
  function isView(arrbuf) {
    if (isBuffer(arrbuf)) {
      return false;
    }
    if (typeof global.ArrayBuffer !== 'function') {
      return false;
    }
    if (typeof ArrayBuffer.isView === 'function') {
      return ArrayBuffer.isView(arrbuf);
    }
    if (!arrbuf) {
      return false;
    }
    if (arrbuf instanceof DataView) {
      return true;
    }
    if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
      return true;
    }
    return false;
  }
  // 1. The assert module provides functions that throw
  // AssertionError's when particular conditions are not met. The
  // assert module must conform to the following interface.
  
  var assert = module.exports = ok;
  
  // 2. The AssertionError is defined in assert.
  // new assert.AssertionError({ message: message,
  //                             actual: actual,
  //                             expected: expected })
  
  var regex = /\s*function\s+([^\(\s]*)\s*/;
  // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
  function getName(func) {
    if (!util.isFunction(func)) {
      return;
    }
    if (functionsHaveNames) {
      return func.name;
    }
    var str = func.toString();
    var match = str.match(regex);
    return match && match[1];
  }
  assert.AssertionError = function AssertionError(options) {
    this.name = 'AssertionError';
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
    if (options.message) {
      this.message = options.message;
      this.generatedMessage = false;
    } else {
      this.message = getMessage(this);
      this.generatedMessage = true;
    }
    var stackStartFunction = options.stackStartFunction || fail;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, stackStartFunction);
    } else {
      // non v8 browsers so we can have a stacktrace
      var err = new Error();
      if (err.stack) {
        var out = err.stack;
  
        // try to strip useless frames
        var fn_name = getName(stackStartFunction);
        var idx = out.indexOf('\n' + fn_name);
        if (idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          var next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }
  
        this.stack = out;
      }
    }
  };
  
  // assert.AssertionError instanceof Error
  util.inherits(assert.AssertionError, Error);
  
  function truncate(s, n) {
    if (typeof s === 'string') {
      return s.length < n ? s : s.slice(0, n);
    } else {
      return s;
    }
  }
  function inspect(something) {
    if (functionsHaveNames || !util.isFunction(something)) {
      return util.inspect(something);
    }
    var rawname = getName(something);
    var name = rawname ? ': ' + rawname : '';
    return '[Function' +  name + ']';
  }
  function getMessage(self) {
    return truncate(inspect(self.actual), 128) + ' ' +
           self.operator + ' ' +
           truncate(inspect(self.expected), 128);
  }
  
  // At present only the three keys mentioned above are used and
  // understood by the spec. Implementations or sub modules can pass
  // other keys to the AssertionError's constructor - they will be
  // ignored.
  
  // 3. All of the following functions must throw an AssertionError
  // when a corresponding condition is not met, with a message that
  // may be undefined if not provided.  All assertion methods provide
  // both the actual and expected values to the assertion error for
  // display purposes.
  
  function fail(actual, expected, message, operator, stackStartFunction) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: expected,
      operator: operator,
      stackStartFunction: stackStartFunction
    });
  }
  
  // EXTENSION! allows for well behaved errors defined elsewhere.
  assert.fail = fail;
  
  // 4. Pure assertion tests whether a value is truthy, as determined
  // by !!guard.
  // assert.ok(guard, message_opt);
  // This statement is equivalent to assert.equal(true, !!guard,
  // message_opt);. To test strictly for the value true, use
  // assert.strictEqual(true, guard, message_opt);.
  
  function ok(value, message) {
    if (!value) fail(value, true, message, '==', assert.ok);
  }
  assert.ok = ok;
  
  // 5. The equality assertion tests shallow, coercive equality with
  // ==.
  // assert.equal(actual, expected, message_opt);
  
  assert.equal = function equal(actual, expected, message) {
    if (actual != expected) fail(actual, expected, message, '==', assert.equal);
  };
  
  // 6. The non-equality assertion tests for whether two objects are not equal
  // with != assert.notEqual(actual, expected, message_opt);
  
  assert.notEqual = function notEqual(actual, expected, message) {
    if (actual == expected) {
      fail(actual, expected, message, '!=', assert.notEqual);
    }
  };
  
  // 7. The equivalence assertion tests a deep equality relation.
  // assert.deepEqual(actual, expected, message_opt);
  
  assert.deepEqual = function deepEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, false)) {
      fail(actual, expected, message, 'deepEqual', assert.deepEqual);
    }
  };
  
  assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
    if (!_deepEqual(actual, expected, true)) {
      fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
    }
  };
  
  function _deepEqual(actual, expected, strict, memos) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if (isBuffer(actual) && isBuffer(expected)) {
      return compare(actual, expected) === 0;
  
    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (util.isDate(actual) && util.isDate(expected)) {
      return actual.getTime() === expected.getTime();
  
    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same source and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
    } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
      return actual.source === expected.source &&
             actual.global === expected.global &&
             actual.multiline === expected.multiline &&
             actual.lastIndex === expected.lastIndex &&
             actual.ignoreCase === expected.ignoreCase;
  
    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
    } else if ((actual === null || typeof actual !== 'object') &&
               (expected === null || typeof expected !== 'object')) {
      return strict ? actual === expected : actual == expected;
  
    // If both values are instances of typed arrays, wrap their underlying
    // ArrayBuffers in a Buffer each to increase performance
    // This optimization requires the arrays to have the same type as checked by
    // Object.prototype.toString (aka pToString). Never perform binary
    // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
    // bit patterns are not identical.
    } else if (isView(actual) && isView(expected) &&
               pToString(actual) === pToString(expected) &&
               !(actual instanceof Float32Array ||
                 actual instanceof Float64Array)) {
      return compare(new Uint8Array(actual.buffer),
                     new Uint8Array(expected.buffer)) === 0;
  
    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else if (isBuffer(actual) !== isBuffer(expected)) {
      return false;
    } else {
      memos = memos || {actual: [], expected: []};
  
      var actualIndex = memos.actual.indexOf(actual);
      if (actualIndex !== -1) {
        if (actualIndex === memos.expected.indexOf(expected)) {
          return true;
        }
      }
  
      memos.actual.push(actual);
      memos.expected.push(expected);
  
      return objEquiv(actual, expected, strict, memos);
    }
  }
  
  function isArguments(object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }
  
  function objEquiv(a, b, strict, actualVisitedObjects) {
    if (a === null || a === undefined || b === null || b === undefined)
      return false;
    // if one is a primitive, the other must be same
    if (util.isPrimitive(a) || util.isPrimitive(b))
      return a === b;
    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
      return false;
    var aIsArgs = isArguments(a);
    var bIsArgs = isArguments(b);
    if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
      return false;
    if (aIsArgs) {
      a = pSlice.call(a);
      b = pSlice.call(b);
      return _deepEqual(a, b, strict);
    }
    var ka = objectKeys(a);
    var kb = objectKeys(b);
    var key, i;
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] !== kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
        return false;
    }
    return true;
  }
  
  // 8. The non-equivalence assertion tests for any deep inequality.
  // assert.notDeepEqual(actual, expected, message_opt);
  
  assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
    if (_deepEqual(actual, expected, false)) {
      fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
    }
  };
  
  assert.notDeepStrictEqual = notDeepStrictEqual;
  function notDeepStrictEqual(actual, expected, message) {
    if (_deepEqual(actual, expected, true)) {
      fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
    }
  }
  
  
  // 9. The strict equality assertion tests strict equality, as determined by ===.
  // assert.strictEqual(actual, expected, message_opt);
  
  assert.strictEqual = function strictEqual(actual, expected, message) {
    if (actual !== expected) {
      fail(actual, expected, message, '===', assert.strictEqual);
    }
  };
  
  // 10. The strict non-equality assertion tests for strict inequality, as
  // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
  
  assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
    if (actual === expected) {
      fail(actual, expected, message, '!==', assert.notStrictEqual);
    }
  };
  
  function expectedException(actual, expected) {
    if (!actual || !expected) {
      return false;
    }
  
    if (Object.prototype.toString.call(expected) == '[object RegExp]') {
      return expected.test(actual);
    }
  
    try {
      if (actual instanceof expected) {
        return true;
      }
    } catch (e) {
      // Ignore.  The instanceof check doesn't work for arrow functions.
    }
  
    if (Error.isPrototypeOf(expected)) {
      return false;
    }
  
    return expected.call({}, actual) === true;
  }
  
  function _tryBlock(block) {
    var error;
    try {
      block();
    } catch (e) {
      error = e;
    }
    return error;
  }
  
  function _throws(shouldThrow, block, expected, message) {
    var actual;
  
    if (typeof block !== 'function') {
      throw new TypeError('"block" argument must be a function');
    }
  
    if (typeof expected === 'string') {
      message = expected;
      expected = null;
    }
  
    actual = _tryBlock(block);
  
    message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
              (message ? ' ' + message : '.');
  
    if (shouldThrow && !actual) {
      fail(actual, expected, 'Missing expected exception' + message);
    }
  
    var userProvidedMessage = typeof message === 'string';
    var isUnwantedException = !shouldThrow && util.isError(actual);
    var isUnexpectedException = !shouldThrow && actual && !expected;
  
    if ((isUnwantedException &&
        userProvidedMessage &&
        expectedException(actual, expected)) ||
        isUnexpectedException) {
      fail(actual, expected, 'Got unwanted exception' + message);
    }
  
    if ((shouldThrow && actual && expected &&
        !expectedException(actual, expected)) || (!shouldThrow && actual)) {
      throw actual;
    }
  }
  
  // 11. Expected to throw an error:
  // assert.throws(block, Error_opt, message_opt);
  
  assert.throws = function(block, /*optional*/error, /*optional*/message) {
    _throws(true, block, error, message);
  };
  
  // EXTENSION! This is annoying to write outside this module.
  assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
    _throws(false, block, error, message);
  };
  
  assert.ifError = function(err) { if (err) throw err; };
  
  // Expose a strict only variant of assert
  function strict(value, message) {
    if (!value) fail(value, true, message, '==', strict);
  }
  assert.strict = objectAssign(strict, assert, {
    equal: assert.strictEqual,
    deepEqual: assert.deepStrictEqual,
    notEqual: assert.notStrictEqual,
    notDeepEqual: assert.notDeepStrictEqual
  });
  assert.strict.strict = assert.strict;
  
  var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
      if (hasOwn.call(obj, key)) keys.push(key);
    }
    return keys;
  };
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"object-assign":44,"util/":17}],15:[function(require,module,exports){
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
  
  },{}],16:[function(require,module,exports){
  module.exports = function isBuffer(arg) {
    return arg && typeof arg === 'object'
      && typeof arg.copy === 'function'
      && typeof arg.fill === 'function'
      && typeof arg.readUInt8 === 'function';
  }
  },{}],17:[function(require,module,exports){
  (function (process,global){(function (){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  var formatRegExp = /%[sdj%]/g;
  exports.format = function(f) {
    if (!isString(f)) {
      var objects = [];
      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }
      return objects.join(' ');
    }
  
    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
        default:
          return x;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }
    return str;
  };
  
  
  // Mark that a method should not be used.
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.
  exports.deprecate = function(fn, msg) {
    // Allow for deprecating things in the process of starting up.
    if (isUndefined(global.process)) {
      return function() {
        return exports.deprecate(fn, msg).apply(this, arguments);
      };
    }
  
    if (process.noDeprecation === true) {
      return fn;
    }
  
    var warned = false;
    function deprecated() {
      if (!warned) {
        if (process.throwDeprecation) {
          throw new Error(msg);
        } else if (process.traceDeprecation) {
          console.trace(msg);
        } else {
          console.error(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }
  
    return deprecated;
  };
  
  
  var debugs = {};
  var debugEnviron;
  exports.debuglog = function(set) {
    if (isUndefined(debugEnviron))
      debugEnviron = process.env.NODE_DEBUG || '';
    set = set.toUpperCase();
    if (!debugs[set]) {
      if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
        var pid = process.pid;
        debugs[set] = function() {
          var msg = exports.format.apply(exports, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function() {};
      }
    }
    return debugs[set];
  };
  
  
  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */
  /* legacy: obj, showHidden, depth, colors*/
  function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      exports._extend(ctx, opts);
    }
    // set default options
    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }
  exports.inspect = inspect;
  
  
  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  inspect.colors = {
    'bold' : [1, 22],
    'italic' : [3, 23],
    'underline' : [4, 24],
    'inverse' : [7, 27],
    'white' : [37, 39],
    'grey' : [90, 39],
    'black' : [30, 39],
    'blue' : [34, 39],
    'cyan' : [36, 39],
    'green' : [32, 39],
    'magenta' : [35, 39],
    'red' : [31, 39],
    'yellow' : [33, 39]
  };
  
  // Don't use 'blue' not visible on cmd.exe
  inspect.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  };
  
  
  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];
  
    if (style) {
      return '\u001b[' + inspect.colors[style][0] + 'm' + str +
             '\u001b[' + inspect.colors[style][1] + 'm';
    } else {
      return str;
    }
  }
  
  
  function stylizeNoColor(str, styleType) {
    return str;
  }
  
  
  function arrayToHash(array) {
    var hash = {};
  
    array.forEach(function(val, idx) {
      hash[val] = true;
    });
  
    return hash;
  }
  
  
  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }
  
    // Primitive types cannot have properties
    var primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
  
    // Look up the keys of the object.
    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);
  
    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    }
  
    // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
    if (isError(value)
        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    }
  
    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }
      if (isError(value)) {
        return formatError(value);
      }
    }
  
    var base = '', array = false, braces = ['{', '}'];
  
    // Make Array say that they are Array
    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    }
  
    // Make functions say that they are functions
    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    }
  
    // Make RegExps say that they are RegExps
    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    }
  
    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    }
  
    // Make error with message first say the error
    if (isError(value)) {
      base = ' ' + formatError(value);
    }
  
    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }
  
    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }
  
    ctx.seen.push(value);
  
    var output;
    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }
  
    ctx.seen.pop();
  
    return reduceToSingleString(output, base, braces);
  }
  
  
  function formatPrimitive(ctx, value) {
    if (isUndefined(value))
      return ctx.stylize('undefined', 'undefined');
    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }
    if (isNumber(value))
      return ctx.stylize('' + value, 'number');
    if (isBoolean(value))
      return ctx.stylize('' + value, 'boolean');
    // For some reason typeof null is "object", so special case here.
    if (isNull(value))
      return ctx.stylize('null', 'null');
  }
  
  
  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }
  
  
  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            String(i), true));
      } else {
        output.push('');
      }
    }
    keys.forEach(function(key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            key, true));
      }
    });
    return output;
  }
  
  
  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function(line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function(line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify('' + key);
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'")
                   .replace(/\\"/g, '"')
                   .replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }
  
    return name + ': ' + str;
  }
  
  
  function reduceToSingleString(output, base, braces) {
    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
  
    if (length > 60) {
      return braces[0] +
             (base === '' ? '' : base + '\n ') +
             ' ' +
             output.join(',\n  ') +
             ' ' +
             braces[1];
    }
  
    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  }
  
  
  // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.
  function isArray(ar) {
    return Array.isArray(ar);
  }
  exports.isArray = isArray;
  
  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }
  exports.isBoolean = isBoolean;
  
  function isNull(arg) {
    return arg === null;
  }
  exports.isNull = isNull;
  
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports.isNullOrUndefined = isNullOrUndefined;
  
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  exports.isNumber = isNumber;
  
  function isString(arg) {
    return typeof arg === 'string';
  }
  exports.isString = isString;
  
  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }
  exports.isSymbol = isSymbol;
  
  function isUndefined(arg) {
    return arg === void 0;
  }
  exports.isUndefined = isUndefined;
  
  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }
  exports.isRegExp = isRegExp;
  
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  exports.isObject = isObject;
  
  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }
  exports.isDate = isDate;
  
  function isError(e) {
    return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error);
  }
  exports.isError = isError;
  
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  exports.isFunction = isFunction;
  
  function isPrimitive(arg) {
    return arg === null ||
           typeof arg === 'boolean' ||
           typeof arg === 'number' ||
           typeof arg === 'string' ||
           typeof arg === 'symbol' ||  // ES6 symbol
           typeof arg === 'undefined';
  }
  exports.isPrimitive = isPrimitive;
  
  exports.isBuffer = require('./support/isBuffer');
  
  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }
  
  
  function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
  }
  
  
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];
  
  // 26 Feb 16:19:34
  function timestamp() {
    var d = new Date();
    var time = [pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds())].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  }
  
  
  // log is just a thin wrapper to console.log that prepends a timestamp
  exports.log = function() {
    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
  };
  
  
  /**
   * Inherit the prototype methods from one constructor into another.
   *
   * The Function.prototype.inherits from lang.js rewritten as a standalone
   * function (not on Function.prototype). NOTE: If this file is to be loaded
   * during bootstrapping this function needs to be rewritten using some native
   * functions as prototype setup using normal JavaScript does not work as
   * expected during bootstrapping (see mirror.js in r114903).
   *
   * @param {function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {function} superCtor Constructor function to inherit prototype from.
   */
  exports.inherits = require('inherits');
  
  exports._extend = function(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;
  
    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  };
  
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  
  }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"./support/isBuffer":16,"_process":46,"inherits":15}],18:[function(require,module,exports){
  (function (global){(function (){
  'use strict';
  
  var possibleNames = [
    'BigInt64Array',
    'BigUint64Array',
    'Float32Array',
    'Float64Array',
    'Int16Array',
    'Int32Array',
    'Int8Array',
    'Uint16Array',
    'Uint32Array',
    'Uint8Array',
    'Uint8ClampedArray'
  ];
  
  var g = typeof globalThis === 'undefined' ? global : globalThis;
  
  module.exports = function availableTypedArrays() {
    var out = [];
    for (var i = 0; i < possibleNames.length; i++) {
      if (typeof g[possibleNames[i]] === 'function') {
        out[out.length] = possibleNames[i];
      }
    }
    return out;
  };
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}],19:[function(require,module,exports){
  'use strict'
  
  exports.byteLength = byteLength
  exports.toByteArray = toByteArray
  exports.fromByteArray = fromByteArray
  
  var lookup = []
  var revLookup = []
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
  
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }
  
  // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications
  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
  
  function getLens (b64) {
    var len = b64.length
  
    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }
  
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=')
    if (validLen === -1) validLen = len
  
    var placeHoldersLen = validLen === len
      ? 0
      : 4 - (validLen % 4)
  
    return [validLen, placeHoldersLen]
  }
  
  // base64 is 4/3 + up to two characters of the original data
  function byteLength (b64) {
    var lens = getLens(b64)
    var validLen = lens[0]
    var placeHoldersLen = lens[1]
    return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
  }
  
  function _byteLength (b64, validLen, placeHoldersLen) {
    return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
  }
  
  function toByteArray (b64) {
    var tmp
    var lens = getLens(b64)
    var validLen = lens[0]
    var placeHoldersLen = lens[1]
  
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
  
    var curByte = 0
  
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0
      ? validLen - 4
      : validLen
  
    var i
    for (i = 0; i < len; i += 4) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)]
      arr[curByte++] = (tmp >> 16) & 0xFF
      arr[curByte++] = (tmp >> 8) & 0xFF
      arr[curByte++] = tmp & 0xFF
    }
  
    if (placeHoldersLen === 2) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 2) |
        (revLookup[b64.charCodeAt(i + 1)] >> 4)
      arr[curByte++] = tmp & 0xFF
    }
  
    if (placeHoldersLen === 1) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2)
      arr[curByte++] = (tmp >> 8) & 0xFF
      arr[curByte++] = tmp & 0xFF
    }
  
    return arr
  }
  
  function tripletToBase64 (num) {
    return lookup[num >> 18 & 0x3F] +
      lookup[num >> 12 & 0x3F] +
      lookup[num >> 6 & 0x3F] +
      lookup[num & 0x3F]
  }
  
  function encodeChunk (uint8, start, end) {
    var tmp
    var output = []
    for (var i = start; i < end; i += 3) {
      tmp =
        ((uint8[i] << 16) & 0xFF0000) +
        ((uint8[i + 1] << 8) & 0xFF00) +
        (uint8[i + 2] & 0xFF)
      output.push(tripletToBase64(tmp))
    }
    return output.join('')
  }
  
  function fromByteArray (uint8) {
    var tmp
    var len = uint8.length
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    var parts = []
    var maxChunkLength = 16383 // must be multiple of 3
  
    // go through the array every three bytes, we'll deal with trailing stuff later
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
    }
  
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1]
      parts.push(
        lookup[tmp >> 2] +
        lookup[(tmp << 4) & 0x3F] +
        '=='
      )
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1]
      parts.push(
        lookup[tmp >> 10] +
        lookup[(tmp >> 4) & 0x3F] +
        lookup[(tmp << 2) & 0x3F] +
        '='
      )
    }
  
    return parts.join('')
  }
  
  },{}],20:[function(require,module,exports){
  
  },{}],21:[function(require,module,exports){
  arguments[4][20][0].apply(exports,arguments)
  },{"dup":20}],22:[function(require,module,exports){
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  /* eslint-disable node/no-deprecated-api */
  var buffer = require('buffer')
  var Buffer = buffer.Buffer
  
  // alternative to using Object.keys for old browsers
  function copyProps (src, dst) {
    for (var key in src) {
      dst[key] = src[key]
    }
  }
  if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer
  } else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports)
    exports.Buffer = SafeBuffer
  }
  
  function SafeBuffer (arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length)
  }
  
  SafeBuffer.prototype = Object.create(Buffer.prototype)
  
  // Copy static methods from Buffer
  copyProps(Buffer, SafeBuffer)
  
  SafeBuffer.from = function (arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
      throw new TypeError('Argument must not be a number')
    }
    return Buffer(arg, encodingOrOffset, length)
  }
  
  SafeBuffer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    var buf = Buffer(size)
    if (fill !== undefined) {
      if (typeof encoding === 'string') {
        buf.fill(fill, encoding)
      } else {
        buf.fill(fill)
      }
    } else {
      buf.fill(0)
    }
    return buf
  }
  
  SafeBuffer.allocUnsafe = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    return Buffer(size)
  }
  
  SafeBuffer.allocUnsafeSlow = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    return buffer.SlowBuffer(size)
  }
  
  },{"buffer":24}],23:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  /*<replacement>*/
  
  var Buffer = require('safe-buffer').Buffer;
  /*</replacement>*/
  
  var isEncoding = Buffer.isEncoding || function (encoding) {
    encoding = '' + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
        return true;
      default:
        return false;
    }
  };
  
  function _normalizeEncoding(enc) {
    if (!enc) return 'utf8';
    var retried;
    while (true) {
      switch (enc) {
        case 'utf8':
        case 'utf-8':
          return 'utf8';
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return 'utf16le';
        case 'latin1':
        case 'binary':
          return 'latin1';
        case 'base64':
        case 'ascii':
        case 'hex':
          return enc;
        default:
          if (retried) return; // undefined
          enc = ('' + enc).toLowerCase();
          retried = true;
      }
    }
  };
  
  // Do not cache `Buffer.isEncoding` when checking encoding names as some
  // modules monkey-patch it to support additional encodings
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
    return nenc || enc;
  }
  
  // StringDecoder provides an interface for efficiently splitting a series of
  // buffers into a series of JS strings without breaking apart multi-byte
  // characters.
  exports.StringDecoder = StringDecoder;
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case 'utf16le':
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case 'utf8':
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case 'base64':
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
  }
  
  StringDecoder.prototype.write = function (buf) {
    if (buf.length === 0) return '';
    var r;
    var i;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === undefined) return '';
      i = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || '';
  };
  
  StringDecoder.prototype.end = utf8End;
  
  // Returns only complete characters in a Buffer
  StringDecoder.prototype.text = utf8Text;
  
  // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
  StringDecoder.prototype.fillLast = function (buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  
  // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
  // continuation byte. If an invalid byte is detected, -2 is returned.
  function utf8CheckByte(byte) {
    if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
  }
  
  // Checks at most 3 bytes at the end of a Buffer in order to detect an
  // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
  // needed to complete the UTF-8 character (if applicable) are returned.
  function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) self.lastNeed = nb - 1;
      return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) self.lastNeed = nb - 2;
      return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  }
  
  // Validates as many continuation bytes for a multi-byte UTF-8 character as
  // needed or are available. If we see a non-continuation byte where we expect
  // one, we "replace" the validated continuation bytes we've seen so far with
  // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
  // behavior. The continuation byte check is included three times in the case
  // where all of the continuation bytes for a character exist in the same buffer.
  // It is also done this way as a slight performance increase instead of using a
  // loop.
  function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xC0) !== 0x80) {
      self.lastNeed = 0;
      return '\ufffd';
    }
    if (self.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 0xC0) !== 0x80) {
        self.lastNeed = 1;
        return '\ufffd';
      }
      if (self.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 0xC0) !== 0x80) {
          self.lastNeed = 2;
          return '\ufffd';
        }
      }
    }
  }
  
  // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  }
  
  // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
  // partial character, the character's bytes are buffered until the required
  // number of bytes are available.
  function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString('utf8', i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString('utf8', i, end);
  }
  
  // For UTF-8, a replacement character is added when ending on a partial
  // character.
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + '\ufffd';
    return r;
  }
  
  // UTF-16LE typically needs two bytes per character, but even if we have an even
  // number of bytes available, we need to check if we end on a leading/high
  // surrogate. In that case, we need to wait for the next two bytes in order to
  // decode the last character properly.
  function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString('utf16le', i);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 0xD800 && c <= 0xDBFF) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString('utf16le', i, buf.length - 1);
  }
  
  // For UTF-16LE we do not explicitly append special replacement characters if we
  // end on a partial character, we simply let v8 handle that.
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString('utf16le', 0, end);
    }
    return r;
  }
  
  function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString('base64', i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString('base64', i, buf.length - n);
  }
  
  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
    return r;
  }
  
  // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
  function simpleWrite(buf) {
    return buf.toString(this.encoding);
  }
  
  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : '';
  }
  },{"safe-buffer":22}],24:[function(require,module,exports){
  (function (Buffer){(function (){
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */
  
  'use strict'
  
  var base64 = require('base64-js')
  var ieee754 = require('ieee754')
  
  exports.Buffer = Buffer
  exports.SlowBuffer = SlowBuffer
  exports.INSPECT_MAX_BYTES = 50
  
  var K_MAX_LENGTH = 0x7fffffff
  exports.kMaxLength = K_MAX_LENGTH
  
  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Print warning and recommend using `buffer` v4.x which has an Object
   *               implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * We report that the browser does not support typed arrays if the are not subclassable
   * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
   * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
   * for __proto__ and has a buggy typed array implementation.
   */
  Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()
  
  if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
      typeof console.error === 'function') {
    console.error(
      'This browser lacks typed array (Uint8Array) support which is required by ' +
      '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
    )
  }
  
  function typedArraySupport () {
    // Can typed array instances can be augmented?
    try {
      var arr = new Uint8Array(1)
      arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
      return arr.foo() === 42
    } catch (e) {
      return false
    }
  }
  
  Object.defineProperty(Buffer.prototype, 'parent', {
    enumerable: true,
    get: function () {
      if (!Buffer.isBuffer(this)) return undefined
      return this.buffer
    }
  })
  
  Object.defineProperty(Buffer.prototype, 'offset', {
    enumerable: true,
    get: function () {
      if (!Buffer.isBuffer(this)) return undefined
      return this.byteOffset
    }
  })
  
  function createBuffer (length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"')
    }
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length)
    buf.__proto__ = Buffer.prototype
    return buf
  }
  
  /**
   * The Buffer constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */
  
  function Buffer (arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        )
      }
      return allocUnsafe(arg)
    }
    return from(arg, encodingOrOffset, length)
  }
  
  // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
  if (typeof Symbol !== 'undefined' && Symbol.species != null &&
      Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true,
      enumerable: false,
      writable: false
    })
  }
  
  Buffer.poolSize = 8192 // not used by this implementation
  
  function from (value, encodingOrOffset, length) {
    if (typeof value === 'string') {
      return fromString(value, encodingOrOffset)
    }
  
    if (ArrayBuffer.isView(value)) {
      return fromArrayLike(value)
    }
  
    if (value == null) {
      throw TypeError(
        'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
        'or Array-like Object. Received type ' + (typeof value)
      )
    }
  
    if (isInstance(value, ArrayBuffer) ||
        (value && isInstance(value.buffer, ArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length)
    }
  
    if (typeof value === 'number') {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      )
    }
  
    var valueOf = value.valueOf && value.valueOf()
    if (valueOf != null && valueOf !== value) {
      return Buffer.from(valueOf, encodingOrOffset, length)
    }
  
    var b = fromObject(value)
    if (b) return b
  
    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
        typeof value[Symbol.toPrimitive] === 'function') {
      return Buffer.from(
        value[Symbol.toPrimitive]('string'), encodingOrOffset, length
      )
    }
  
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }
  
  /**
   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
   * if value is a number.
   * Buffer.from(str[, encoding])
   * Buffer.from(array)
   * Buffer.from(buffer)
   * Buffer.from(arrayBuffer[, byteOffset[, length]])
   **/
  Buffer.from = function (value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length)
  }
  
  // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
  // https://github.com/feross/buffer/pull/148
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  
  function assertSize (size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be of type number')
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
  }
  
  function alloc (size, fill, encoding) {
    assertSize(size)
    if (size <= 0) {
      return createBuffer(size)
    }
    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpretted as a start offset.
      return typeof encoding === 'string'
        ? createBuffer(size).fill(fill, encoding)
        : createBuffer(size).fill(fill)
    }
    return createBuffer(size)
  }
  
  /**
   * Creates a new filled Buffer instance.
   * alloc(size[, fill[, encoding]])
   **/
  Buffer.alloc = function (size, fill, encoding) {
    return alloc(size, fill, encoding)
  }
  
  function allocUnsafe (size) {
    assertSize(size)
    return createBuffer(size < 0 ? 0 : checked(size) | 0)
  }
  
  /**
   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
   * */
  Buffer.allocUnsafe = function (size) {
    return allocUnsafe(size)
  }
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
   */
  Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(size)
  }
  
  function fromString (string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8'
    }
  
    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  
    var length = byteLength(string, encoding) | 0
    var buf = createBuffer(length)
  
    var actual = buf.write(string, encoding)
  
    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      buf = buf.slice(0, actual)
    }
  
    return buf
  }
  
  function fromArrayLike (array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0
    var buf = createBuffer(length)
    for (var i = 0; i < length; i += 1) {
      buf[i] = array[i] & 255
    }
    return buf
  }
  
  function fromArrayBuffer (array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds')
    }
  
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds')
    }
  
    var buf
    if (byteOffset === undefined && length === undefined) {
      buf = new Uint8Array(array)
    } else if (length === undefined) {
      buf = new Uint8Array(array, byteOffset)
    } else {
      buf = new Uint8Array(array, byteOffset, length)
    }
  
    // Return an augmented `Uint8Array` instance
    buf.__proto__ = Buffer.prototype
    return buf
  }
  
  function fromObject (obj) {
    if (Buffer.isBuffer(obj)) {
      var len = checked(obj.length) | 0
      var buf = createBuffer(len)
  
      if (buf.length === 0) {
        return buf
      }
  
      obj.copy(buf, 0, 0, len)
      return buf
    }
  
    if (obj.length !== undefined) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }
  
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }
  
  function checked (length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                           'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
    }
    return length | 0
  }
  
  function SlowBuffer (length) {
    if (+length != length) { // eslint-disable-line eqeqeq
      length = 0
    }
    return Buffer.alloc(+length)
  }
  
  Buffer.isBuffer = function isBuffer (b) {
    return b != null && b._isBuffer === true &&
      b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
  }
  
  Buffer.compare = function compare (a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      )
    }
  
    if (a === b) return 0
  
    var x = a.length
    var y = b.length
  
    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i]
        y = b[i]
        break
      }
    }
  
    if (x < y) return -1
    if (y < x) return 1
    return 0
  }
  
  Buffer.isEncoding = function isEncoding (encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true
      default:
        return false
    }
  }
  
  Buffer.concat = function concat (list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
  
    if (list.length === 0) {
      return Buffer.alloc(0)
    }
  
    var i
    if (length === undefined) {
      length = 0
      for (i = 0; i < list.length; ++i) {
        length += list[i].length
      }
    }
  
    var buffer = Buffer.allocUnsafe(length)
    var pos = 0
    for (i = 0; i < list.length; ++i) {
      var buf = list[i]
      if (isInstance(buf, Uint8Array)) {
        buf = Buffer.from(buf)
      }
      if (!Buffer.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }
      buf.copy(buffer, pos)
      pos += buf.length
    }
    return buffer
  }
  
  function byteLength (string, encoding) {
    if (Buffer.isBuffer(string)) {
      return string.length
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength
    }
    if (typeof string !== 'string') {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
        'Received type ' + typeof string
      )
    }
  
    var len = string.length
    var mustMatch = (arguments.length > 2 && arguments[2] === true)
    if (!mustMatch && len === 0) return 0
  
    // Use a for loop to avoid recursion
    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len
        case 'utf8':
        case 'utf-8':
          return utf8ToBytes(string).length
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2
        case 'hex':
          return len >>> 1
        case 'base64':
          return base64ToBytes(string).length
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
          }
          encoding = ('' + encoding).toLowerCase()
          loweredCase = true
      }
    }
  }
  Buffer.byteLength = byteLength
  
  function slowToString (encoding, start, end) {
    var loweredCase = false
  
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
  
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) {
      start = 0
    }
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) {
      return ''
    }
  
    if (end === undefined || end > this.length) {
      end = this.length
    }
  
    if (end <= 0) {
      return ''
    }
  
    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0
    start >>>= 0
  
    if (end <= start) {
      return ''
    }
  
    if (!encoding) encoding = 'utf8'
  
    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end)
  
        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end)
  
        case 'ascii':
          return asciiSlice(this, start, end)
  
        case 'latin1':
        case 'binary':
          return latin1Slice(this, start, end)
  
        case 'base64':
          return base64Slice(this, start, end)
  
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end)
  
        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = (encoding + '').toLowerCase()
          loweredCase = true
      }
    }
  }
  
  // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
  // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
  // reliably in a browserify context because there could be multiple different
  // copies of the 'buffer' package in use. This method works even for Buffer
  // instances that were created from another copy of the `buffer` package.
  // See: https://github.com/feross/buffer/issues/154
  Buffer.prototype._isBuffer = true
  
  function swap (b, n, m) {
    var i = b[n]
    b[n] = b[m]
    b[m] = i
  }
  
  Buffer.prototype.swap16 = function swap16 () {
    var len = this.length
    if (len % 2 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 16-bits')
    }
    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1)
    }
    return this
  }
  
  Buffer.prototype.swap32 = function swap32 () {
    var len = this.length
    if (len % 4 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 32-bits')
    }
    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3)
      swap(this, i + 1, i + 2)
    }
    return this
  }
  
  Buffer.prototype.swap64 = function swap64 () {
    var len = this.length
    if (len % 8 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 64-bits')
    }
    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7)
      swap(this, i + 1, i + 6)
      swap(this, i + 2, i + 5)
      swap(this, i + 3, i + 4)
    }
    return this
  }
  
  Buffer.prototype.toString = function toString () {
    var length = this.length
    if (length === 0) return ''
    if (arguments.length === 0) return utf8Slice(this, 0, length)
    return slowToString.apply(this, arguments)
  }
  
  Buffer.prototype.toLocaleString = Buffer.prototype.toString
  
  Buffer.prototype.equals = function equals (b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
    if (this === b) return true
    return Buffer.compare(this, b) === 0
  }
  
  Buffer.prototype.inspect = function inspect () {
    var str = ''
    var max = exports.INSPECT_MAX_BYTES
    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
    if (this.length > max) str += ' ... '
    return '<Buffer ' + str + '>'
  }
  
  Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer.from(target, target.offset, target.byteLength)
    }
    if (!Buffer.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. ' +
        'Received type ' + (typeof target)
      )
    }
  
    if (start === undefined) {
      start = 0
    }
    if (end === undefined) {
      end = target ? target.length : 0
    }
    if (thisStart === undefined) {
      thisStart = 0
    }
    if (thisEnd === undefined) {
      thisEnd = this.length
    }
  
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError('out of range index')
    }
  
    if (thisStart >= thisEnd && start >= end) {
      return 0
    }
    if (thisStart >= thisEnd) {
      return -1
    }
    if (start >= end) {
      return 1
    }
  
    start >>>= 0
    end >>>= 0
    thisStart >>>= 0
    thisEnd >>>= 0
  
    if (this === target) return 0
  
    var x = thisEnd - thisStart
    var y = end - start
    var len = Math.min(x, y)
  
    var thisCopy = this.slice(thisStart, thisEnd)
    var targetCopy = target.slice(start, end)
  
    for (var i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i]
        y = targetCopy[i]
        break
      }
    }
  
    if (x < y) return -1
    if (y < x) return 1
    return 0
  }
  
  // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Buffer to search
  // - val - a string, Buffer, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf
  function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1
  
    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
      encoding = byteOffset
      byteOffset = 0
    } else if (byteOffset > 0x7fffffff) {
      byteOffset = 0x7fffffff
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000
    }
    byteOffset = +byteOffset // Coerce to Number.
    if (numberIsNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : (buffer.length - 1)
    }
  
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset
    if (byteOffset >= buffer.length) {
      if (dir) return -1
      else byteOffset = buffer.length - 1
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0
      else return -1
    }
  
    // Normalize val
    if (typeof val === 'string') {
      val = Buffer.from(val, encoding)
    }
  
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
    } else if (typeof val === 'number') {
      val = val & 0xFF // Search for a byte value [0-255]
      if (typeof Uint8Array.prototype.indexOf === 'function') {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
        }
      }
      return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
    }
  
    throw new TypeError('val must be string, number or Buffer')
  }
  
  function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
    var indexSize = 1
    var arrLength = arr.length
    var valLength = val.length
  
    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase()
      if (encoding === 'ucs2' || encoding === 'ucs-2' ||
          encoding === 'utf16le' || encoding === 'utf-16le') {
        if (arr.length < 2 || val.length < 2) {
          return -1
        }
        indexSize = 2
        arrLength /= 2
        valLength /= 2
        byteOffset /= 2
      }
    }
  
    function read (buf, i) {
      if (indexSize === 1) {
        return buf[i]
      } else {
        return buf.readUInt16BE(i * indexSize)
      }
    }
  
    var i
    if (dir) {
      var foundIndex = -1
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
        } else {
          if (foundIndex !== -1) i -= i - foundIndex
          foundIndex = -1
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
      for (i = byteOffset; i >= 0; i--) {
        var found = true
        for (var j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false
            break
          }
        }
        if (found) return i
      }
    }
  
    return -1
  }
  
  Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1
  }
  
  Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
  }
  
  Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
  }
  
  function hexWrite (buf, string, offset, length) {
    offset = Number(offset) || 0
    var remaining = buf.length - offset
    if (!length) {
      length = remaining
    } else {
      length = Number(length)
      if (length > remaining) {
        length = remaining
      }
    }
  
    var strLen = string.length
  
    if (length > strLen / 2) {
      length = strLen / 2
    }
    for (var i = 0; i < length; ++i) {
      var parsed = parseInt(string.substr(i * 2, 2), 16)
      if (numberIsNaN(parsed)) return i
      buf[offset + i] = parsed
    }
    return i
  }
  
  function utf8Write (buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  }
  
  function asciiWrite (buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length)
  }
  
  function latin1Write (buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length)
  }
  
  function base64Write (buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length)
  }
  
  function ucs2Write (buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  }
  
  Buffer.prototype.write = function write (string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8'
      length = this.length
      offset = 0
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset
      length = this.length
      offset = 0
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset >>> 0
      if (isFinite(length)) {
        length = length >>> 0
        if (encoding === undefined) encoding = 'utf8'
      } else {
        encoding = length
        length = undefined
      }
    } else {
      throw new Error(
        'Buffer.write(string, encoding, offset[, length]) is no longer supported'
      )
    }
  
    var remaining = this.length - offset
    if (length === undefined || length > remaining) length = remaining
  
    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
      throw new RangeError('Attempt to write outside buffer bounds')
    }
  
    if (!encoding) encoding = 'utf8'
  
    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length)
  
        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length)
  
        case 'ascii':
          return asciiWrite(this, string, offset, length)
  
        case 'latin1':
        case 'binary':
          return latin1Write(this, string, offset, length)
  
        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length)
  
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length)
  
        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = ('' + encoding).toLowerCase()
          loweredCase = true
      }
    }
  }
  
  Buffer.prototype.toJSON = function toJSON () {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  }
  
  function base64Slice (buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf)
    } else {
      return base64.fromByteArray(buf.slice(start, end))
    }
  }
  
  function utf8Slice (buf, start, end) {
    end = Math.min(buf.length, end)
    var res = []
  
    var i = start
    while (i < end) {
      var firstByte = buf[i]
      var codePoint = null
      var bytesPerSequence = (firstByte > 0xEF) ? 4
        : (firstByte > 0xDF) ? 3
          : (firstByte > 0xBF) ? 2
            : 1
  
      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint
  
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte
            }
            break
          case 2:
            secondByte = buf[i + 1]
            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint
              }
            }
            break
          case 3:
            secondByte = buf[i + 1]
            thirdByte = buf[i + 2]
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint
              }
            }
            break
          case 4:
            secondByte = buf[i + 1]
            thirdByte = buf[i + 2]
            fourthByte = buf[i + 3]
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint
              }
            }
        }
      }
  
      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD
        bytesPerSequence = 1
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000
        res.push(codePoint >>> 10 & 0x3FF | 0xD800)
        codePoint = 0xDC00 | codePoint & 0x3FF
      }
  
      res.push(codePoint)
      i += bytesPerSequence
    }
  
    return decodeCodePointsArray(res)
  }
  
  // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety
  var MAX_ARGUMENTS_LENGTH = 0x1000
  
  function decodeCodePointsArray (codePoints) {
    var len = codePoints.length
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    }
  
    // Decode in chunks to avoid "call stack size exceeded".
    var res = ''
    var i = 0
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      )
    }
    return res
  }
  
  function asciiSlice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)
  
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7F)
    }
    return ret
  }
  
  function latin1Slice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)
  
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i])
    }
    return ret
  }
  
  function hexSlice (buf, start, end) {
    var len = buf.length
  
    if (!start || start < 0) start = 0
    if (!end || end < 0 || end > len) end = len
  
    var out = ''
    for (var i = start; i < end; ++i) {
      out += toHex(buf[i])
    }
    return out
  }
  
  function utf16leSlice (buf, start, end) {
    var bytes = buf.slice(start, end)
    var res = ''
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
    }
    return res
  }
  
  Buffer.prototype.slice = function slice (start, end) {
    var len = this.length
    start = ~~start
    end = end === undefined ? len : ~~end
  
    if (start < 0) {
      start += len
      if (start < 0) start = 0
    } else if (start > len) {
      start = len
    }
  
    if (end < 0) {
      end += len
      if (end < 0) end = 0
    } else if (end > len) {
      end = len
    }
  
    if (end < start) end = start
  
    var newBuf = this.subarray(start, end)
    // Return an augmented `Uint8Array` instance
    newBuf.__proto__ = Buffer.prototype
    return newBuf
  }
  
  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  function checkOffset (offset, ext, length) {
    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
  }
  
  Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)
  
    var val = this[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul
    }
  
    return val
  }
  
  Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      checkOffset(offset, byteLength, this.length)
    }
  
    var val = this[offset + --byteLength]
    var mul = 1
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul
    }
  
    return val
  }
  
  Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 1, this.length)
    return this[offset]
  }
  
  Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    return this[offset] | (this[offset + 1] << 8)
  }
  
  Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    return (this[offset] << 8) | this[offset + 1]
  }
  
  Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return ((this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16)) +
        (this[offset + 3] * 0x1000000)
  }
  
  Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
  }
  
  Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)
  
    var val = this[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul
    }
    mul *= 0x80
  
    if (val >= mul) val -= Math.pow(2, 8 * byteLength)
  
    return val
  }
  
  Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)
  
    var i = byteLength
    var mul = 1
    var val = this[offset + --i]
    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul
    }
    mul *= 0x80
  
    if (val >= mul) val -= Math.pow(2, 8 * byteLength)
  
    return val
  }
  
  Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 1, this.length)
    if (!(this[offset] & 0x80)) return (this[offset])
    return ((0xff - this[offset] + 1) * -1)
  }
  
  Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset] | (this[offset + 1] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }
  
  Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset + 1] | (this[offset] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }
  
  Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
  }
  
  Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
  }
  
  Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, true, 23, 4)
  }
  
  Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, false, 23, 4)
  }
  
  Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, true, 52, 8)
  }
  
  Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, false, 52, 8)
  }
  
  function checkInt (buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
  }
  
  Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      checkInt(this, value, offset, byteLength, maxBytes, 0)
    }
  
    var mul = 1
    var i = 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      checkInt(this, value, offset, byteLength, maxBytes, 0)
    }
  
    var i = byteLength - 1
    var mul = 1
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
    this[offset] = (value & 0xff)
    return offset + 1
  }
  
  Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    return offset + 2
  }
  
  Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
    return offset + 2
  }
  
  Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
    return offset + 4
  }
  
  Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
    return offset + 4
  }
  
  Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      var limit = Math.pow(2, (8 * byteLength) - 1)
  
      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }
  
    var i = 0
    var mul = 1
    var sub = 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      var limit = Math.pow(2, (8 * byteLength) - 1)
  
      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }
  
    var i = byteLength - 1
    var mul = 1
    var sub = 0
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
    if (value < 0) value = 0xff + value + 1
    this[offset] = (value & 0xff)
    return offset + 1
  }
  
  Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    return offset + 2
  }
  
  Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
    return offset + 2
  }
  
  Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
    return offset + 4
  }
  
  Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    if (value < 0) value = 0xffffffff + value + 1
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
    return offset + 4
  }
  
  function checkIEEE754 (buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
    if (offset < 0) throw new RangeError('Index out of range')
  }
  
  function writeFloat (buf, value, offset, littleEndian, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4)
    return offset + 4
  }
  
  Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert)
  }
  
  Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert)
  }
  
  function writeDouble (buf, value, offset, littleEndian, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8)
    return offset + 8
  }
  
  Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert)
  }
  
  Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert)
  }
  
  // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Buffer.prototype.copy = function copy (target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
    if (!start) start = 0
    if (!end && end !== 0) end = this.length
    if (targetStart >= target.length) targetStart = target.length
    if (!targetStart) targetStart = 0
    if (end > 0 && end < start) end = start
  
    // Copy 0 bytes; we're done
    if (end === start) return 0
    if (target.length === 0 || this.length === 0) return 0
  
    // Fatal error conditions
    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
    if (end < 0) throw new RangeError('sourceEnd out of bounds')
  
    // Are we oob?
    if (end > this.length) end = this.length
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start
    }
  
    var len = end - start
  
    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
      // Use built-in when available, missing from IE11
      this.copyWithin(targetStart, start, end)
    } else if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (var i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start]
      }
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      )
    }
  
    return len
  }
  
  // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])
  Buffer.prototype.fill = function fill (val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start
        start = 0
        end = this.length
      } else if (typeof end === 'string') {
        encoding = end
        end = this.length
      }
      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string')
      }
      if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
      }
      if (val.length === 1) {
        var code = val.charCodeAt(0)
        if ((encoding === 'utf8' && code < 128) ||
            encoding === 'latin1') {
          // Fast path: If `val` fits into a single byte, use that numeric value.
          val = code
        }
      }
    } else if (typeof val === 'number') {
      val = val & 255
    }
  
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index')
    }
  
    if (end <= start) {
      return this
    }
  
    start = start >>> 0
    end = end === undefined ? this.length : end >>> 0
  
    if (!val) val = 0
  
    var i
    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val
      }
    } else {
      var bytes = Buffer.isBuffer(val)
        ? val
        : Buffer.from(val, encoding)
      var len = bytes.length
      if (len === 0) {
        throw new TypeError('The value "' + val +
          '" is invalid for argument "value"')
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len]
      }
    }
  
    return this
  }
  
  // HELPER FUNCTIONS
  // ================
  
  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g
  
  function base64clean (str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split('=')[0]
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, '')
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return ''
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '='
    }
    return str
  }
  
  function toHex (n) {
    if (n < 16) return '0' + n.toString(16)
    return n.toString(16)
  }
  
  function utf8ToBytes (string, units) {
    units = units || Infinity
    var codePoint
    var length = string.length
    var leadSurrogate = null
    var bytes = []
  
    for (var i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i)
  
      // is surrogate component
      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            continue
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            continue
          }
  
          // valid lead
          leadSurrogate = codePoint
  
          continue
        }
  
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        }
  
        // valid surrogate pair
        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      }
  
      leadSurrogate = null
  
      // encode utf8
      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break
        bytes.push(codePoint)
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break
        bytes.push(
          codePoint >> 0x6 | 0xC0,
          codePoint & 0x3F | 0x80
        )
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break
        bytes.push(
          codePoint >> 0xC | 0xE0,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        )
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break
        bytes.push(
          codePoint >> 0x12 | 0xF0,
          codePoint >> 0xC & 0x3F | 0x80,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        )
      } else {
        throw new Error('Invalid code point')
      }
    }
  
    return bytes
  }
  
  function asciiToBytes (str) {
    var byteArray = []
    for (var i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF)
    }
    return byteArray
  }
  
  function utf16leToBytes (str, units) {
    var c, hi, lo
    var byteArray = []
    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break
  
      c = str.charCodeAt(i)
      hi = c >> 8
      lo = c % 256
      byteArray.push(lo)
      byteArray.push(hi)
    }
  
    return byteArray
  }
  
  function base64ToBytes (str) {
    return base64.toByteArray(base64clean(str))
  }
  
  function blitBuffer (src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if ((i + offset >= dst.length) || (i >= src.length)) break
      dst[i + offset] = src[i]
    }
    return i
  }
  
  // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
  // the `instanceof` check but they should be treated as of that type.
  // See: https://github.com/feross/buffer/issues/166
  function isInstance (obj, type) {
    return obj instanceof type ||
      (obj != null && obj.constructor != null && obj.constructor.name != null &&
        obj.constructor.name === type.name)
  }
  function numberIsNaN (obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
  }
  
  }).call(this)}).call(this,require("buffer").Buffer)
  },{"base64-js":19,"buffer":24,"ieee754":39}],25:[function(require,module,exports){
  module.exports = {
    "100": "Continue",
    "101": "Switching Protocols",
    "102": "Processing",
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "203": "Non-Authoritative Information",
    "204": "No Content",
    "205": "Reset Content",
    "206": "Partial Content",
    "207": "Multi-Status",
    "208": "Already Reported",
    "226": "IM Used",
    "300": "Multiple Choices",
    "301": "Moved Permanently",
    "302": "Found",
    "303": "See Other",
    "304": "Not Modified",
    "305": "Use Proxy",
    "307": "Temporary Redirect",
    "308": "Permanent Redirect",
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Range Not Satisfiable",
    "417": "Expectation Failed",
    "418": "I'm a teapot",
    "421": "Misdirected Request",
    "422": "Unprocessable Entity",
    "423": "Locked",
    "424": "Failed Dependency",
    "425": "Unordered Collection",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "451": "Unavailable For Legal Reasons",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
    "505": "HTTP Version Not Supported",
    "506": "Variant Also Negotiates",
    "507": "Insufficient Storage",
    "508": "Loop Detected",
    "509": "Bandwidth Limit Exceeded",
    "510": "Not Extended",
    "511": "Network Authentication Required"
  }
  
  },{}],26:[function(require,module,exports){
  'use strict';
  
  var GetIntrinsic = require('get-intrinsic');
  
  var callBind = require('./');
  
  var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));
  
  module.exports = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = GetIntrinsic(name, !!allowMissing);
    if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
      return callBind(intrinsic);
    }
    return intrinsic;
  };
  
  },{"./":27,"get-intrinsic":33}],27:[function(require,module,exports){
  'use strict';
  
  var bind = require('function-bind');
  var GetIntrinsic = require('get-intrinsic');
  
  var $apply = GetIntrinsic('%Function.prototype.apply%');
  var $call = GetIntrinsic('%Function.prototype.call%');
  var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
  
  var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
  var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
  var $max = GetIntrinsic('%Math.max%');
  
  if ($defineProperty) {
    try {
      $defineProperty({}, 'a', { value: 1 });
    } catch (e) {
      // IE 8 has a broken defineProperty
      $defineProperty = null;
    }
  }
  
  module.exports = function callBind(originalFunction) {
    var func = $reflectApply(bind, $call, arguments);
    if ($gOPD && $defineProperty) {
      var desc = $gOPD(func, 'length');
      if (desc.configurable) {
        // original length, plus the receiver, minus any additional arguments (after the receiver)
        $defineProperty(
          func,
          'length',
          { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
        );
      }
    }
    return func;
  };
  
  var applyBind = function applyBind() {
    return $reflectApply(bind, $apply, arguments);
  };
  
  if ($defineProperty) {
    $defineProperty(module.exports, 'apply', { value: applyBind });
  } else {
    module.exports.apply = applyBind;
  }
  
  },{"function-bind":32,"get-intrinsic":33}],28:[function(require,module,exports){
  'use strict';
  
  var GetIntrinsic = require('get-intrinsic');
  
  var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
  if ($gOPD) {
    try {
      $gOPD([], 'length');
    } catch (e) {
      // IE 8 has a broken gOPD
      $gOPD = null;
    }
  }
  
  module.exports = $gOPD;
  
  },{"get-intrinsic":33}],29:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  var R = typeof Reflect === 'object' ? Reflect : null
  var ReflectApply = R && typeof R.apply === 'function'
    ? R.apply
    : function ReflectApply(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    }
  
  var ReflectOwnKeys
  if (R && typeof R.ownKeys === 'function') {
    ReflectOwnKeys = R.ownKeys
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
      return Object.getOwnPropertyNames(target)
        .concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  
  function ProcessEmitWarning(warning) {
    if (console && console.warn) console.warn(warning);
  }
  
  var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
    return value !== value;
  }
  
  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  module.exports = EventEmitter;
  module.exports.once = once;
  
  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;
  
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = undefined;
  
  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  var defaultMaxListeners = 10;
  
  function checkListener(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
      }
      defaultMaxListeners = arg;
    }
  });
  
  EventEmitter.init = function() {
  
    if (this._events === undefined ||
        this._events === Object.getPrototypeOf(this)._events) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    }
  
    this._maxListeners = this._maxListeners || undefined;
  };
  
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
    }
    this._maxListeners = n;
    return this;
  };
  
  function _getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }
  
  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  
  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var doError = (type === 'error');
  
    var events = this._events;
    if (events !== undefined)
      doError = (doError && events.error === undefined);
    else if (!doError)
      return false;
  
    // If there is no 'error' event listener then throw.
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        // Note: The comments on the `throw` lines are intentional, they show
        // up in Node's output if this results in an unhandled exception.
        throw er; // Unhandled 'error' event
      }
      // At least give some kind of context to the user
      var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
      err.context = er;
      throw err; // Unhandled 'error' event
    }
  
    var handler = events[type];
  
    if (handler === undefined)
      return false;
  
    if (typeof handler === 'function') {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
  
    return true;
  };
  
  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
  
    checkListener(listener);
  
    events = target._events;
    if (events === undefined) {
      events = target._events = Object.create(null);
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener !== undefined) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);
  
        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }
  
    if (existing === undefined) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
        // If we've already got an array, just append.
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
  
      // Check for listener leak
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        // No error code for this since it is a Warning
        // eslint-disable-next-line no-restricted-syntax
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + String(type) + ' listeners ' +
                            'added. Use emitter.setMaxListeners() to ' +
                            'increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
  
    return target;
  }
  
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };
  
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  
  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
  
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  
  function _onceWrap(target, type, listener) {
    var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }
  
  EventEmitter.prototype.once = function once(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };
  
  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
  
  // Emits a 'removeListener' event if and only if the listener was removed.
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;
  
        checkListener(listener);
  
        events = this._events;
        if (events === undefined)
          return this;
  
        list = events[type];
        if (list === undefined)
          return this;
  
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;
  
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
  
          if (position < 0)
            return this;
  
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
  
          if (list.length === 1)
            events[type] = list[0];
  
          if (events.removeListener !== undefined)
            this.emit('removeListener', type, originalListener || listener);
        }
  
        return this;
      };
  
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  
  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events, i;
  
        events = this._events;
        if (events === undefined)
          return this;
  
        // not listening for removeListener, no need to emit
        if (events.removeListener === undefined) {
          if (arguments.length === 0) {
            this._events = Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== undefined) {
            if (--this._eventsCount === 0)
              this._events = Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
  
        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = Object.create(null);
          this._eventsCount = 0;
          return this;
        }
  
        listeners = events[type];
  
        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners !== undefined) {
          // LIFO order
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
  
        return this;
      };
  
  function _listeners(target, type, unwrap) {
    var events = target._events;
  
    if (events === undefined)
      return [];
  
    var evlistener = events[type];
    if (evlistener === undefined)
      return [];
  
    if (typeof evlistener === 'function')
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  
    return unwrap ?
      unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  
  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };
  
  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };
  
  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };
  
  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;
  
    if (events !== undefined) {
      var evlistener = events[type];
  
      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener !== undefined) {
        return evlistener.length;
      }
    }
  
    return 0;
  }
  
  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  
  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }
  
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  
  function once(emitter, name) {
    return new Promise(function (resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
  
      function resolver() {
        if (typeof emitter.removeListener === 'function') {
          emitter.removeListener('error', errorListener);
        }
        resolve([].slice.call(arguments));
      };
  
      eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
      if (name !== 'error') {
        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
      }
    });
  }
  
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === 'function') {
      eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
    }
  }
  
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === 'function') {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === 'function') {
      // EventTarget does not have `error` event semantics like Node
      // EventEmitters, we do not listen for `error` events here.
      emitter.addEventListener(name, function wrapListener(arg) {
        // IE does not have builtin `{ once: true }` support so we
        // have to do it manually.
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  
  },{}],30:[function(require,module,exports){
  
  var hasOwn = Object.prototype.hasOwnProperty;
  var toString = Object.prototype.toString;
  
  module.exports = function forEach (obj, fn, ctx) {
      if (toString.call(fn) !== '[object Function]') {
          throw new TypeError('iterator must be a function');
      }
      var l = obj.length;
      if (l === +l) {
          for (var i = 0; i < l; i++) {
              fn.call(ctx, obj[i], i, obj);
          }
      } else {
          for (var k in obj) {
              if (hasOwn.call(obj, k)) {
                  fn.call(ctx, obj[k], k, obj);
              }
          }
      }
  };
  
  
  },{}],31:[function(require,module,exports){
  'use strict';
  
  /* eslint no-invalid-this: 1 */
  
  var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
  var slice = Array.prototype.slice;
  var toStr = Object.prototype.toString;
  var funcType = '[object Function]';
  
  module.exports = function bind(that) {
      var target = this;
      if (typeof target !== 'function' || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slice.call(arguments, 1);
  
      var bound;
      var binder = function () {
          if (this instanceof bound) {
              var result = target.apply(
                  this,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return this;
          } else {
              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );
          }
      };
  
      var boundLength = Math.max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
          boundArgs.push('$' + i);
      }
  
      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);
  
      if (target.prototype) {
          var Empty = function Empty() {};
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
      }
  
      return bound;
  };
  
  },{}],32:[function(require,module,exports){
  'use strict';
  
  var implementation = require('./implementation');
  
  module.exports = Function.prototype.bind || implementation;
  
  },{"./implementation":31}],33:[function(require,module,exports){
  'use strict';
  
  var undefined;
  
  var $SyntaxError = SyntaxError;
  var $Function = Function;
  var $TypeError = TypeError;
  
  // eslint-disable-next-line consistent-return
  var getEvalledConstructor = function (expressionSyntax) {
    try {
      return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
    } catch (e) {}
  };
  
  var $gOPD = Object.getOwnPropertyDescriptor;
  if ($gOPD) {
    try {
      $gOPD({}, '');
    } catch (e) {
      $gOPD = null; // this is IE 8, which has a broken gOPD
    }
  }
  
  var throwTypeError = function () {
    throw new $TypeError();
  };
  var ThrowTypeError = $gOPD
    ? (function () {
      try {
        // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
        arguments.callee; // IE 8 does not throw here
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
          return $gOPD(arguments, 'callee').get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }())
    : throwTypeError;
  
  var hasSymbols = require('has-symbols')();
  
  var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto
  
  var needsEval = {};
  
  var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);
  
  var INTRINSICS = {
    '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
    '%Array%': Array,
    '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
    '%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
    '%AsyncFromSyncIteratorPrototype%': undefined,
    '%AsyncFunction%': needsEval,
    '%AsyncGenerator%': needsEval,
    '%AsyncGeneratorFunction%': needsEval,
    '%AsyncIteratorPrototype%': needsEval,
    '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
    '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
    '%Boolean%': Boolean,
    '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
    '%Date%': Date,
    '%decodeURI%': decodeURI,
    '%decodeURIComponent%': decodeURIComponent,
    '%encodeURI%': encodeURI,
    '%encodeURIComponent%': encodeURIComponent,
    '%Error%': Error,
    '%eval%': eval, // eslint-disable-line no-eval
    '%EvalError%': EvalError,
    '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
    '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
    '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
    '%Function%': $Function,
    '%GeneratorFunction%': needsEval,
    '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
    '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
    '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
    '%isFinite%': isFinite,
    '%isNaN%': isNaN,
    '%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
    '%JSON%': typeof JSON === 'object' ? JSON : undefined,
    '%Map%': typeof Map === 'undefined' ? undefined : Map,
    '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
    '%Math%': Math,
    '%Number%': Number,
    '%Object%': Object,
    '%parseFloat%': parseFloat,
    '%parseInt%': parseInt,
    '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
    '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
    '%RangeError%': RangeError,
    '%ReferenceError%': ReferenceError,
    '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
    '%RegExp%': RegExp,
    '%Set%': typeof Set === 'undefined' ? undefined : Set,
    '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
    '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
    '%String%': String,
    '%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
    '%Symbol%': hasSymbols ? Symbol : undefined,
    '%SyntaxError%': $SyntaxError,
    '%ThrowTypeError%': ThrowTypeError,
    '%TypedArray%': TypedArray,
    '%TypeError%': $TypeError,
    '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
    '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
    '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
    '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
    '%URIError%': URIError,
    '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
    '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
    '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
  };
  
  var doEval = function doEval(name) {
    var value;
    if (name === '%AsyncFunction%') {
      value = getEvalledConstructor('async function () {}');
    } else if (name === '%GeneratorFunction%') {
      value = getEvalledConstructor('function* () {}');
    } else if (name === '%AsyncGeneratorFunction%') {
      value = getEvalledConstructor('async function* () {}');
    } else if (name === '%AsyncGenerator%') {
      var fn = doEval('%AsyncGeneratorFunction%');
      if (fn) {
        value = fn.prototype;
      }
    } else if (name === '%AsyncIteratorPrototype%') {
      var gen = doEval('%AsyncGenerator%');
      if (gen) {
        value = getProto(gen.prototype);
      }
    }
  
    INTRINSICS[name] = value;
  
    return value;
  };
  
  var LEGACY_ALIASES = {
    '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
    '%ArrayPrototype%': ['Array', 'prototype'],
    '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
    '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
    '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
    '%ArrayProto_values%': ['Array', 'prototype', 'values'],
    '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
    '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
    '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
    '%BooleanPrototype%': ['Boolean', 'prototype'],
    '%DataViewPrototype%': ['DataView', 'prototype'],
    '%DatePrototype%': ['Date', 'prototype'],
    '%ErrorPrototype%': ['Error', 'prototype'],
    '%EvalErrorPrototype%': ['EvalError', 'prototype'],
    '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
    '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
    '%FunctionPrototype%': ['Function', 'prototype'],
    '%Generator%': ['GeneratorFunction', 'prototype'],
    '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
    '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
    '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
    '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
    '%JSONParse%': ['JSON', 'parse'],
    '%JSONStringify%': ['JSON', 'stringify'],
    '%MapPrototype%': ['Map', 'prototype'],
    '%NumberPrototype%': ['Number', 'prototype'],
    '%ObjectPrototype%': ['Object', 'prototype'],
    '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
    '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
    '%PromisePrototype%': ['Promise', 'prototype'],
    '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
    '%Promise_all%': ['Promise', 'all'],
    '%Promise_reject%': ['Promise', 'reject'],
    '%Promise_resolve%': ['Promise', 'resolve'],
    '%RangeErrorPrototype%': ['RangeError', 'prototype'],
    '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
    '%RegExpPrototype%': ['RegExp', 'prototype'],
    '%SetPrototype%': ['Set', 'prototype'],
    '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
    '%StringPrototype%': ['String', 'prototype'],
    '%SymbolPrototype%': ['Symbol', 'prototype'],
    '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
    '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
    '%TypeErrorPrototype%': ['TypeError', 'prototype'],
    '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
    '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
    '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
    '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
    '%URIErrorPrototype%': ['URIError', 'prototype'],
    '%WeakMapPrototype%': ['WeakMap', 'prototype'],
    '%WeakSetPrototype%': ['WeakSet', 'prototype']
  };
  
  var bind = require('function-bind');
  var hasOwn = require('has');
  var $concat = bind.call(Function.call, Array.prototype.concat);
  var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
  var $replace = bind.call(Function.call, String.prototype.replace);
  var $strSlice = bind.call(Function.call, String.prototype.slice);
  
  /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
  var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
  var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
  var stringToPath = function stringToPath(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === '%' && last !== '%') {
      throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
    } else if (last === '%' && first !== '%') {
      throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
    }
    var result = [];
    $replace(string, rePropName, function (match, number, quote, subString) {
      result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
    });
    return result;
  };
  /* end adaptation */
  
  var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
      alias = LEGACY_ALIASES[intrinsicName];
      intrinsicName = '%' + alias[0] + '%';
    }
  
    if (hasOwn(INTRINSICS, intrinsicName)) {
      var value = INTRINSICS[intrinsicName];
      if (value === needsEval) {
        value = doEval(intrinsicName);
      }
      if (typeof value === 'undefined' && !allowMissing) {
        throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
      }
  
      return {
        alias: alias,
        name: intrinsicName,
        value: value
      };
    }
  
    throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
  };
  
  module.exports = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new $TypeError('intrinsic name must be a non-empty string');
    }
    if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
      throw new $TypeError('"allowMissing" argument must be a boolean');
    }
  
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  
    var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
  
    var alias = intrinsic.alias;
    if (alias) {
      intrinsicBaseName = alias[0];
      $spliceApply(parts, $concat([0, 1], alias));
    }
  
    for (var i = 1, isOwn = true; i < parts.length; i += 1) {
      var part = parts[i];
      var first = $strSlice(part, 0, 1);
      var last = $strSlice(part, -1);
      if (
        (
          (first === '"' || first === "'" || first === '`')
          || (last === '"' || last === "'" || last === '`')
        )
        && first !== last
      ) {
        throw new $SyntaxError('property names with quotes must have matching quotes');
      }
      if (part === 'constructor' || !isOwn) {
        skipFurtherCaching = true;
      }
  
      intrinsicBaseName += '.' + part;
      intrinsicRealName = '%' + intrinsicBaseName + '%';
  
      if (hasOwn(INTRINSICS, intrinsicRealName)) {
        value = INTRINSICS[intrinsicRealName];
      } else if (value != null) {
        if (!(part in value)) {
          if (!allowMissing) {
            throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
          }
          return void undefined;
        }
        if ($gOPD && (i + 1) >= parts.length) {
          var desc = $gOPD(value, part);
          isOwn = !!desc;
  
          // By convention, when a data property is converted to an accessor
          // property to emulate a data property that does not suffer from
          // the override mistake, that accessor's getter is marked with
          // an `originalValue` property. Here, when we detect this, we
          // uphold the illusion by pretending to see that original data
          // property, i.e., returning the value rather than the getter
          // itself.
          if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
            value = desc.get;
          } else {
            value = value[part];
          }
        } else {
          isOwn = hasOwn(value, part);
          value = value[part];
        }
  
        if (isOwn && !skipFurtherCaching) {
          INTRINSICS[intrinsicRealName] = value;
        }
      }
    }
    return value;
  };
  
  },{"function-bind":32,"has":37,"has-symbols":34}],34:[function(require,module,exports){
  'use strict';
  
  var origSymbol = typeof Symbol !== 'undefined' && Symbol;
  var hasSymbolSham = require('./shams');
  
  module.exports = function hasNativeSymbols() {
    if (typeof origSymbol !== 'function') { return false; }
    if (typeof Symbol !== 'function') { return false; }
    if (typeof origSymbol('foo') !== 'symbol') { return false; }
    if (typeof Symbol('bar') !== 'symbol') { return false; }
  
    return hasSymbolSham();
  };
  
  },{"./shams":35}],35:[function(require,module,exports){
  'use strict';
  
  /* eslint complexity: [2, 18], max-statements: [2, 33] */
  module.exports = function hasSymbols() {
    if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
    if (typeof Symbol.iterator === 'symbol') { return true; }
  
    var obj = {};
    var sym = Symbol('test');
    var symObj = Object(sym);
    if (typeof sym === 'string') { return false; }
  
    if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
    if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }
  
    // temp disabled per https://github.com/ljharb/object.assign/issues/17
    // if (sym instanceof Symbol) { return false; }
    // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
    // if (!(symObj instanceof Symbol)) { return false; }
  
    // if (typeof Symbol.prototype.toString !== 'function') { return false; }
    // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }
  
    var symVal = 42;
    obj[sym] = symVal;
    for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
    if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }
  
    if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }
  
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) { return false; }
  
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }
  
    if (typeof Object.getOwnPropertyDescriptor === 'function') {
      var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
      if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
    }
  
    return true;
  };
  
  },{}],36:[function(require,module,exports){
  'use strict';
  
  var hasSymbols = require('has-symbols/shams');
  
  module.exports = function hasToStringTagShams() {
    return hasSymbols() && !!Symbol.toStringTag;
  };
  
  },{"has-symbols/shams":35}],37:[function(require,module,exports){
  'use strict';
  
  var bind = require('function-bind');
  
  module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
  
  },{"function-bind":32}],38:[function(require,module,exports){
  var http = require('http')
  var url = require('url')
  
  var https = module.exports
  
  for (var key in http) {
    if (http.hasOwnProperty(key)) https[key] = http[key]
  }
  
  https.request = function (params, cb) {
    params = validateParams(params)
    return http.request.call(this, params, cb)
  }
  
  https.get = function (params, cb) {
    params = validateParams(params)
    return http.get.call(this, params, cb)
  }
  
  function validateParams (params) {
    if (typeof params === 'string') {
      params = url.parse(params)
    }
    if (!params.protocol) {
      params.protocol = 'https:'
    }
    if (params.protocol !== 'https:') {
      throw new Error('Protocol "' + params.protocol + '" not supported. Expected "https:"')
    }
    return params
  }
  
  },{"http":68,"url":89}],39:[function(require,module,exports){
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  exports.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m
    var eLen = (nBytes * 8) - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var nBits = -7
    var i = isLE ? (nBytes - 1) : 0
    var d = isLE ? -1 : 1
    var s = buffer[offset + i]
  
    i += d
  
    e = s & ((1 << (-nBits)) - 1)
    s >>= (-nBits)
    nBits += eLen
    for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}
  
    m = e & ((1 << (-nBits)) - 1)
    e >>= (-nBits)
    nBits += mLen
    for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}
  
    if (e === 0) {
      e = 1 - eBias
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
      m = m + Math.pow(2, mLen)
      e = e - eBias
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
  }
  
  exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c
    var eLen = (nBytes * 8) - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
    var i = isLE ? 0 : (nBytes - 1)
    var d = isLE ? 1 : -1
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
  
    value = Math.abs(value)
  
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0
      e = eMax
    } else {
      e = Math.floor(Math.log(value) / Math.LN2)
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--
        c *= 2
      }
      if (e + eBias >= 1) {
        value += rt / c
      } else {
        value += rt * Math.pow(2, 1 - eBias)
      }
      if (value * c >= 2) {
        e++
        c /= 2
      }
  
      if (e + eBias >= eMax) {
        m = 0
        e = eMax
      } else if (e + eBias >= 1) {
        m = ((value * c) - 1) * Math.pow(2, mLen)
        e = e + eBias
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
        e = 0
      }
    }
  
    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
  
    e = (e << mLen) | m
    eLen += mLen
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
  
    buffer[offset + i - d] |= s * 128
  }
  
  },{}],40:[function(require,module,exports){
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        })
      }
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }
  }
  
  },{}],41:[function(require,module,exports){
  'use strict';
  
  var hasToStringTag = require('has-tostringtag/shams')();
  var callBound = require('call-bind/callBound');
  
  var $toString = callBound('Object.prototype.toString');
  
  var isStandardArguments = function isArguments(value) {
    if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
      return false;
    }
    return $toString(value) === '[object Arguments]';
  };
  
  var isLegacyArguments = function isArguments(value) {
    if (isStandardArguments(value)) {
      return true;
    }
    return value !== null &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      $toString(value) !== '[object Array]' &&
      $toString(value.callee) === '[object Function]';
  };
  
  var supportsStandardArguments = (function () {
    return isStandardArguments(arguments);
  }());
  
  isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests
  
  module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
  
  },{"call-bind/callBound":26,"has-tostringtag/shams":36}],42:[function(require,module,exports){
  'use strict';
  
  var toStr = Object.prototype.toString;
  var fnToStr = Function.prototype.toString;
  var isFnRegex = /^\s*(?:function)?\*/;
  var hasToStringTag = require('has-tostringtag/shams')();
  var getProto = Object.getPrototypeOf;
  var getGeneratorFunc = function () { // eslint-disable-line consistent-return
    if (!hasToStringTag) {
      return false;
    }
    try {
      return Function('return function*() {}')();
    } catch (e) {
    }
  };
  var GeneratorFunction;
  
  module.exports = function isGeneratorFunction(fn) {
    if (typeof fn !== 'function') {
      return false;
    }
    if (isFnRegex.test(fnToStr.call(fn))) {
      return true;
    }
    if (!hasToStringTag) {
      var str = toStr.call(fn);
      return str === '[object GeneratorFunction]';
    }
    if (!getProto) {
      return false;
    }
    if (typeof GeneratorFunction === 'undefined') {
      var generatorFunc = getGeneratorFunc();
      GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
    }
    return getProto(fn) === GeneratorFunction;
  };
  
  },{"has-tostringtag/shams":36}],43:[function(require,module,exports){
  (function (global){(function (){
  'use strict';
  
  var forEach = require('foreach');
  var availableTypedArrays = require('available-typed-arrays');
  var callBound = require('call-bind/callBound');
  
  var $toString = callBound('Object.prototype.toString');
  var hasToStringTag = require('has-tostringtag/shams')();
  
  var g = typeof globalThis === 'undefined' ? global : globalThis;
  var typedArrays = availableTypedArrays();
  
  var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  };
  var $slice = callBound('String.prototype.slice');
  var toStrTags = {};
  var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
  var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
  if (hasToStringTag && gOPD && getPrototypeOf) {
    forEach(typedArrays, function (typedArray) {
      var arr = new g[typedArray]();
      if (Symbol.toStringTag in arr) {
        var proto = getPrototypeOf(arr);
        var descriptor = gOPD(proto, Symbol.toStringTag);
        if (!descriptor) {
          var superProto = getPrototypeOf(proto);
          descriptor = gOPD(superProto, Symbol.toStringTag);
        }
        toStrTags[typedArray] = descriptor.get;
      }
    });
  }
  
  var tryTypedArrays = function tryAllTypedArrays(value) {
    var anyTrue = false;
    forEach(toStrTags, function (getter, typedArray) {
      if (!anyTrue) {
        try {
          anyTrue = getter.call(value) === typedArray;
        } catch (e) { /**/ }
      }
    });
    return anyTrue;
  };
  
  module.exports = function isTypedArray(value) {
    if (!value || typeof value !== 'object') { return false; }
    if (!hasToStringTag || !(Symbol.toStringTag in value)) {
      var tag = $slice($toString(value), 8, -1);
      return $indexOf(typedArrays, tag) > -1;
    }
    if (!gOPD) { return false; }
    return tryTypedArrays(value);
  };
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"available-typed-arrays":18,"call-bind/callBound":26,"es-abstract/helpers/getOwnPropertyDescriptor":28,"foreach":30,"has-tostringtag/shams":36}],44:[function(require,module,exports){
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  
  'use strict';
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  
  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }
  
    return Object(val);
  }
  
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
  
      // Detect buggy property enumeration order in older V8 versions.
  
      // https://bugs.chromium.org/p/v8/issues/detail?id=4118
      var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
      test1[5] = 'de';
      if (Object.getOwnPropertyNames(test1)[0] === '5') {
        return false;
      }
  
      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2['_' + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      });
      if (order2.join('') !== '0123456789') {
        return false;
      }
  
      // https://bugs.chromium.org/p/v8/issues/detail?id=3056
      var test3 = {};
      'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join('') !==
          'abcdefghijklmnopqrst') {
        return false;
      }
  
      return true;
    } catch (err) {
      // We don't expect any of the above to throw, but better to be safe.
      return false;
    }
  }
  
  module.exports = shouldUseNative() ? Object.assign : function (target, source) {
    var from;
    var to = toObject(target);
    var symbols;
  
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
  
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
  
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
  
    return to;
  };
  
  },{}],45:[function(require,module,exports){
  (function (process){(function (){
  // 'path' module extracted from Node.js v8.11.1 (only the posix part)
  // transplited with Babel
  
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  function assertPath(path) {
    if (typeof path !== 'string') {
      throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
    }
  }
  
  // Resolves . and .. elements in a path with directory names
  function normalizeStringPosix(path, allowAboveRoot) {
    var res = '';
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code;
    for (var i = 0; i <= path.length; ++i) {
      if (i < path.length)
        code = path.charCodeAt(i);
      else if (code === 47 /*/*/)
        break;
      else
        code = 47 /*/*/;
      if (code === 47 /*/*/) {
        if (lastSlash === i - 1 || dots === 1) {
          // NOOP
        } else if (lastSlash !== i - 1 && dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
            if (res.length > 2) {
              var lastSlashIndex = res.lastIndexOf('/');
              if (lastSlashIndex !== res.length - 1) {
                if (lastSlashIndex === -1) {
                  res = '';
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                }
                lastSlash = i;
                dots = 0;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = '';
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            if (res.length > 0)
              res += '/..';
            else
              res = '..';
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0)
            res += '/' + path.slice(lastSlash + 1, i);
          else
            res = path.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code === 46 /*.*/ && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  
  function _format(sep, pathObject) {
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
    if (!dir) {
      return base;
    }
    if (dir === pathObject.root) {
      return dir + base;
    }
    return dir + sep + base;
  }
  
  var posix = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
      var resolvedPath = '';
      var resolvedAbsolute = false;
      var cwd;
  
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path;
        if (i >= 0)
          path = arguments[i];
        else {
          if (cwd === undefined)
            cwd = process.cwd();
          path = cwd;
        }
  
        assertPath(path);
  
        // Skip empty entries
        if (path.length === 0) {
          continue;
        }
  
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
      }
  
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
  
      // Normalize the path
      resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0)
          return '/' + resolvedPath;
        else
          return '/';
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return '.';
      }
    },
  
    normalize: function normalize(path) {
      assertPath(path);
  
      if (path.length === 0) return '.';
  
      var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
      var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;
  
      // Normalize the path
      path = normalizeStringPosix(path, !isAbsolute);
  
      if (path.length === 0 && !isAbsolute) path = '.';
      if (path.length > 0 && trailingSeparator) path += '/';
  
      if (isAbsolute) return '/' + path;
      return path;
    },
  
    isAbsolute: function isAbsolute(path) {
      assertPath(path);
      return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
    },
  
    join: function join() {
      if (arguments.length === 0)
        return '.';
      var joined;
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        assertPath(arg);
        if (arg.length > 0) {
          if (joined === undefined)
            joined = arg;
          else
            joined += '/' + arg;
        }
      }
      if (joined === undefined)
        return '.';
      return posix.normalize(joined);
    },
  
    relative: function relative(from, to) {
      assertPath(from);
      assertPath(to);
  
      if (from === to) return '';
  
      from = posix.resolve(from);
      to = posix.resolve(to);
  
      if (from === to) return '';
  
      // Trim any leading backslashes
      var fromStart = 1;
      for (; fromStart < from.length; ++fromStart) {
        if (from.charCodeAt(fromStart) !== 47 /*/*/)
          break;
      }
      var fromEnd = from.length;
      var fromLen = fromEnd - fromStart;
  
      // Trim any leading backslashes
      var toStart = 1;
      for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== 47 /*/*/)
          break;
      }
      var toEnd = to.length;
      var toLen = toEnd - toStart;
  
      // Compare paths to find the longest common path from root
      var length = fromLen < toLen ? fromLen : toLen;
      var lastCommonSep = -1;
      var i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (to.charCodeAt(toStart + i) === 47 /*/*/) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
          break;
        else if (fromCode === 47 /*/*/)
          lastCommonSep = i;
      }
  
      var out = '';
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
          if (out.length === 0)
            out += '..';
          else
            out += '/..';
        }
      }
  
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0)
        return out + to.slice(toStart + lastCommonSep);
      else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47 /*/*/)
          ++toStart;
        return to.slice(toStart);
      }
    },
  
    _makeLong: function _makeLong(path) {
      return path;
    },
  
    dirname: function dirname(path) {
      assertPath(path);
      if (path.length === 0) return '.';
      var code = path.charCodeAt(0);
      var hasRoot = code === 47 /*/*/;
      var end = -1;
      var matchedSlash = true;
      for (var i = path.length - 1; i >= 1; --i) {
        code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            if (!matchedSlash) {
              end = i;
              break;
            }
          } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
  
      if (end === -1) return hasRoot ? '/' : '.';
      if (hasRoot && end === 1) return '//';
      return path.slice(0, end);
    },
  
    basename: function basename(path, ext) {
      if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
      assertPath(path);
  
      var start = 0;
      var end = -1;
      var matchedSlash = true;
      var i;
  
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return '';
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          var code = path.charCodeAt(i);
          if (code === 47 /*/*/) {
              // If we reached a path separator that was not part of a set of path
              // separators at the end of the string, stop now
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
  
        if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === 47 /*/*/) {
              // If we reached a path separator that was not part of a set of path
              // separators at the end of the string, stop now
              if (!matchedSlash) {
                start = i + 1;
                break;
              }
            } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
  
        if (end === -1) return '';
        return path.slice(start, end);
      }
    },
  
    extname: function extname(path) {
      assertPath(path);
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      var preDotState = 0;
      for (var i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === 46 /*.*/) {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1)
              startDot = i;
            else if (preDotState !== 1)
              preDotState = 1;
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
  
      if (startDot === -1 || end === -1 ||
          // We saw a non-dot character immediately before the dot
          preDotState === 0 ||
          // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return '';
      }
      return path.slice(startDot, end);
    },
  
    format: function format(pathObject) {
      if (pathObject === null || typeof pathObject !== 'object') {
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
      }
      return _format('/', pathObject);
    },
  
    parse: function parse(path) {
      assertPath(path);
  
      var ret = { root: '', dir: '', base: '', ext: '', name: '' };
      if (path.length === 0) return ret;
      var code = path.charCodeAt(0);
      var isAbsolute = code === 47 /*/*/;
      var start;
      if (isAbsolute) {
        ret.root = '/';
        start = 1;
      } else {
        start = 0;
      }
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var i = path.length - 1;
  
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      var preDotState = 0;
  
      // Get non-dir info
      for (; i >= start; --i) {
        code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              startPart = i + 1;
              break;
            }
            continue;
          }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === 46 /*.*/) {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
          } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
  
      if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
  
      if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
  
      return ret;
    },
  
    sep: '/',
    delimiter: ':',
    win32: null,
    posix: null
  };
  
  posix.posix = posix;
  
  module.exports = posix;
  
  }).call(this)}).call(this,require('_process'))
  },{"_process":46}],46:[function(require,module,exports){
  // shim for using process in browser
  var process = module.exports = {};
  
  // cached from whatever global is present so that test runners that stub it
  // don't break things.  But we need to wrap it in a try catch in case it is
  // wrapped in strict mode code which doesn't define any globals.  It's inside a
  // function because try/catches deoptimize in certain engines.
  
  var cachedSetTimeout;
  var cachedClearTimeout;
  
  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  (function () {
      try {
          if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
          } else {
              cachedSetTimeout = defaultSetTimout;
          }
      } catch (e) {
          cachedSetTimeout = defaultSetTimout;
      }
      try {
          if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
          } else {
              cachedClearTimeout = defaultClearTimeout;
          }
      } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
      }
  } ())
  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }
  
  
  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }
  
  
  
  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  
  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }
  
  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
  
      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  
  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  };
  
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};
  
  function noop() {}
  
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;
  
  process.listeners = function (name) { return [] }
  
  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };
  
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };
  
  },{}],47:[function(require,module,exports){
  (function (global){(function (){
  /*! https://mths.be/punycode v1.4.1 by @mathias */
  ;(function(root) {
  
    /** Detect free variables */
    var freeExports = typeof exports == 'object' && exports &&
      !exports.nodeType && exports;
    var freeModule = typeof module == 'object' && module &&
      !module.nodeType && module;
    var freeGlobal = typeof global == 'object' && global;
    if (
      freeGlobal.global === freeGlobal ||
      freeGlobal.window === freeGlobal ||
      freeGlobal.self === freeGlobal
    ) {
      root = freeGlobal;
    }
  
    /**
     * The `punycode` object.
     * @name punycode
     * @type Object
     */
    var punycode,
  
    /** Highest positive signed 32-bit float value */
    maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
  
    /** Bootstring parameters */
    base = 36,
    tMin = 1,
    tMax = 26,
    skew = 38,
    damp = 700,
    initialBias = 72,
    initialN = 128, // 0x80
    delimiter = '-', // '\x2D'
  
    /** Regular expressions */
    regexPunycode = /^xn--/,
    regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
    regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
  
    /** Error messages */
    errors = {
      'overflow': 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input'
    },
  
    /** Convenience shortcuts */
    baseMinusTMin = base - tMin,
    floor = Math.floor,
    stringFromCharCode = String.fromCharCode,
  
    /** Temporary variable */
    key;
  
    /*--------------------------------------------------------------------------*/
  
    /**
     * A generic error utility function.
     * @private
     * @param {String} type The error type.
     * @returns {Error} Throws a `RangeError` with the applicable error message.
     */
    function error(type) {
      throw new RangeError(errors[type]);
    }
  
    /**
     * A generic `Array#map` utility function.
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} callback The function that gets called for every array
     * item.
     * @returns {Array} A new array of values returned by the callback function.
     */
    function map(array, fn) {
      var length = array.length;
      var result = [];
      while (length--) {
        result[length] = fn(array[length]);
      }
      return result;
    }
  
    /**
     * A simple `Array#map`-like wrapper to work with domain name strings or email
     * addresses.
     * @private
     * @param {String} domain The domain name or email address.
     * @param {Function} callback The function that gets called for every
     * character.
     * @returns {Array} A new string of characters returned by the callback
     * function.
     */
    function mapDomain(string, fn) {
      var parts = string.split('@');
      var result = '';
      if (parts.length > 1) {
        // In email addresses, only the domain name should be punycoded. Leave
        // the local part (i.e. everything up to `@`) intact.
        result = parts[0] + '@';
        string = parts[1];
      }
      // Avoid `split(regex)` for IE8 compatibility. See #17.
      string = string.replace(regexSeparators, '\x2E');
      var labels = string.split('.');
      var encoded = map(labels, fn).join('.');
      return result + encoded;
    }
  
    /**
     * Creates an array containing the numeric code points of each Unicode
     * character in the string. While JavaScript uses UCS-2 internally,
     * this function will convert a pair of surrogate halves (each of which
     * UCS-2 exposes as separate characters) into a single code point,
     * matching UTF-16.
     * @see `punycode.ucs2.encode`
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode.ucs2
     * @name decode
     * @param {String} string The Unicode input string (UCS-2).
     * @returns {Array} The new array of code points.
     */
    function ucs2decode(string) {
      var output = [],
          counter = 0,
          length = string.length,
          value,
          extra;
      while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
          // high surrogate, and there is a next character
          extra = string.charCodeAt(counter++);
          if ((extra & 0xFC00) == 0xDC00) { // low surrogate
            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
          } else {
            // unmatched surrogate; only append this code unit, in case the next
            // code unit is the high surrogate of a surrogate pair
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }
  
    /**
     * Creates a string based on an array of numeric code points.
     * @see `punycode.ucs2.decode`
     * @memberOf punycode.ucs2
     * @name encode
     * @param {Array} codePoints The array of numeric code points.
     * @returns {String} The new Unicode string (UCS-2).
     */
    function ucs2encode(array) {
      return map(array, function(value) {
        var output = '';
        if (value > 0xFFFF) {
          value -= 0x10000;
          output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
          value = 0xDC00 | value & 0x3FF;
        }
        output += stringFromCharCode(value);
        return output;
      }).join('');
    }
  
    /**
     * Converts a basic code point into a digit/integer.
     * @see `digitToBasic()`
     * @private
     * @param {Number} codePoint The basic numeric code point value.
     * @returns {Number} The numeric value of a basic code point (for use in
     * representing integers) in the range `0` to `base - 1`, or `base` if
     * the code point does not represent a value.
     */
    function basicToDigit(codePoint) {
      if (codePoint - 48 < 10) {
        return codePoint - 22;
      }
      if (codePoint - 65 < 26) {
        return codePoint - 65;
      }
      if (codePoint - 97 < 26) {
        return codePoint - 97;
      }
      return base;
    }
  
    /**
     * Converts a digit/integer into a basic code point.
     * @see `basicToDigit()`
     * @private
     * @param {Number} digit The numeric value of a basic code point.
     * @returns {Number} The basic code point whose value (when used for
     * representing integers) is `digit`, which needs to be in the range
     * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
     * used; else, the lowercase form is used. The behavior is undefined
     * if `flag` is non-zero and `digit` has no uppercase form.
     */
    function digitToBasic(digit, flag) {
      //  0..25 map to ASCII a..z or A..Z
      // 26..35 map to ASCII 0..9
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }
  
    /**
     * Bias adaptation function as per section 3.4 of RFC 3492.
     * https://tools.ietf.org/html/rfc3492#section-3.4
     * @private
     */
    function adapt(delta, numPoints, firstTime) {
      var k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    }
  
    /**
     * Converts a Punycode string of ASCII-only symbols to a string of Unicode
     * symbols.
     * @memberOf punycode
     * @param {String} input The Punycode string of ASCII-only symbols.
     * @returns {String} The resulting string of Unicode symbols.
     */
    function decode(input) {
      // Don't use UCS-2
      var output = [],
          inputLength = input.length,
          out,
          i = 0,
          n = initialN,
          bias = initialBias,
          basic,
          j,
          index,
          oldi,
          w,
          k,
          digit,
          t,
          /** Cached calculation results */
          baseMinusT;
  
      // Handle the basic code points: let `basic` be the number of input code
      // points before the last delimiter, or `0` if there is none, then copy
      // the first basic code points to the output.
  
      basic = input.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
  
      for (j = 0; j < basic; ++j) {
        // if it's not a basic code point
        if (input.charCodeAt(j) >= 0x80) {
          error('not-basic');
        }
        output.push(input.charCodeAt(j));
      }
  
      // Main decoding loop: start just after the last delimiter if any basic code
      // points were copied; start at the beginning otherwise.
  
      for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
  
        // `index` is the index of the next character to be consumed.
        // Decode a generalized variable-length integer into `delta`,
        // which gets added to `i`. The overflow checking is easier
        // if we increase `i` as we go, then subtract off its starting
        // value at the end to obtain `delta`.
        for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
  
          if (index >= inputLength) {
            error('invalid-input');
          }
  
          digit = basicToDigit(input.charCodeAt(index++));
  
          if (digit >= base || digit > floor((maxInt - i) / w)) {
            error('overflow');
          }
  
          i += digit * w;
          t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
  
          if (digit < t) {
            break;
          }
  
          baseMinusT = base - t;
          if (w > floor(maxInt / baseMinusT)) {
            error('overflow');
          }
  
          w *= baseMinusT;
  
        }
  
        out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
  
        // `i` was supposed to wrap around from `out` to `0`,
        // incrementing `n` each time, so we'll fix that now:
        if (floor(i / out) > maxInt - n) {
          error('overflow');
        }
  
        n += floor(i / out);
        i %= out;
  
        // Insert `n` at position `i` of the output
        output.splice(i++, 0, n);
  
      }
  
      return ucs2encode(output);
    }
  
    /**
     * Converts a string of Unicode symbols (e.g. a domain name label) to a
     * Punycode string of ASCII-only symbols.
     * @memberOf punycode
     * @param {String} input The string of Unicode symbols.
     * @returns {String} The resulting Punycode string of ASCII-only symbols.
     */
    function encode(input) {
      var n,
          delta,
          handledCPCount,
          basicLength,
          bias,
          j,
          m,
          q,
          k,
          t,
          currentValue,
          output = [],
          /** `inputLength` will hold the number of code points in `input`. */
          inputLength,
          /** Cached calculation results */
          handledCPCountPlusOne,
          baseMinusT,
          qMinusT;
  
      // Convert the input in UCS-2 to Unicode
      input = ucs2decode(input);
  
      // Cache the length
      inputLength = input.length;
  
      // Initialize the state
      n = initialN;
      delta = 0;
      bias = initialBias;
  
      // Handle the basic code points
      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue < 0x80) {
          output.push(stringFromCharCode(currentValue));
        }
      }
  
      handledCPCount = basicLength = output.length;
  
      // `handledCPCount` is the number of code points that have been handled;
      // `basicLength` is the number of basic code points.
  
      // Finish the basic string - if it is not empty - with a delimiter
      if (basicLength) {
        output.push(delimiter);
      }
  
      // Main encoding loop:
      while (handledCPCount < inputLength) {
  
        // All non-basic code points < n have been handled already. Find the next
        // larger one:
        for (m = maxInt, j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        }
  
        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // but guard against overflow
        handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error('overflow');
        }
  
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
  
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
  
          if (currentValue < n && ++delta > maxInt) {
            error('overflow');
          }
  
          if (currentValue == n) {
            // Represent delta as a generalized variable-length integer
            for (q = delta, k = base; /* no condition */; k += base) {
              t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
              if (q < t) {
                break;
              }
              qMinusT = q - t;
              baseMinusT = base - t;
              output.push(
                stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
              );
              q = floor(qMinusT / baseMinusT);
            }
  
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }
  
        ++delta;
        ++n;
  
      }
      return output.join('');
    }
  
    /**
     * Converts a Punycode string representing a domain name or an email address
     * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
     * it doesn't matter if you call it on a string that has already been
     * converted to Unicode.
     * @memberOf punycode
     * @param {String} input The Punycoded domain name or email address to
     * convert to Unicode.
     * @returns {String} The Unicode representation of the given Punycode
     * string.
     */
    function toUnicode(input) {
      return mapDomain(input, function(string) {
        return regexPunycode.test(string)
          ? decode(string.slice(4).toLowerCase())
          : string;
      });
    }
  
    /**
     * Converts a Unicode string representing a domain name or an email address to
     * Punycode. Only the non-ASCII parts of the domain name will be converted,
     * i.e. it doesn't matter if you call it with a domain that's already in
     * ASCII.
     * @memberOf punycode
     * @param {String} input The domain name or email address to convert, as a
     * Unicode string.
     * @returns {String} The Punycode representation of the given domain name or
     * email address.
     */
    function toASCII(input) {
      return mapDomain(input, function(string) {
        return regexNonASCII.test(string)
          ? 'xn--' + encode(string)
          : string;
      });
    }
  
    /*--------------------------------------------------------------------------*/
  
    /** Define the public API */
    punycode = {
      /**
       * A string representing the current Punycode.js version number.
       * @memberOf punycode
       * @type String
       */
      'version': '1.4.1',
      /**
       * An object of methods to convert from JavaScript's internal character
       * representation (UCS-2) to Unicode code points, and back.
       * @see <https://mathiasbynens.be/notes/javascript-encoding>
       * @memberOf punycode
       * @type Object
       */
      'ucs2': {
        'decode': ucs2decode,
        'encode': ucs2encode
      },
      'decode': decode,
      'encode': encode,
      'toASCII': toASCII,
      'toUnicode': toUnicode
    };
  
    /** Expose `punycode` */
    // Some AMD build optimizers, like r.js, check for specific condition patterns
    // like the following:
    if (
      typeof define == 'function' &&
      typeof define.amd == 'object' &&
      define.amd
    ) {
      define('punycode', function() {
        return punycode;
      });
    } else if (freeExports && freeModule) {
      if (module.exports == freeExports) {
        // in Node.js, io.js, or RingoJS v0.8.0+
        freeModule.exports = punycode;
      } else {
        // in Narwhal or RingoJS v0.7.0-
        for (key in punycode) {
          punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
        }
      }
    } else {
      // in Rhino or a web browser
      root.punycode = punycode;
    }
  
  }(this));
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}],48:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  // If obj.hasOwnProperty has been overridden, then calling
  // obj.hasOwnProperty(prop) will break.
  // See: https://github.com/joyent/node/issues/1707
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  
  module.exports = function(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};
  
    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }
  
    var regexp = /\+/g;
    qs = qs.split(sep);
  
    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }
  
    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }
  
    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
          idx = x.indexOf(eq),
          kstr, vstr, k, v;
  
      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }
  
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
  
      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }
  
    return obj;
  };
  
  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };
  
  },{}],49:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  var stringifyPrimitive = function(v) {
    switch (typeof v) {
      case 'string':
        return v;
  
      case 'boolean':
        return v ? 'true' : 'false';
  
      case 'number':
        return isFinite(v) ? v : '';
  
      default:
        return '';
    }
  };
  
  module.exports = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }
  
    if (typeof obj === 'object') {
      return map(objectKeys(obj), function(k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (isArray(obj[k])) {
          return map(obj[k], function(v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);
  
    }
  
    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
           encodeURIComponent(stringifyPrimitive(obj));
  };
  
  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };
  
  function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      res.push(f(xs[i], i));
    }
    return res;
  }
  
  var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
  };
  
  },{}],50:[function(require,module,exports){
  'use strict';
  
  exports.decode = exports.parse = require('./decode');
  exports.encode = exports.stringify = require('./encode');
  
  },{"./decode":48,"./encode":49}],51:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  module.exports = Stream;
  
  var EE = require('events').EventEmitter;
  var inherits = require('inherits');
  
  inherits(Stream, EE);
  Stream.Readable = require('readable-stream/lib/_stream_readable.js');
  Stream.Writable = require('readable-stream/lib/_stream_writable.js');
  Stream.Duplex = require('readable-stream/lib/_stream_duplex.js');
  Stream.Transform = require('readable-stream/lib/_stream_transform.js');
  Stream.PassThrough = require('readable-stream/lib/_stream_passthrough.js');
  Stream.finished = require('readable-stream/lib/internal/streams/end-of-stream.js')
  Stream.pipeline = require('readable-stream/lib/internal/streams/pipeline.js')
  
  // Backwards-compat with node 0.4.x
  Stream.Stream = Stream;
  
  
  
  // old-style streams.  Note that the pipe method (the only relevant
  // part of this class) is overridden in the Readable class.
  
  function Stream() {
    EE.call(this);
  }
  
  Stream.prototype.pipe = function(dest, options) {
    var source = this;
  
    function ondata(chunk) {
      if (dest.writable) {
        if (false === dest.write(chunk) && source.pause) {
          source.pause();
        }
      }
    }
  
    source.on('data', ondata);
  
    function ondrain() {
      if (source.readable && source.resume) {
        source.resume();
      }
    }
  
    dest.on('drain', ondrain);
  
    // If the 'end' option is not supplied, dest.end() will be called when
    // source gets the 'end' or 'close' events.  Only dest.end() once.
    if (!dest._isStdio && (!options || options.end !== false)) {
      source.on('end', onend);
      source.on('close', onclose);
    }
  
    var didOnEnd = false;
    function onend() {
      if (didOnEnd) return;
      didOnEnd = true;
  
      dest.end();
    }
  
  
    function onclose() {
      if (didOnEnd) return;
      didOnEnd = true;
  
      if (typeof dest.destroy === 'function') dest.destroy();
    }
  
    // don't leave dangling pipes when there are errors.
    function onerror(er) {
      cleanup();
      if (EE.listenerCount(this, 'error') === 0) {
        throw er; // Unhandled stream error in pipe.
      }
    }
  
    source.on('error', onerror);
    dest.on('error', onerror);
  
    // remove all the event listeners that were added.
    function cleanup() {
      source.removeListener('data', ondata);
      dest.removeListener('drain', ondrain);
  
      source.removeListener('end', onend);
      source.removeListener('close', onclose);
  
      source.removeListener('error', onerror);
      dest.removeListener('error', onerror);
  
      source.removeListener('end', cleanup);
      source.removeListener('close', cleanup);
  
      dest.removeListener('close', cleanup);
    }
  
    source.on('end', cleanup);
    source.on('close', cleanup);
  
    dest.on('close', cleanup);
  
    dest.emit('pipe', source);
  
    // Allow for unix-like usage: A.pipe(B).pipe(C)
    return dest;
  };
  
  },{"events":29,"inherits":40,"readable-stream/lib/_stream_duplex.js":53,"readable-stream/lib/_stream_passthrough.js":54,"readable-stream/lib/_stream_readable.js":55,"readable-stream/lib/_stream_transform.js":56,"readable-stream/lib/_stream_writable.js":57,"readable-stream/lib/internal/streams/end-of-stream.js":61,"readable-stream/lib/internal/streams/pipeline.js":63}],52:[function(require,module,exports){
  'use strict';
  
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }
  
  var codes = {};
  
  function createErrorType(code, message, Base) {
    if (!Base) {
      Base = Error;
    }
  
    function getMessage(arg1, arg2, arg3) {
      if (typeof message === 'string') {
        return message;
      } else {
        return message(arg1, arg2, arg3);
      }
    }
  
    var NodeError =
    /*#__PURE__*/
    function (_Base) {
      _inheritsLoose(NodeError, _Base);
  
      function NodeError(arg1, arg2, arg3) {
        return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
      }
  
      return NodeError;
    }(Base);
  
    NodeError.prototype.name = Base.name;
    NodeError.prototype.code = code;
    codes[code] = NodeError;
  } // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js
  
  
  function oneOf(expected, thing) {
    if (Array.isArray(expected)) {
      var len = expected.length;
      expected = expected.map(function (i) {
        return String(i);
      });
  
      if (len > 2) {
        return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
      } else if (len === 2) {
        return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
      } else {
        return "of ".concat(thing, " ").concat(expected[0]);
      }
    } else {
      return "of ".concat(thing, " ").concat(String(expected));
    }
  } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  
  
  function startsWith(str, search, pos) {
    return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
  
  
  function endsWith(str, search, this_len) {
    if (this_len === undefined || this_len > str.length) {
      this_len = str.length;
    }
  
    return str.substring(this_len - search.length, this_len) === search;
  } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
  
  
  function includes(str, search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }
  
    if (start + search.length > str.length) {
      return false;
    } else {
      return str.indexOf(search, start) !== -1;
    }
  }
  
  createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
    return 'The value "' + value + '" is invalid for option "' + name + '"';
  }, TypeError);
  createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
    // determiner: 'must be' or 'must not be'
    var determiner;
  
    if (typeof expected === 'string' && startsWith(expected, 'not ')) {
      determiner = 'must not be';
      expected = expected.replace(/^not /, '');
    } else {
      determiner = 'must be';
    }
  
    var msg;
  
    if (endsWith(name, ' argument')) {
      // For cases like 'first argument'
      msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
    } else {
      var type = includes(name, '.') ? 'property' : 'argument';
      msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
    }
  
    msg += ". Received type ".concat(typeof actual);
    return msg;
  }, TypeError);
  createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
  createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
    return 'The ' + name + ' method is not implemented';
  });
  createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
  createErrorType('ERR_STREAM_DESTROYED', function (name) {
    return 'Cannot call ' + name + ' after a stream was destroyed';
  });
  createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
  createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
  createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
  createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
  createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
    return 'Unknown encoding: ' + arg;
  }, TypeError);
  createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
  module.exports.codes = codes;
  
  },{}],53:[function(require,module,exports){
  (function (process){(function (){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // a duplex stream is just a stream that is both readable and writable.
  // Since JS doesn't have multiple prototypal inheritance, this class
  // prototypally inherits from Readable, and then parasitically from
  // Writable.
  'use strict';
  /*<replacement>*/
  
  var objectKeys = Object.keys || function (obj) {
    var keys = [];
  
    for (var key in obj) {
      keys.push(key);
    }
  
    return keys;
  };
  /*</replacement>*/
  
  
  module.exports = Duplex;
  
  var Readable = require('./_stream_readable');
  
  var Writable = require('./_stream_writable');
  
  require('inherits')(Duplex, Readable);
  
  {
    // Allow the keys array to be GC'ed.
    var keys = objectKeys(Writable.prototype);
  
    for (var v = 0; v < keys.length; v++) {
      var method = keys[v];
      if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  
  function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    this.allowHalfOpen = true;
  
    if (options) {
      if (options.readable === false) this.readable = false;
      if (options.writable === false) this.writable = false;
  
      if (options.allowHalfOpen === false) {
        this.allowHalfOpen = false;
        this.once('end', onend);
      }
    }
  }
  
  Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.highWaterMark;
    }
  });
  Object.defineProperty(Duplex.prototype, 'writableBuffer', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  Object.defineProperty(Duplex.prototype, 'writableLength', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.length;
    }
  }); // the no-half-open enforcer
  
  function onend() {
    // If the writable side ended, then we're ok.
    if (this._writableState.ended) return; // no more data can be written.
    // But allow more writes to happen in this tick.
  
    process.nextTick(onEndNT, this);
  }
  
  function onEndNT(self) {
    self.end();
  }
  
  Object.defineProperty(Duplex.prototype, 'destroyed', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false;
      }
  
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function set(value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (this._readableState === undefined || this._writableState === undefined) {
        return;
      } // backward compatibility, the user is explicitly
      // managing destroyed
  
  
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  }).call(this)}).call(this,require('_process'))
  },{"./_stream_readable":55,"./_stream_writable":57,"_process":46,"inherits":40}],54:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // a passthrough stream.
  // basically just the most minimal sort of Transform stream.
  // Every written chunk gets output as-is.
  'use strict';
  
  module.exports = PassThrough;
  
  var Transform = require('./_stream_transform');
  
  require('inherits')(PassThrough, Transform);
  
  function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options);
    Transform.call(this, options);
  }
  
  PassThrough.prototype._transform = function (chunk, encoding, cb) {
    cb(null, chunk);
  };
  },{"./_stream_transform":56,"inherits":40}],55:[function(require,module,exports){
  (function (process,global){(function (){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  'use strict';
  
  module.exports = Readable;
  /*<replacement>*/
  
  var Duplex;
  /*</replacement>*/
  
  Readable.ReadableState = ReadableState;
  /*<replacement>*/
  
  var EE = require('events').EventEmitter;
  
  var EElistenerCount = function EElistenerCount(emitter, type) {
    return emitter.listeners(type).length;
  };
  /*</replacement>*/
  
  /*<replacement>*/
  
  
  var Stream = require('./internal/streams/stream');
  /*</replacement>*/
  
  
  var Buffer = require('buffer').Buffer;
  
  var OurUint8Array = global.Uint8Array || function () {};
  
  function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk);
  }
  
  function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  /*<replacement>*/
  
  
  var debugUtil = require('util');
  
  var debug;
  
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog('stream');
  } else {
    debug = function debug() {};
  }
  /*</replacement>*/
  
  
  var BufferList = require('./internal/streams/buffer_list');
  
  var destroyImpl = require('./internal/streams/destroy');
  
  var _require = require('./internal/streams/state'),
      getHighWaterMark = _require.getHighWaterMark;
  
  var _require$codes = require('../errors').codes,
      ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
      ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
      ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
      ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.
  
  
  var StringDecoder;
  var createReadableStreamAsyncIterator;
  var from;
  
  require('inherits')(Readable, Stream);
  
  var errorOrDestroy = destroyImpl.errorOrDestroy;
  var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];
  
  function prependListener(emitter, event, fn) {
    // Sadly this is not cacheable as some libraries bundle their own
    // event emitter implementation with them.
    if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
  
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
  
  function ReadableState(options, stream, isDuplex) {
    Duplex = Duplex || require('./_stream_duplex');
    options = options || {}; // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
  
    if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
    // make all the buffer merging and length checks go away
  
    this.objectMode = !!options.objectMode;
    if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
    // Note: 0 is a valid value, means "don't call _read preemptively ever"
  
    this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
    // linked list can remove elements from the beginning faster than
    // array.shift()
  
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
  
    this.sync = true; // whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
  
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this.paused = true; // Should close be emitted on destroy. Defaults to true.
  
    this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')
  
    this.autoDestroy = !!options.autoDestroy; // has it been destroyed
  
    this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
  
    this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s
  
    this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled
  
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
  
    if (options.encoding) {
      if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  
  function Readable(options) {
    Duplex = Duplex || require('./_stream_duplex');
    if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
    // the ReadableState constructor, at least with V8 6.5
  
    var isDuplex = this instanceof Duplex;
    this._readableState = new ReadableState(options, this, isDuplex); // legacy
  
    this.readable = true;
  
    if (options) {
      if (typeof options.read === 'function') this._read = options.read;
      if (typeof options.destroy === 'function') this._destroy = options.destroy;
    }
  
    Stream.call(this);
  }
  
  Object.defineProperty(Readable.prototype, 'destroyed', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._readableState === undefined) {
        return false;
      }
  
      return this._readableState.destroyed;
    },
    set: function set(value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (!this._readableState) {
        return;
      } // backward compatibility, the user is explicitly
      // managing destroyed
  
  
      this._readableState.destroyed = value;
    }
  });
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  
  Readable.prototype._destroy = function (err, cb) {
    cb(err);
  }; // Manually shove something into the read() buffer.
  // This returns true if the highWaterMark has not been hit yet,
  // similar to how Writable.write() returns true if you should
  // write() some more.
  
  
  Readable.prototype.push = function (chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
  
    if (!state.objectMode) {
      if (typeof chunk === 'string') {
        encoding = encoding || state.defaultEncoding;
  
        if (encoding !== state.encoding) {
          chunk = Buffer.from(chunk, encoding);
          encoding = '';
        }
  
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
  
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  }; // Unshift should *always* be something directly out of read()
  
  
  Readable.prototype.unshift = function (chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  
  function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
    debug('readableAddChunk', chunk);
    var state = stream._readableState;
  
    if (chunk === null) {
      state.reading = false;
      onEofChunk(stream, state);
    } else {
      var er;
      if (!skipChunkCheck) er = chunkInvalid(state, chunk);
  
      if (er) {
        errorOrDestroy(stream, er);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
  
        if (addToFront) {
          if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
        } else if (state.ended) {
          errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
        } else if (state.destroyed) {
          return false;
        } else {
          state.reading = false;
  
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
          } else {
            addChunk(stream, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
        maybeReadMore(stream, state);
      }
    } // We can push more data if we are below the highWaterMark.
    // Also, if we have no data yet, we can stand some more bytes.
    // This is to work around cases where hwm=0, such as the repl.
  
  
    return !state.ended && (state.length < state.highWaterMark || state.length === 0);
  }
  
  function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      state.awaitDrain = 0;
      stream.emit('data', chunk);
    } else {
      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
      if (state.needReadable) emitReadable(stream);
    }
  
    maybeReadMore(stream, state);
  }
  
  function chunkInvalid(state, chunk) {
    var er;
  
    if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
      er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
    }
  
    return er;
  }
  
  Readable.prototype.isPaused = function () {
    return this._readableState.flowing === false;
  }; // backwards compatibility.
  
  
  Readable.prototype.setEncoding = function (enc) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    var decoder = new StringDecoder(enc);
    this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8
  
    this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:
  
    var p = this._readableState.buffer.head;
    var content = '';
  
    while (p !== null) {
      content += decoder.write(p.data);
      p = p.next;
    }
  
    this._readableState.buffer.clear();
  
    if (content !== '') this._readableState.buffer.push(content);
    this._readableState.length = content.length;
    return this;
  }; // Don't raise the hwm > 1GB
  
  
  var MAX_HWM = 0x40000000;
  
  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
      n = MAX_HWM;
    } else {
      // Get the next highest power of 2 to prevent increasing hwm excessively in
      // tiny amounts
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
  
    return n;
  } // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  
  
  function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended) return 0;
    if (state.objectMode) return 1;
  
    if (n !== n) {
      // Only flow one buffer at a time
      if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
    } // If we're asking for more than the current hwm, then raise the hwm.
  
  
    if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length) return n; // Don't have enough
  
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }
  
    return state.length;
  } // you can override either this method, or the async _read(n) below.
  
  
  Readable.prototype.read = function (n) {
    debug('read', n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
    if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
    // already have a bunch of data in the buffer, then just trigger
    // the 'readable' event and move on.
  
    if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
      debug('read: emitReadable', state.length, state.ended);
      if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
      return null;
    }
  
    n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.
  
    if (n === 0 && state.ended) {
      if (state.length === 0) endReadable(this);
      return null;
    } // All the actual chunk generation logic needs to be
    // *below* the call to _read.  The reason is that in certain
    // synthetic stream cases, such as passthrough streams, _read
    // may be a completely synchronous operation which may change
    // the state of the read buffer, providing enough data when
    // before there was *not* enough.
    //
    // So, the steps are:
    // 1. Figure out what the state of things will be after we do
    // a read from the buffer.
    //
    // 2. If that resulting state will trigger a _read, then call _read.
    // Note that this may be asynchronous, or synchronous.  Yes, it is
    // deeply ugly to write APIs this way, but that still doesn't mean
    // that the Readable class should behave improperly, as streams are
    // designed to be sync/async agnostic.
    // Take note if the _read call is sync or async (ie, if the read call
    // has returned yet), so that we know whether or not it's safe to emit
    // 'readable' etc.
    //
    // 3. Actually pull the requested chunks out of the buffer and return.
    // if we need a readable event, then we need to do some reading.
  
  
    var doRead = state.needReadable;
    debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some
  
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug('length less than watermark', doRead);
    } // however, if we've ended, then there's no point, and if we're already
    // reading, then it's unnecessary.
  
  
    if (state.ended || state.reading) {
      doRead = false;
      debug('reading or ended', doRead);
    } else if (doRead) {
      debug('do read');
      state.reading = true;
      state.sync = true; // if the length is currently zero, then we *need* a readable event.
  
      if (state.length === 0) state.needReadable = true; // call internal read method
  
      this._read(state.highWaterMark);
  
      state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
      // and we need to re-evaluate how much data we can return to the user.
  
      if (!state.reading) n = howMuchToRead(nOrig, state);
    }
  
    var ret;
    if (n > 0) ret = fromList(n, state);else ret = null;
  
    if (ret === null) {
      state.needReadable = state.length <= state.highWaterMark;
      n = 0;
    } else {
      state.length -= n;
      state.awaitDrain = 0;
    }
  
    if (state.length === 0) {
      // If we have nothing in the buffer, then we want to know
      // as soon as we *do* get something into the buffer.
      if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.
  
      if (nOrig !== n && state.ended) endReadable(this);
    }
  
    if (ret !== null) this.emit('data', ret);
    return ret;
  };
  
  function onEofChunk(stream, state) {
    debug('onEofChunk');
    if (state.ended) return;
  
    if (state.decoder) {
      var chunk = state.decoder.end();
  
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
  
    state.ended = true;
  
    if (state.sync) {
      // if we are sync, wait until next tick to emit the data.
      // Otherwise we risk emitting data in the flow()
      // the readable code triggers during a read() call
      emitReadable(stream);
    } else {
      // emit 'readable' now to make sure it gets picked up.
      state.needReadable = false;
  
      if (!state.emittedReadable) {
        state.emittedReadable = true;
        emitReadable_(stream);
      }
    }
  } // Don't emit readable right away in sync mode, because this can trigger
  // another read() call => stack overflow.  This way, it might trigger
  // a nextTick recursion warning, but that's not so bad.
  
  
  function emitReadable(stream) {
    var state = stream._readableState;
    debug('emitReadable', state.needReadable, state.emittedReadable);
    state.needReadable = false;
  
    if (!state.emittedReadable) {
      debug('emitReadable', state.flowing);
      state.emittedReadable = true;
      process.nextTick(emitReadable_, stream);
    }
  }
  
  function emitReadable_(stream) {
    var state = stream._readableState;
    debug('emitReadable_', state.destroyed, state.length, state.ended);
  
    if (!state.destroyed && (state.length || state.ended)) {
      stream.emit('readable');
      state.emittedReadable = false;
    } // The stream needs another readable event if
    // 1. It is not flowing, as the flow mechanism will take
    //    care of it.
    // 2. It is not ended.
    // 3. It is below the highWaterMark, so we can schedule
    //    another readable later.
  
  
    state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
    flow(stream);
  } // at this point, the user has presumably seen the 'readable' event,
  // and called read() to consume some data.  that may have triggered
  // in turn another _read(n) call, in which case reading = true if
  // it's in progress.
  // However, if we're not ended, or reading, and the length < hwm,
  // then go ahead and try to read some more preemptively.
  
  
  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      process.nextTick(maybeReadMore_, stream, state);
    }
  }
  
  function maybeReadMore_(stream, state) {
    // Attempt to read more data if we should.
    //
    // The conditions for reading more data are (one of):
    // - Not enough data buffered (state.length < state.highWaterMark). The loop
    //   is responsible for filling the buffer with enough data if such data
    //   is available. If highWaterMark is 0 and we are not in the flowing mode
    //   we should _not_ attempt to buffer any extra data. We'll get more data
    //   when the stream consumer calls read() instead.
    // - No data in the buffer, and the stream is in flowing mode. In this mode
    //   the loop below is responsible for ensuring read() is called. Failing to
    //   call read here would abort the flow and there's no other mechanism for
    //   continuing the flow if the stream consumer has just subscribed to the
    //   'data' event.
    //
    // In addition to the above conditions to keep reading data, the following
    // conditions prevent the data from being read:
    // - The stream has ended (state.ended).
    // - There is already a pending 'read' operation (state.reading). This is a
    //   case where the the stream has called the implementation defined _read()
    //   method, but they are processing the call asynchronously and have _not_
    //   called push() with new data. In this case we skip performing more
    //   read()s. The execution ends in this method again after the _read() ends
    //   up calling push() with more data.
    while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
      var len = state.length;
      debug('maybeReadMore read 0');
      stream.read(0);
      if (len === state.length) // didn't get any data, stop spinning.
        break;
    }
  
    state.readingMore = false;
  } // abstract method.  to be overridden in specific implementation classes.
  // call cb(er, data) where data is <= n in length.
  // for virtual (non-string, non-buffer) streams, "length" is somewhat
  // arbitrary, and perhaps not very meaningful.
  
  
  Readable.prototype._read = function (n) {
    errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
  };
  
  Readable.prototype.pipe = function (dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
  
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
  
      case 1:
        state.pipes = [state.pipes, dest];
        break;
  
      default:
        state.pipes.push(dest);
        break;
    }
  
    state.pipesCount += 1;
    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
    dest.on('unpipe', onunpipe);
  
    function onunpipe(readable, unpipeInfo) {
      debug('onunpipe');
  
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
  
    function onend() {
      debug('onend');
      dest.end();
    } // when the dest drains, it reduces the awaitDrain counter
    // on the source.  This would be more elegant with a .once()
    // handler in flow(), but adding and removing repeatedly is
    // too slow.
  
  
    var ondrain = pipeOnDrain(src);
    dest.on('drain', ondrain);
    var cleanedUp = false;
  
    function cleanup() {
      debug('cleanup'); // cleanup event handlers once the pipe is broken
  
      dest.removeListener('close', onclose);
      dest.removeListener('finish', onfinish);
      dest.removeListener('drain', ondrain);
      dest.removeListener('error', onerror);
      dest.removeListener('unpipe', onunpipe);
      src.removeListener('end', onend);
      src.removeListener('end', unpipe);
      src.removeListener('data', ondata);
      cleanedUp = true; // if the reader is waiting for a drain event from this
      // specific writer, then it would cause it to never start
      // flowing again.
      // So, if this is awaiting a drain, then we just call it now.
      // If we don't know, then assume that we are waiting for one.
  
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
    }
  
    src.on('data', ondata);
  
    function ondata(chunk) {
      debug('ondata');
      var ret = dest.write(chunk);
      debug('dest.write', ret);
  
      if (ret === false) {
        // If the user unpiped during `dest.write()`, it is possible
        // to get stuck in a permanently paused state if that write
        // also returned false.
        // => Check whether `dest` is still a piping destination.
        if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
          debug('false write response, pause', state.awaitDrain);
          state.awaitDrain++;
        }
  
        src.pause();
      }
    } // if the dest has an error, then stop piping into it.
    // however, don't suppress the throwing behavior for this.
  
  
    function onerror(er) {
      debug('onerror', er);
      unpipe();
      dest.removeListener('error', onerror);
      if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
    } // Make sure our error handler is attached before userland ones.
  
  
    prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.
  
    function onclose() {
      dest.removeListener('finish', onfinish);
      unpipe();
    }
  
    dest.once('close', onclose);
  
    function onfinish() {
      debug('onfinish');
      dest.removeListener('close', onclose);
      unpipe();
    }
  
    dest.once('finish', onfinish);
  
    function unpipe() {
      debug('unpipe');
      src.unpipe(dest);
    } // tell the dest that it's being piped to
  
  
    dest.emit('pipe', src); // start the flow if it hasn't been started already.
  
    if (!state.flowing) {
      debug('pipe resume');
      src.resume();
    }
  
    return dest;
  };
  
  function pipeOnDrain(src) {
    return function pipeOnDrainFunctionResult() {
      var state = src._readableState;
      debug('pipeOnDrain', state.awaitDrain);
      if (state.awaitDrain) state.awaitDrain--;
  
      if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
        state.flowing = true;
        flow(src);
      }
    };
  }
  
  Readable.prototype.unpipe = function (dest) {
    var state = this._readableState;
    var unpipeInfo = {
      hasUnpiped: false
    }; // if we're not piping anywhere, then do nothing.
  
    if (state.pipesCount === 0) return this; // just one destination.  most common case.
  
    if (state.pipesCount === 1) {
      // passed in one, but it's not the right one.
      if (dest && dest !== state.pipes) return this;
      if (!dest) dest = state.pipes; // got a match.
  
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest) dest.emit('unpipe', this, unpipeInfo);
      return this;
    } // slow case. multiple pipe destinations.
  
  
    if (!dest) {
      // remove all.
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
  
      for (var i = 0; i < len; i++) {
        dests[i].emit('unpipe', this, {
          hasUnpiped: false
        });
      }
  
      return this;
    } // try to find the right one.
  
  
    var index = indexOf(state.pipes, dest);
    if (index === -1) return this;
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1) state.pipes = state.pipes[0];
    dest.emit('unpipe', this, unpipeInfo);
    return this;
  }; // set up data events if they are asked for
  // Ensure readable listeners eventually get something
  
  
  Readable.prototype.on = function (ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    var state = this._readableState;
  
    if (ev === 'data') {
      // update readableListening so that resume() may be a no-op
      // a few lines down. This is needed to support once('readable').
      state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused
  
      if (state.flowing !== false) this.resume();
    } else if (ev === 'readable') {
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.flowing = false;
        state.emittedReadable = false;
        debug('on readable', state.length, state.reading);
  
        if (state.length) {
          emitReadable(this);
        } else if (!state.reading) {
          process.nextTick(nReadingNextTick, this);
        }
      }
    }
  
    return res;
  };
  
  Readable.prototype.addListener = Readable.prototype.on;
  
  Readable.prototype.removeListener = function (ev, fn) {
    var res = Stream.prototype.removeListener.call(this, ev, fn);
  
    if (ev === 'readable') {
      // We need to check if there is someone still listening to
      // readable and reset the state. However this needs to happen
      // after readable has been emitted but before I/O (nextTick) to
      // support once('readable', fn) cycles. This means that calling
      // resume within the same tick will have no
      // effect.
      process.nextTick(updateReadableListening, this);
    }
  
    return res;
  };
  
  Readable.prototype.removeAllListeners = function (ev) {
    var res = Stream.prototype.removeAllListeners.apply(this, arguments);
  
    if (ev === 'readable' || ev === undefined) {
      // We need to check if there is someone still listening to
      // readable and reset the state. However this needs to happen
      // after readable has been emitted but before I/O (nextTick) to
      // support once('readable', fn) cycles. This means that calling
      // resume within the same tick will have no
      // effect.
      process.nextTick(updateReadableListening, this);
    }
  
    return res;
  };
  
  function updateReadableListening(self) {
    var state = self._readableState;
    state.readableListening = self.listenerCount('readable') > 0;
  
    if (state.resumeScheduled && !state.paused) {
      // flowing needs to be set to true now, otherwise
      // the upcoming resume will not flow.
      state.flowing = true; // crude way to check if we should resume
    } else if (self.listenerCount('data') > 0) {
      self.resume();
    }
  }
  
  function nReadingNextTick(self) {
    debug('readable nexttick read 0');
    self.read(0);
  } // pause() and resume() are remnants of the legacy readable stream API
  // If the user uses them, then switch into old mode.
  
  
  Readable.prototype.resume = function () {
    var state = this._readableState;
  
    if (!state.flowing) {
      debug('resume'); // we flow only if there is no one listening
      // for readable, but we still have to call
      // resume()
  
      state.flowing = !state.readableListening;
      resume(this, state);
    }
  
    state.paused = false;
    return this;
  };
  
  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      process.nextTick(resume_, stream, state);
    }
  }
  
  function resume_(stream, state) {
    debug('resume', state.reading);
  
    if (!state.reading) {
      stream.read(0);
    }
  
    state.resumeScheduled = false;
    stream.emit('resume');
    flow(stream);
    if (state.flowing && !state.reading) stream.read(0);
  }
  
  Readable.prototype.pause = function () {
    debug('call pause flowing=%j', this._readableState.flowing);
  
    if (this._readableState.flowing !== false) {
      debug('pause');
      this._readableState.flowing = false;
      this.emit('pause');
    }
  
    this._readableState.paused = true;
    return this;
  };
  
  function flow(stream) {
    var state = stream._readableState;
    debug('flow', state.flowing);
  
    while (state.flowing && stream.read() !== null) {
      ;
    }
  } // wrap an old-style stream as the async data source.
  // This is *not* part of the readable stream interface.
  // It is an ugly unfortunate mess of history.
  
  
  Readable.prototype.wrap = function (stream) {
    var _this = this;
  
    var state = this._readableState;
    var paused = false;
    stream.on('end', function () {
      debug('wrapped end');
  
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) _this.push(chunk);
      }
  
      _this.push(null);
    });
    stream.on('data', function (chunk) {
      debug('wrapped data');
      if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode
  
      if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
  
      var ret = _this.push(chunk);
  
      if (!ret) {
        paused = true;
        stream.pause();
      }
    }); // proxy all the other methods.
    // important when wrapping filters and duplexes.
  
    for (var i in stream) {
      if (this[i] === undefined && typeof stream[i] === 'function') {
        this[i] = function methodWrap(method) {
          return function methodWrapReturnFunction() {
            return stream[method].apply(stream, arguments);
          };
        }(i);
      }
    } // proxy certain important events.
  
  
    for (var n = 0; n < kProxyEvents.length; n++) {
      stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    } // when we try to consume some more bytes, simply unpause the
    // underlying stream.
  
  
    this._read = function (n) {
      debug('wrapped _read', n);
  
      if (paused) {
        paused = false;
        stream.resume();
      }
    };
  
    return this;
  };
  
  if (typeof Symbol === 'function') {
    Readable.prototype[Symbol.asyncIterator] = function () {
      if (createReadableStreamAsyncIterator === undefined) {
        createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
      }
  
      return createReadableStreamAsyncIterator(this);
    };
  }
  
  Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.highWaterMark;
    }
  });
  Object.defineProperty(Readable.prototype, 'readableBuffer', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState && this._readableState.buffer;
    }
  });
  Object.defineProperty(Readable.prototype, 'readableFlowing', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.flowing;
    },
    set: function set(state) {
      if (this._readableState) {
        this._readableState.flowing = state;
      }
    }
  }); // exposed for testing purposes only.
  
  Readable._fromList = fromList;
  Object.defineProperty(Readable.prototype, 'readableLength', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.length;
    }
  }); // Pluck off n bytes from an array of buffers.
  // Length is the combined lengths of all the buffers in the list.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  
  function fromList(n, state) {
    // nothing buffered
    if (state.length === 0) return null;
    var ret;
    if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
      // read it all, truncate the list
      if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      // read part of list
      ret = state.buffer.consume(n, state.decoder);
    }
    return ret;
  }
  
  function endReadable(stream) {
    var state = stream._readableState;
    debug('endReadable', state.endEmitted);
  
    if (!state.endEmitted) {
      state.ended = true;
      process.nextTick(endReadableNT, state, stream);
    }
  }
  
  function endReadableNT(state, stream) {
    debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.
  
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream.readable = false;
      stream.emit('end');
  
      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the writable side is ready for autoDestroy as well
        var wState = stream._writableState;
  
        if (!wState || wState.autoDestroy && wState.finished) {
          stream.destroy();
        }
      }
    }
  }
  
  if (typeof Symbol === 'function') {
    Readable.from = function (iterable, opts) {
      if (from === undefined) {
        from = require('./internal/streams/from');
      }
  
      return from(Readable, iterable, opts);
    };
  }
  
  function indexOf(xs, x) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) return i;
    }
  
    return -1;
  }
  }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"../errors":52,"./_stream_duplex":53,"./internal/streams/async_iterator":58,"./internal/streams/buffer_list":59,"./internal/streams/destroy":60,"./internal/streams/from":62,"./internal/streams/state":64,"./internal/streams/stream":65,"_process":46,"buffer":24,"events":29,"inherits":40,"string_decoder/":67,"util":20}],56:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // a transform stream is a readable/writable stream where you do
  // something with the data.  Sometimes it's called a "filter",
  // but that's not a great name for it, since that implies a thing where
  // some bits pass through, and others are simply ignored.  (That would
  // be a valid example of a transform, of course.)
  //
  // While the output is causally related to the input, it's not a
  // necessarily symmetric or synchronous transformation.  For example,
  // a zlib stream might take multiple plain-text writes(), and then
  // emit a single compressed chunk some time in the future.
  //
  // Here's how this works:
  //
  // The Transform stream has all the aspects of the readable and writable
  // stream classes.  When you write(chunk), that calls _write(chunk,cb)
  // internally, and returns false if there's a lot of pending writes
  // buffered up.  When you call read(), that calls _read(n) until
  // there's enough pending readable data buffered up.
  //
  // In a transform stream, the written data is placed in a buffer.  When
  // _read(n) is called, it transforms the queued up data, calling the
  // buffered _write cb's as it consumes chunks.  If consuming a single
  // written chunk would result in multiple output chunks, then the first
  // outputted bit calls the readcb, and subsequent chunks just go into
  // the read buffer, and will cause it to emit 'readable' if necessary.
  //
  // This way, back-pressure is actually determined by the reading side,
  // since _read has to be called to start processing a new chunk.  However,
  // a pathological inflate type of transform can cause excessive buffering
  // here.  For example, imagine a stream where every byte of input is
  // interpreted as an integer from 0-255, and then results in that many
  // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
  // 1kb of data being output.  In this case, you could write a very small
  // amount of input, and end up with a very large amount of output.  In
  // such a pathological inflating mechanism, there'd be no way to tell
  // the system to stop doing the transform.  A single 4MB write could
  // cause the system to run out of memory.
  //
  // However, even in such a pathological case, only a single written chunk
  // would be consumed, and then the rest would wait (un-transformed) until
  // the results of the previous transformed chunk were consumed.
  'use strict';
  
  module.exports = Transform;
  
  var _require$codes = require('../errors').codes,
      ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
      ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
      ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
      ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
  
  var Duplex = require('./_stream_duplex');
  
  require('inherits')(Transform, Duplex);
  
  function afterTransform(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
  
    if (cb === null) {
      return this.emit('error', new ERR_MULTIPLE_CALLBACK());
    }
  
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null) // single equals check for both `null` and `undefined`
      this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
  
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  }
  
  function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }; // start out asking for a readable event once data is transformed.
  
    this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.
  
    this._readableState.sync = false;
  
    if (options) {
      if (typeof options.transform === 'function') this._transform = options.transform;
      if (typeof options.flush === 'function') this._flush = options.flush;
    } // When the writable side finishes, then flush out anything remaining.
  
  
    this.on('prefinish', prefinish);
  }
  
  function prefinish() {
    var _this = this;
  
    if (typeof this._flush === 'function' && !this._readableState.destroyed) {
      this._flush(function (er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  }
  
  Transform.prototype.push = function (chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  }; // This is the part where you do stuff!
  // override this function in implementation classes.
  // 'chunk' is an input chunk.
  //
  // Call `push(newChunk)` to pass along transformed output
  // to the readable side.  You may call 'push' zero or more times.
  //
  // Call `cb(err)` when you are done with this chunk.  If you pass
  // an error, then that'll put the hurt on the whole operation.  If you
  // never call cb(), then you'll never get another chunk.
  
  
  Transform.prototype._transform = function (chunk, encoding, cb) {
    cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
  };
  
  Transform.prototype._write = function (chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
  
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
    }
  }; // Doesn't matter what the args are here.
  // _transform does all the work.
  // That we got here means that the readable side wants more data.
  
  
  Transform.prototype._read = function (n) {
    var ts = this._transformState;
  
    if (ts.writechunk !== null && !ts.transforming) {
      ts.transforming = true;
  
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      // mark that we need a transform, so that any data that comes in
      // will get processed, now that we've asked for it.
      ts.needTransform = true;
    }
  };
  
  Transform.prototype._destroy = function (err, cb) {
    Duplex.prototype._destroy.call(this, err, function (err2) {
      cb(err2);
    });
  };
  
  function done(stream, er, data) {
    if (er) return stream.emit('error', er);
    if (data != null) // single equals check for both `null` and `undefined`
      stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
    // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided
  
    if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
    if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
    return stream.push(null);
  }
  },{"../errors":52,"./_stream_duplex":53,"inherits":40}],57:[function(require,module,exports){
  (function (process,global){(function (){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // A bit simpler than readable streams.
  // Implement an async ._write(chunk, encoding, cb), and it'll handle all
  // the drain event emission and buffering.
  'use strict';
  
  module.exports = Writable;
  /* <replacement> */
  
  function WriteReq(chunk, encoding, cb) {
    this.chunk = chunk;
    this.encoding = encoding;
    this.callback = cb;
    this.next = null;
  } // It seems a linked list but it is not
  // there will be only 2 of these for each stream
  
  
  function CorkedRequest(state) {
    var _this = this;
  
    this.next = null;
    this.entry = null;
  
    this.finish = function () {
      onCorkedFinish(_this, state);
    };
  }
  /* </replacement> */
  
  /*<replacement>*/
  
  
  var Duplex;
  /*</replacement>*/
  
  Writable.WritableState = WritableState;
  /*<replacement>*/
  
  var internalUtil = {
    deprecate: require('util-deprecate')
  };
  /*</replacement>*/
  
  /*<replacement>*/
  
  var Stream = require('./internal/streams/stream');
  /*</replacement>*/
  
  
  var Buffer = require('buffer').Buffer;
  
  var OurUint8Array = global.Uint8Array || function () {};
  
  function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk);
  }
  
  function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  
  var destroyImpl = require('./internal/streams/destroy');
  
  var _require = require('./internal/streams/state'),
      getHighWaterMark = _require.getHighWaterMark;
  
  var _require$codes = require('../errors').codes,
      ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
      ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
      ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
      ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
      ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
      ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
      ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
      ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
  
  var errorOrDestroy = destroyImpl.errorOrDestroy;
  
  require('inherits')(Writable, Stream);
  
  function nop() {}
  
  function WritableState(options, stream, isDuplex) {
    Duplex = Duplex || require('./_stream_duplex');
    options = options || {}; // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream,
    // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
  
    if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
    // contains buffers or objects.
  
    this.objectMode = !!options.objectMode;
    if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
    // Note: 0 is a valid value, means that we always return false if
    // the entire buffer is not flushed immediately on write()
  
    this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called
  
    this.finalCalled = false; // drain event flag.
  
    this.needDrain = false; // at the start of calling end()
  
    this.ending = false; // when end() has been called, and returned
  
    this.ended = false; // when 'finish' is emitted
  
    this.finished = false; // has it been destroyed
  
    this.destroyed = false; // should we decode strings into buffers before passing to _write?
    // this is here so that some node-core streams can optimize string
    // handling at a lower level.
  
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
  
    this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
    // of how much we're waiting to get pushed to some underlying
    // socket or file.
  
    this.length = 0; // a flag to see when we're in the middle of a write.
  
    this.writing = false; // when true all writes will be buffered until .uncork() call
  
    this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.
  
    this.sync = true; // a flag to know if we're processing previously buffered items, which
    // may call the _write() callback in the same tick, so that we don't
    // end up in an overlapped onwrite situation.
  
    this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)
  
    this.onwrite = function (er) {
      onwrite(stream, er);
    }; // the callback that the user supplies to write(chunk,encoding,cb)
  
  
    this.writecb = null; // the amount that is being written when _write is called.
  
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
    // this must be 0 before 'finish' can be emitted
  
    this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
    // This is relevant for synchronous Transform streams
  
    this.prefinished = false; // True if the error was already emitted and should not be thrown again
  
    this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.
  
    this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')
  
    this.autoDestroy = !!options.autoDestroy; // count buffered requests
  
    this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
    // one allocated and free to use, and we maintain at most two
  
    this.corkedRequestsFree = new CorkedRequest(this);
  }
  
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
  
    while (current) {
      out.push(current);
      current = current.next;
    }
  
    return out;
  };
  
  (function () {
    try {
      Object.defineProperty(WritableState.prototype, 'buffer', {
        get: internalUtil.deprecate(function writableStateBufferGetter() {
          return this.getBuffer();
        }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
      });
    } catch (_) {}
  })(); // Test _writableState for inheritance to account for Duplex streams,
  // whose prototype chain only points to Readable.
  
  
  var realHasInstance;
  
  if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function value(object) {
        if (realHasInstance.call(this, object)) return true;
        if (this !== Writable) return false;
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function realHasInstance(object) {
      return object instanceof this;
    };
  }
  
  function Writable(options) {
    Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
    // `realHasInstance` is necessary because using plain `instanceof`
    // would return false, as no `_writableState` property is attached.
    // Trying to use the custom `instanceof` for Writable here will also break the
    // Node.js LazyTransform implementation, which has a non-trivial getter for
    // `_writableState` that would lead to infinite recursion.
    // Checking for a Stream.Duplex instance is faster here instead of inside
    // the WritableState constructor, at least with V8 6.5
  
    var isDuplex = this instanceof Duplex;
    if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
    this._writableState = new WritableState(options, this, isDuplex); // legacy.
  
    this.writable = true;
  
    if (options) {
      if (typeof options.write === 'function') this._write = options.write;
      if (typeof options.writev === 'function') this._writev = options.writev;
      if (typeof options.destroy === 'function') this._destroy = options.destroy;
      if (typeof options.final === 'function') this._final = options.final;
    }
  
    Stream.call(this);
  } // Otherwise people can pipe Writable streams, which is just wrong.
  
  
  Writable.prototype.pipe = function () {
    errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
  };
  
  function writeAfterEnd(stream, cb) {
    var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb
  
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
  } // Checks that a user-supplied chunk is valid, especially for the particular
  // mode the stream is in. Currently this means that `null` is never accepted
  // and undefined/non-string values are only allowed in object mode.
  
  
  function validChunk(stream, state, chunk, cb) {
    var er;
  
    if (chunk === null) {
      er = new ERR_STREAM_NULL_VALUES();
    } else if (typeof chunk !== 'string' && !state.objectMode) {
      er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
    }
  
    if (er) {
      errorOrDestroy(stream, er);
      process.nextTick(cb, er);
      return false;
    }
  
    return true;
  }
  
  Writable.prototype.write = function (chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
  
    var isBuf = !state.objectMode && _isUint8Array(chunk);
  
    if (isBuf && !Buffer.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
  
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
  
    if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
    if (typeof cb !== 'function') cb = nop;
    if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
    return ret;
  };
  
  Writable.prototype.cork = function () {
    this._writableState.corked++;
  };
  
  Writable.prototype.uncork = function () {
    var state = this._writableState;
  
    if (state.corked) {
      state.corked--;
      if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
    }
  };
  
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    // node::ParseEncoding() requires lower case.
    if (typeof encoding === 'string') encoding = encoding.toLowerCase();
    if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  
  Object.defineProperty(Writable.prototype, 'writableBuffer', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  
  function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, encoding);
    }
  
    return chunk;
  }
  
  Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.highWaterMark;
    }
  }); // if we're already writing something, then just put this
  // in the queue, and wait our turn.  Otherwise, call _write
  // If we return false, then we need a drain event, so set that flag.
  
  function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding);
  
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = 'buffer';
        chunk = newChunk;
      }
    }
  
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.
  
    if (!ret) state.needDrain = true;
  
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest;
      state.lastBufferedRequest = {
        chunk: chunk,
        encoding: encoding,
        isBuf: isBuf,
        callback: cb,
        next: null
      };
  
      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }
  
      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream, state, false, len, chunk, encoding, cb);
    }
  
    return ret;
  }
  
  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  
  function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb;
  
    if (sync) {
      // defer the callback if we are being called synchronously
      // to avoid piling up things on the stack
      process.nextTick(cb, er); // this can emit finish, and it will always happen
      // after error
  
      process.nextTick(finishMaybe, stream, state);
      stream._writableState.errorEmitted = true;
      errorOrDestroy(stream, er);
    } else {
      // the caller expect this to happen before if
      // it is async
      cb(er);
      stream._writableState.errorEmitted = true;
      errorOrDestroy(stream, er); // this can emit finish, but finish must
      // always follow error
  
      finishMaybe(stream, state);
    }
  }
  
  function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  }
  
  function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
    onwriteStateUpdate(state);
    if (er) onwriteError(stream, state, sync, er, cb);else {
      // Check if we're actually ready to finish, but don't emit yet
      var finished = needFinish(state) || stream.destroyed;
  
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream, state);
      }
  
      if (sync) {
        process.nextTick(afterWrite, stream, state, finished, cb);
      } else {
        afterWrite(stream, state, finished, cb);
      }
    }
  }
  
  function afterWrite(stream, state, finished, cb) {
    if (!finished) onwriteDrain(stream, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream, state);
  } // Must force callback to be called on nextTick, so that we don't
  // emit 'drain' before the write() consumer gets the 'false' return
  // value, and has a chance to attach a 'drain' listener.
  
  
  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream.emit('drain');
    }
  } // if there's something in the buffer waiting, then process it
  
  
  function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
  
    if (stream._writev && entry && entry.next) {
      // Fast case, write everything using _writev()
      var l = state.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state.corkedRequestsFree;
      holder.entry = entry;
      var count = 0;
      var allBuffers = true;
  
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf) allBuffers = false;
        entry = entry.next;
        count += 1;
      }
  
      buffer.allBuffers = allBuffers;
      doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
      // as the hot path ends with doWrite
  
      state.pendingcb++;
      state.lastBufferedRequest = null;
  
      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
  
      state.bufferedRequestCount = 0;
    } else {
      // Slow case, write chunks one-by-one
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream, state, false, len, chunk, encoding, cb);
        entry = entry.next;
        state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
        // it means that we need to wait until it does.
        // also, that means that the chunk and cb are currently
        // being processed, so move the buffer counter past them.
  
        if (state.writing) {
          break;
        }
      }
  
      if (entry === null) state.lastBufferedRequest = null;
    }
  
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  }
  
  Writable.prototype._write = function (chunk, encoding, cb) {
    cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
  };
  
  Writable.prototype._writev = null;
  
  Writable.prototype.end = function (chunk, encoding, cb) {
    var state = this._writableState;
  
    if (typeof chunk === 'function') {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
  
    if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks
  
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    } // ignore unnecessary end() calls.
  
  
    if (!state.ending) endWritable(this, state, cb);
    return this;
  };
  
  Object.defineProperty(Writable.prototype, 'writableLength', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.length;
    }
  });
  
  function needFinish(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
  }
  
  function callFinal(stream, state) {
    stream._final(function (err) {
      state.pendingcb--;
  
      if (err) {
        errorOrDestroy(stream, err);
      }
  
      state.prefinished = true;
      stream.emit('prefinish');
      finishMaybe(stream, state);
    });
  }
  
  function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream._final === 'function' && !state.destroyed) {
        state.pendingcb++;
        state.finalCalled = true;
        process.nextTick(callFinal, stream, state);
      } else {
        state.prefinished = true;
        stream.emit('prefinish');
      }
    }
  }
  
  function finishMaybe(stream, state) {
    var need = needFinish(state);
  
    if (need) {
      prefinish(stream, state);
  
      if (state.pendingcb === 0) {
        state.finished = true;
        stream.emit('finish');
  
        if (state.autoDestroy) {
          // In case of duplex streams we need a way to detect
          // if the readable side is ready for autoDestroy as well
          var rState = stream._readableState;
  
          if (!rState || rState.autoDestroy && rState.endEmitted) {
            stream.destroy();
          }
        }
      }
    }
  
    return need;
  }
  
  function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);
  
    if (cb) {
      if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
    }
  
    state.ended = true;
    stream.writable = false;
  }
  
  function onCorkedFinish(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
  
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    } // reuse the free corkReq.
  
  
    state.corkedRequestsFree.next = corkReq;
  }
  
  Object.defineProperty(Writable.prototype, 'destroyed', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._writableState === undefined) {
        return false;
      }
  
      return this._writableState.destroyed;
    },
    set: function set(value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (!this._writableState) {
        return;
      } // backward compatibility, the user is explicitly
      // managing destroyed
  
  
      this._writableState.destroyed = value;
    }
  });
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  
  Writable.prototype._destroy = function (err, cb) {
    cb(err);
  };
  }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"../errors":52,"./_stream_duplex":53,"./internal/streams/destroy":60,"./internal/streams/state":64,"./internal/streams/stream":65,"_process":46,"buffer":24,"inherits":40,"util-deprecate":91}],58:[function(require,module,exports){
  (function (process){(function (){
  'use strict';
  
  var _Object$setPrototypeO;
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  var finished = require('./end-of-stream');
  
  var kLastResolve = Symbol('lastResolve');
  var kLastReject = Symbol('lastReject');
  var kError = Symbol('error');
  var kEnded = Symbol('ended');
  var kLastPromise = Symbol('lastPromise');
  var kHandlePromise = Symbol('handlePromise');
  var kStream = Symbol('stream');
  
  function createIterResult(value, done) {
    return {
      value: value,
      done: done
    };
  }
  
  function readAndResolve(iter) {
    var resolve = iter[kLastResolve];
  
    if (resolve !== null) {
      var data = iter[kStream].read(); // we defer if data is null
      // we can be expecting either 'end' or
      // 'error'
  
      if (data !== null) {
        iter[kLastPromise] = null;
        iter[kLastResolve] = null;
        iter[kLastReject] = null;
        resolve(createIterResult(data, false));
      }
    }
  }
  
  function onReadable(iter) {
    // we wait for the next tick, because it might
    // emit an error with process.nextTick
    process.nextTick(readAndResolve, iter);
  }
  
  function wrapForNext(lastPromise, iter) {
    return function (resolve, reject) {
      lastPromise.then(function () {
        if (iter[kEnded]) {
          resolve(createIterResult(undefined, true));
          return;
        }
  
        iter[kHandlePromise](resolve, reject);
      }, reject);
    };
  }
  
  var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
  var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
    get stream() {
      return this[kStream];
    },
  
    next: function next() {
      var _this = this;
  
      // if we have detected an error in the meanwhile
      // reject straight away
      var error = this[kError];
  
      if (error !== null) {
        return Promise.reject(error);
      }
  
      if (this[kEnded]) {
        return Promise.resolve(createIterResult(undefined, true));
      }
  
      if (this[kStream].destroyed) {
        // We need to defer via nextTick because if .destroy(err) is
        // called, the error will be emitted via nextTick, and
        // we cannot guarantee that there is no error lingering around
        // waiting to be emitted.
        return new Promise(function (resolve, reject) {
          process.nextTick(function () {
            if (_this[kError]) {
              reject(_this[kError]);
            } else {
              resolve(createIterResult(undefined, true));
            }
          });
        });
      } // if we have multiple next() calls
      // we will wait for the previous Promise to finish
      // this logic is optimized to support for await loops,
      // where next() is only called once at a time
  
  
      var lastPromise = this[kLastPromise];
      var promise;
  
      if (lastPromise) {
        promise = new Promise(wrapForNext(lastPromise, this));
      } else {
        // fast path needed to support multiple this.push()
        // without triggering the next() queue
        var data = this[kStream].read();
  
        if (data !== null) {
          return Promise.resolve(createIterResult(data, false));
        }
  
        promise = new Promise(this[kHandlePromise]);
      }
  
      this[kLastPromise] = promise;
      return promise;
    }
  }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
    return this;
  }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
    var _this2 = this;
  
    // destroy(err, cb) is a private API
    // we can guarantee we have that here, because we control the
    // Readable class this is attached to
    return new Promise(function (resolve, reject) {
      _this2[kStream].destroy(null, function (err) {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(createIterResult(undefined, true));
      });
    });
  }), _Object$setPrototypeO), AsyncIteratorPrototype);
  
  var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
    var _Object$create;
  
    var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
      value: stream,
      writable: true
    }), _defineProperty(_Object$create, kLastResolve, {
      value: null,
      writable: true
    }), _defineProperty(_Object$create, kLastReject, {
      value: null,
      writable: true
    }), _defineProperty(_Object$create, kError, {
      value: null,
      writable: true
    }), _defineProperty(_Object$create, kEnded, {
      value: stream._readableState.endEmitted,
      writable: true
    }), _defineProperty(_Object$create, kHandlePromise, {
      value: function value(resolve, reject) {
        var data = iterator[kStream].read();
  
        if (data) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(data, false));
        } else {
          iterator[kLastResolve] = resolve;
          iterator[kLastReject] = reject;
        }
      },
      writable: true
    }), _Object$create));
    iterator[kLastPromise] = null;
    finished(stream, function (err) {
      if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
        var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
        // returned by next() and store the error
  
        if (reject !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          reject(err);
        }
  
        iterator[kError] = err;
        return;
      }
  
      var resolve = iterator[kLastResolve];
  
      if (resolve !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(undefined, true));
      }
  
      iterator[kEnded] = true;
    });
    stream.on('readable', onReadable.bind(null, iterator));
    return iterator;
  };
  
  module.exports = createReadableStreamAsyncIterator;
  }).call(this)}).call(this,require('_process'))
  },{"./end-of-stream":61,"_process":46}],59:[function(require,module,exports){
  'use strict';
  
  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
  
  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  
  var _require = require('buffer'),
      Buffer = _require.Buffer;
  
  var _require2 = require('util'),
      inspect = _require2.inspect;
  
  var custom = inspect && inspect.custom || 'inspect';
  
  function copyBuffer(src, target, offset) {
    Buffer.prototype.copy.call(src, target, offset);
  }
  
  module.exports =
  /*#__PURE__*/
  function () {
    function BufferList() {
      _classCallCheck(this, BufferList);
  
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
  
    _createClass(BufferList, [{
      key: "push",
      value: function push(v) {
        var entry = {
          data: v,
          next: null
        };
        if (this.length > 0) this.tail.next = entry;else this.head = entry;
        this.tail = entry;
        ++this.length;
      }
    }, {
      key: "unshift",
      value: function unshift(v) {
        var entry = {
          data: v,
          next: this.head
        };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      }
    }, {
      key: "shift",
      value: function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
        --this.length;
        return ret;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.head = this.tail = null;
        this.length = 0;
      }
    }, {
      key: "join",
      value: function join(s) {
        if (this.length === 0) return '';
        var p = this.head;
        var ret = '' + p.data;
  
        while (p = p.next) {
          ret += s + p.data;
        }
  
        return ret;
      }
    }, {
      key: "concat",
      value: function concat(n) {
        if (this.length === 0) return Buffer.alloc(0);
        var ret = Buffer.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
  
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
  
        return ret;
      } // Consumes a specified amount of bytes or characters from the buffered data.
  
    }, {
      key: "consume",
      value: function consume(n, hasStrings) {
        var ret;
  
        if (n < this.head.data.length) {
          // `slice` is the same for buffers and strings.
          ret = this.head.data.slice(0, n);
          this.head.data = this.head.data.slice(n);
        } else if (n === this.head.data.length) {
          // First chunk is a perfect match.
          ret = this.shift();
        } else {
          // Result spans more than one buffer.
          ret = hasStrings ? this._getString(n) : this._getBuffer(n);
        }
  
        return ret;
      }
    }, {
      key: "first",
      value: function first() {
        return this.head.data;
      } // Consumes a specified amount of characters from the buffered data.
  
    }, {
      key: "_getString",
      value: function _getString(n) {
        var p = this.head;
        var c = 1;
        var ret = p.data;
        n -= ret.length;
  
        while (p = p.next) {
          var str = p.data;
          var nb = n > str.length ? str.length : n;
          if (nb === str.length) ret += str;else ret += str.slice(0, n);
          n -= nb;
  
          if (n === 0) {
            if (nb === str.length) {
              ++c;
              if (p.next) this.head = p.next;else this.head = this.tail = null;
            } else {
              this.head = p;
              p.data = str.slice(nb);
            }
  
            break;
          }
  
          ++c;
        }
  
        this.length -= c;
        return ret;
      } // Consumes a specified amount of bytes from the buffered data.
  
    }, {
      key: "_getBuffer",
      value: function _getBuffer(n) {
        var ret = Buffer.allocUnsafe(n);
        var p = this.head;
        var c = 1;
        p.data.copy(ret);
        n -= p.data.length;
  
        while (p = p.next) {
          var buf = p.data;
          var nb = n > buf.length ? buf.length : n;
          buf.copy(ret, ret.length - n, 0, nb);
          n -= nb;
  
          if (n === 0) {
            if (nb === buf.length) {
              ++c;
              if (p.next) this.head = p.next;else this.head = this.tail = null;
            } else {
              this.head = p;
              p.data = buf.slice(nb);
            }
  
            break;
          }
  
          ++c;
        }
  
        this.length -= c;
        return ret;
      } // Make sure the linked list only shows the minimal necessary information.
  
    }, {
      key: custom,
      value: function value(_, options) {
        return inspect(this, _objectSpread({}, options, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: false
        }));
      }
    }]);
  
    return BufferList;
  }();
  },{"buffer":24,"util":20}],60:[function(require,module,exports){
  (function (process){(function (){
  'use strict'; // undocumented cb() API, needed for core, not for public API
  
  function destroy(err, cb) {
    var _this = this;
  
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
  
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err) {
        if (!this._writableState) {
          process.nextTick(emitErrorNT, this, err);
        } else if (!this._writableState.errorEmitted) {
          this._writableState.errorEmitted = true;
          process.nextTick(emitErrorNT, this, err);
        }
      }
  
      return this;
    } // we set destroyed to true before firing error callbacks in order
    // to make it re-entrance safe in case destroy() is called within callbacks
  
  
    if (this._readableState) {
      this._readableState.destroyed = true;
    } // if this is a duplex stream mark the writable part as destroyed as well
  
  
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
  
    this._destroy(err || null, function (err) {
      if (!cb && err) {
        if (!_this._writableState) {
          process.nextTick(emitErrorAndCloseNT, _this, err);
        } else if (!_this._writableState.errorEmitted) {
          _this._writableState.errorEmitted = true;
          process.nextTick(emitErrorAndCloseNT, _this, err);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      } else if (cb) {
        process.nextTick(emitCloseNT, _this);
        cb(err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    });
  
    return this;
  }
  
  function emitErrorAndCloseNT(self, err) {
    emitErrorNT(self, err);
    emitCloseNT(self);
  }
  
  function emitCloseNT(self) {
    if (self._writableState && !self._writableState.emitClose) return;
    if (self._readableState && !self._readableState.emitClose) return;
    self.emit('close');
  }
  
  function undestroy() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
  
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finalCalled = false;
      this._writableState.prefinished = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  }
  
  function emitErrorNT(self, err) {
    self.emit('error', err);
  }
  
  function errorOrDestroy(stream, err) {
    // We have tests that rely on errors being emitted
    // in the same tick, so changing this is semver major.
    // For now when you opt-in to autoDestroy we allow
    // the error to be emitted nextTick. In a future
    // semver major update we should change the default to this.
    var rState = stream._readableState;
    var wState = stream._writableState;
    if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
  }
  
  module.exports = {
    destroy: destroy,
    undestroy: undestroy,
    errorOrDestroy: errorOrDestroy
  };
  }).call(this)}).call(this,require('_process'))
  },{"_process":46}],61:[function(require,module,exports){
  // Ported from https://github.com/mafintosh/end-of-stream with
  // permission from the author, Mathias Buus (@mafintosh).
  'use strict';
  
  var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;
  
  function once(callback) {
    var called = false;
    return function () {
      if (called) return;
      called = true;
  
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
  
      callback.apply(this, args);
    };
  }
  
  function noop() {}
  
  function isRequest(stream) {
    return stream.setHeader && typeof stream.abort === 'function';
  }
  
  function eos(stream, opts, callback) {
    if (typeof opts === 'function') return eos(stream, null, opts);
    if (!opts) opts = {};
    callback = once(callback || noop);
    var readable = opts.readable || opts.readable !== false && stream.readable;
    var writable = opts.writable || opts.writable !== false && stream.writable;
  
    var onlegacyfinish = function onlegacyfinish() {
      if (!stream.writable) onfinish();
    };
  
    var writableEnded = stream._writableState && stream._writableState.finished;
  
    var onfinish = function onfinish() {
      writable = false;
      writableEnded = true;
      if (!readable) callback.call(stream);
    };
  
    var readableEnded = stream._readableState && stream._readableState.endEmitted;
  
    var onend = function onend() {
      readable = false;
      readableEnded = true;
      if (!writable) callback.call(stream);
    };
  
    var onerror = function onerror(err) {
      callback.call(stream, err);
    };
  
    var onclose = function onclose() {
      var err;
  
      if (readable && !readableEnded) {
        if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
        return callback.call(stream, err);
      }
  
      if (writable && !writableEnded) {
        if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
        return callback.call(stream, err);
      }
    };
  
    var onrequest = function onrequest() {
      stream.req.on('finish', onfinish);
    };
  
    if (isRequest(stream)) {
      stream.on('complete', onfinish);
      stream.on('abort', onclose);
      if (stream.req) onrequest();else stream.on('request', onrequest);
    } else if (writable && !stream._writableState) {
      // legacy streams
      stream.on('end', onlegacyfinish);
      stream.on('close', onlegacyfinish);
    }
  
    stream.on('end', onend);
    stream.on('finish', onfinish);
    if (opts.error !== false) stream.on('error', onerror);
    stream.on('close', onclose);
    return function () {
      stream.removeListener('complete', onfinish);
      stream.removeListener('abort', onclose);
      stream.removeListener('request', onrequest);
      if (stream.req) stream.req.removeListener('finish', onfinish);
      stream.removeListener('end', onlegacyfinish);
      stream.removeListener('close', onlegacyfinish);
      stream.removeListener('finish', onfinish);
      stream.removeListener('end', onend);
      stream.removeListener('error', onerror);
      stream.removeListener('close', onclose);
    };
  }
  
  module.exports = eos;
  },{"../../../errors":52}],62:[function(require,module,exports){
  module.exports = function () {
    throw new Error('Readable.from is not available in the browser')
  };
  
  },{}],63:[function(require,module,exports){
  // Ported from https://github.com/mafintosh/pump with
  // permission from the author, Mathias Buus (@mafintosh).
  'use strict';
  
  var eos;
  
  function once(callback) {
    var called = false;
    return function () {
      if (called) return;
      called = true;
      callback.apply(void 0, arguments);
    };
  }
  
  var _require$codes = require('../../../errors').codes,
      ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
      ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
  
  function noop(err) {
    // Rethrow the error if it exists to avoid swallowing it
    if (err) throw err;
  }
  
  function isRequest(stream) {
    return stream.setHeader && typeof stream.abort === 'function';
  }
  
  function destroyer(stream, reading, writing, callback) {
    callback = once(callback);
    var closed = false;
    stream.on('close', function () {
      closed = true;
    });
    if (eos === undefined) eos = require('./end-of-stream');
    eos(stream, {
      readable: reading,
      writable: writing
    }, function (err) {
      if (err) return callback(err);
      closed = true;
      callback();
    });
    var destroyed = false;
    return function (err) {
      if (closed) return;
      if (destroyed) return;
      destroyed = true; // request.destroy just do .end - .abort is what we want
  
      if (isRequest(stream)) return stream.abort();
      if (typeof stream.destroy === 'function') return stream.destroy();
      callback(err || new ERR_STREAM_DESTROYED('pipe'));
    };
  }
  
  function call(fn) {
    fn();
  }
  
  function pipe(from, to) {
    return from.pipe(to);
  }
  
  function popCallback(streams) {
    if (!streams.length) return noop;
    if (typeof streams[streams.length - 1] !== 'function') return noop;
    return streams.pop();
  }
  
  function pipeline() {
    for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
      streams[_key] = arguments[_key];
    }
  
    var callback = popCallback(streams);
    if (Array.isArray(streams[0])) streams = streams[0];
  
    if (streams.length < 2) {
      throw new ERR_MISSING_ARGS('streams');
    }
  
    var error;
    var destroys = streams.map(function (stream, i) {
      var reading = i < streams.length - 1;
      var writing = i > 0;
      return destroyer(stream, reading, writing, function (err) {
        if (!error) error = err;
        if (err) destroys.forEach(call);
        if (reading) return;
        destroys.forEach(call);
        callback(error);
      });
    });
    return streams.reduce(pipe);
  }
  
  module.exports = pipeline;
  },{"../../../errors":52,"./end-of-stream":61}],64:[function(require,module,exports){
  'use strict';
  
  var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;
  
  function highWaterMarkFrom(options, isDuplex, duplexKey) {
    return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
  }
  
  function getHighWaterMark(state, options, duplexKey, isDuplex) {
    var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
  
    if (hwm != null) {
      if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
        var name = isDuplex ? duplexKey : 'highWaterMark';
        throw new ERR_INVALID_OPT_VALUE(name, hwm);
      }
  
      return Math.floor(hwm);
    } // Default value
  
  
    return state.objectMode ? 16 : 16 * 1024;
  }
  
  module.exports = {
    getHighWaterMark: getHighWaterMark
  };
  },{"../../../errors":52}],65:[function(require,module,exports){
  module.exports = require('events').EventEmitter;
  
  },{"events":29}],66:[function(require,module,exports){
  arguments[4][22][0].apply(exports,arguments)
  },{"buffer":24,"dup":22}],67:[function(require,module,exports){
  arguments[4][23][0].apply(exports,arguments)
  },{"dup":23,"safe-buffer":66}],68:[function(require,module,exports){
  (function (global){(function (){
  var ClientRequest = require('./lib/request')
  var response = require('./lib/response')
  var extend = require('xtend')
  var statusCodes = require('builtin-status-codes')
  var url = require('url')
  
  var http = exports
  
  http.request = function (opts, cb) {
    if (typeof opts === 'string')
      opts = url.parse(opts)
    else
      opts = extend(opts)
  
    // Normally, the page is loaded from http or https, so not specifying a protocol
    // will result in a (valid) protocol-relative url. However, this won't work if
    // the protocol is something else, like 'file:'
    var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''
  
    var protocol = opts.protocol || defaultProtocol
    var host = opts.hostname || opts.host
    var port = opts.port
    var path = opts.path || '/'
  
    // Necessary for IPv6 addresses
    if (host && host.indexOf(':') !== -1)
      host = '[' + host + ']'
  
    // This may be a relative url. The browser should always be able to interpret it correctly.
    opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
    opts.method = (opts.method || 'GET').toUpperCase()
    opts.headers = opts.headers || {}
  
    // Also valid opts.auth, opts.mode
  
    var req = new ClientRequest(opts)
    if (cb)
      req.on('response', cb)
    return req
  }
  
  http.get = function get (opts, cb) {
    var req = http.request(opts, cb)
    req.end()
    return req
  }
  
  http.ClientRequest = ClientRequest
  http.IncomingMessage = response.IncomingMessage
  
  http.Agent = function () {}
  http.Agent.defaultMaxSockets = 4
  
  http.globalAgent = new http.Agent()
  
  http.STATUS_CODES = statusCodes
  
  http.METHODS = [
    'CHECKOUT',
    'CONNECT',
    'COPY',
    'DELETE',
    'GET',
    'HEAD',
    'LOCK',
    'M-SEARCH',
    'MERGE',
    'MKACTIVITY',
    'MKCOL',
    'MOVE',
    'NOTIFY',
    'OPTIONS',
    'PATCH',
    'POST',
    'PROPFIND',
    'PROPPATCH',
    'PURGE',
    'PUT',
    'REPORT',
    'SEARCH',
    'SUBSCRIBE',
    'TRACE',
    'UNLOCK',
    'UNSUBSCRIBE'
  ]
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"./lib/request":70,"./lib/response":71,"builtin-status-codes":25,"url":89,"xtend":96}],69:[function(require,module,exports){
  (function (global){(function (){
  exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)
  
  exports.writableStream = isFunction(global.WritableStream)
  
  exports.abortController = isFunction(global.AbortController)
  
  // The xhr request to example.com may violate some restrictive CSP configurations,
  // so if we're running in a browser that supports `fetch`, avoid calling getXHR()
  // and assume support for certain features below.
  var xhr
  function getXHR () {
    // Cache the xhr value
    if (xhr !== undefined) return xhr
  
    if (global.XMLHttpRequest) {
      xhr = new global.XMLHttpRequest()
      // If XDomainRequest is available (ie only, where xhr might not work
      // cross domain), use the page location. Otherwise use example.com
      // Note: this doesn't actually make an http request.
      try {
        xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
      } catch(e) {
        xhr = null
      }
    } else {
      // Service workers don't have XHR
      xhr = null
    }
    return xhr
  }
  
  function checkTypeSupport (type) {
    var xhr = getXHR()
    if (!xhr) return false
    try {
      xhr.responseType = type
      return xhr.responseType === type
    } catch (e) {}
    return false
  }
  
  // If fetch is supported, then arraybuffer will be supported too. Skip calling
  // checkTypeSupport(), since that calls getXHR().
  exports.arraybuffer = exports.fetch || checkTypeSupport('arraybuffer')
  
  // These next two tests unavoidably show warnings in Chrome. Since fetch will always
  // be used if it's available, just return false for these to avoid the warnings.
  exports.msstream = !exports.fetch && checkTypeSupport('ms-stream')
  exports.mozchunkedarraybuffer = !exports.fetch && checkTypeSupport('moz-chunked-arraybuffer')
  
  // If fetch is supported, then overrideMimeType will be supported too. Skip calling
  // getXHR().
  exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)
  
  function isFunction (value) {
    return typeof value === 'function'
  }
  
  xhr = null // Help gc
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}],70:[function(require,module,exports){
  (function (process,global,Buffer){(function (){
  var capability = require('./capability')
  var inherits = require('inherits')
  var response = require('./response')
  var stream = require('readable-stream')
  
  var IncomingMessage = response.IncomingMessage
  var rStates = response.readyStates
  
  function decideMode (preferBinary, useFetch) {
    if (capability.fetch && useFetch) {
      return 'fetch'
    } else if (capability.mozchunkedarraybuffer) {
      return 'moz-chunked-arraybuffer'
    } else if (capability.msstream) {
      return 'ms-stream'
    } else if (capability.arraybuffer && preferBinary) {
      return 'arraybuffer'
    } else {
      return 'text'
    }
  }
  
  var ClientRequest = module.exports = function (opts) {
    var self = this
    stream.Writable.call(self)
  
    self._opts = opts
    self._body = []
    self._headers = {}
    if (opts.auth)
      self.setHeader('Authorization', 'Basic ' + Buffer.from(opts.auth).toString('base64'))
    Object.keys(opts.headers).forEach(function (name) {
      self.setHeader(name, opts.headers[name])
    })
  
    var preferBinary
    var useFetch = true
    if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
      // If the use of XHR should be preferred. Not typically needed.
      useFetch = false
      preferBinary = true
    } else if (opts.mode === 'prefer-streaming') {
      // If streaming is a high priority but binary compatibility and
      // the accuracy of the 'content-type' header aren't
      preferBinary = false
    } else if (opts.mode === 'allow-wrong-content-type') {
      // If streaming is more important than preserving the 'content-type' header
      preferBinary = !capability.overrideMimeType
    } else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
      // Use binary if text streaming may corrupt data or the content-type header, or for speed
      preferBinary = true
    } else {
      throw new Error('Invalid value for opts.mode')
    }
    self._mode = decideMode(preferBinary, useFetch)
    self._fetchTimer = null
    self._socketTimeout = null
    self._socketTimer = null
  
    self.on('finish', function () {
      self._onFinish()
    })
  }
  
  inherits(ClientRequest, stream.Writable)
  
  ClientRequest.prototype.setHeader = function (name, value) {
    var self = this
    var lowerName = name.toLowerCase()
    // This check is not necessary, but it prevents warnings from browsers about setting unsafe
    // headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
    // http-browserify did it, so I will too.
    if (unsafeHeaders.indexOf(lowerName) !== -1)
      return
  
    self._headers[lowerName] = {
      name: name,
      value: value
    }
  }
  
  ClientRequest.prototype.getHeader = function (name) {
    var header = this._headers[name.toLowerCase()]
    if (header)
      return header.value
    return null
  }
  
  ClientRequest.prototype.removeHeader = function (name) {
    var self = this
    delete self._headers[name.toLowerCase()]
  }
  
  ClientRequest.prototype._onFinish = function () {
    var self = this
  
    if (self._destroyed)
      return
    var opts = self._opts
  
    if ('timeout' in opts && opts.timeout !== 0) {
      self.setTimeout(opts.timeout)
    }
  
    var headersObj = self._headers
    var body = null
    if (opts.method !== 'GET' && opts.method !== 'HEAD') {
          body = new Blob(self._body, {
              type: (headersObj['content-type'] || {}).value || ''
          });
      }
  
    // create flattened list of headers
    var headersList = []
    Object.keys(headersObj).forEach(function (keyName) {
      var name = headersObj[keyName].name
      var value = headersObj[keyName].value
      if (Array.isArray(value)) {
        value.forEach(function (v) {
          headersList.push([name, v])
        })
      } else {
        headersList.push([name, value])
      }
    })
  
    if (self._mode === 'fetch') {
      var signal = null
      if (capability.abortController) {
        var controller = new AbortController()
        signal = controller.signal
        self._fetchAbortController = controller
  
        if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
          self._fetchTimer = global.setTimeout(function () {
            self.emit('requestTimeout')
            if (self._fetchAbortController)
              self._fetchAbortController.abort()
          }, opts.requestTimeout)
        }
      }
  
      global.fetch(self._opts.url, {
        method: self._opts.method,
        headers: headersList,
        body: body || undefined,
        mode: 'cors',
        credentials: opts.withCredentials ? 'include' : 'same-origin',
        signal: signal
      }).then(function (response) {
        self._fetchResponse = response
        self._resetTimers(false)
        self._connect()
      }, function (reason) {
        self._resetTimers(true)
        if (!self._destroyed)
          self.emit('error', reason)
      })
    } else {
      var xhr = self._xhr = new global.XMLHttpRequest()
      try {
        xhr.open(self._opts.method, self._opts.url, true)
      } catch (err) {
        process.nextTick(function () {
          self.emit('error', err)
        })
        return
      }
  
      // Can't set responseType on really old browsers
      if ('responseType' in xhr)
        xhr.responseType = self._mode
  
      if ('withCredentials' in xhr)
        xhr.withCredentials = !!opts.withCredentials
  
      if (self._mode === 'text' && 'overrideMimeType' in xhr)
        xhr.overrideMimeType('text/plain; charset=x-user-defined')
  
      if ('requestTimeout' in opts) {
        xhr.timeout = opts.requestTimeout
        xhr.ontimeout = function () {
          self.emit('requestTimeout')
        }
      }
  
      headersList.forEach(function (header) {
        xhr.setRequestHeader(header[0], header[1])
      })
  
      self._response = null
      xhr.onreadystatechange = function () {
        switch (xhr.readyState) {
          case rStates.LOADING:
          case rStates.DONE:
            self._onXHRProgress()
            break
        }
      }
      // Necessary for streaming in Firefox, since xhr.response is ONLY defined
      // in onprogress, not in onreadystatechange with xhr.readyState = 3
      if (self._mode === 'moz-chunked-arraybuffer') {
        xhr.onprogress = function () {
          self._onXHRProgress()
        }
      }
  
      xhr.onerror = function () {
        if (self._destroyed)
          return
        self._resetTimers(true)
        self.emit('error', new Error('XHR error'))
      }
  
      try {
        xhr.send(body)
      } catch (err) {
        process.nextTick(function () {
          self.emit('error', err)
        })
        return
      }
    }
  }
  
  /**
   * Checks if xhr.status is readable and non-zero, indicating no error.
   * Even though the spec says it should be available in readyState 3,
   * accessing it throws an exception in IE8
   */
  function statusValid (xhr) {
    try {
      var status = xhr.status
      return (status !== null && status !== 0)
    } catch (e) {
      return false
    }
  }
  
  ClientRequest.prototype._onXHRProgress = function () {
    var self = this
  
    self._resetTimers(false)
  
    if (!statusValid(self._xhr) || self._destroyed)
      return
  
    if (!self._response)
      self._connect()
  
    self._response._onXHRProgress(self._resetTimers.bind(self))
  }
  
  ClientRequest.prototype._connect = function () {
    var self = this
  
    if (self._destroyed)
      return
  
    self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._resetTimers.bind(self))
    self._response.on('error', function(err) {
      self.emit('error', err)
    })
  
    self.emit('response', self._response)
  }
  
  ClientRequest.prototype._write = function (chunk, encoding, cb) {
    var self = this
  
    self._body.push(chunk)
    cb()
  }
  
  ClientRequest.prototype._resetTimers = function (done) {
    var self = this
  
    global.clearTimeout(self._socketTimer)
    self._socketTimer = null
  
    if (done) {
      global.clearTimeout(self._fetchTimer)
      self._fetchTimer = null
    } else if (self._socketTimeout) {
      self._socketTimer = global.setTimeout(function () {
        self.emit('timeout')
      }, self._socketTimeout)
    }
  }
  
  ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function (err) {
    var self = this
    self._destroyed = true
    self._resetTimers(true)
    if (self._response)
      self._response._destroyed = true
    if (self._xhr)
      self._xhr.abort()
    else if (self._fetchAbortController)
      self._fetchAbortController.abort()
  
    if (err)
      self.emit('error', err)
  }
  
  ClientRequest.prototype.end = function (data, encoding, cb) {
    var self = this
    if (typeof data === 'function') {
      cb = data
      data = undefined
    }
  
    stream.Writable.prototype.end.call(self, data, encoding, cb)
  }
  
  ClientRequest.prototype.setTimeout = function (timeout, cb) {
    var self = this
  
    if (cb)
      self.once('timeout', cb)
  
    self._socketTimeout = timeout
    self._resetTimers(false)
  }
  
  ClientRequest.prototype.flushHeaders = function () {}
  ClientRequest.prototype.setNoDelay = function () {}
  ClientRequest.prototype.setSocketKeepAlive = function () {}
  
  // Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
  var unsafeHeaders = [
    'accept-charset',
    'accept-encoding',
    'access-control-request-headers',
    'access-control-request-method',
    'connection',
    'content-length',
    'cookie',
    'cookie2',
    'date',
    'dnt',
    'expect',
    'host',
    'keep-alive',
    'origin',
    'referer',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'via'
  ]
  
  }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
  },{"./capability":69,"./response":71,"_process":46,"buffer":24,"inherits":40,"readable-stream":86}],71:[function(require,module,exports){
  (function (process,global,Buffer){(function (){
  var capability = require('./capability')
  var inherits = require('inherits')
  var stream = require('readable-stream')
  
  var rStates = exports.readyStates = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  }
  
  var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, resetTimers) {
    var self = this
    stream.Readable.call(self)
  
    self._mode = mode
    self.headers = {}
    self.rawHeaders = []
    self.trailers = {}
    self.rawTrailers = []
  
    // Fake the 'close' event, but only once 'end' fires
    self.on('end', function () {
      // The nextTick is necessary to prevent the 'request' module from causing an infinite loop
      process.nextTick(function () {
        self.emit('close')
      })
    })
  
    if (mode === 'fetch') {
      self._fetchResponse = response
  
      self.url = response.url
      self.statusCode = response.status
      self.statusMessage = response.statusText
      
      response.headers.forEach(function (header, key){
        self.headers[key.toLowerCase()] = header
        self.rawHeaders.push(key, header)
      })
  
      if (capability.writableStream) {
        var writable = new WritableStream({
          write: function (chunk) {
            resetTimers(false)
            return new Promise(function (resolve, reject) {
              if (self._destroyed) {
                reject()
              } else if(self.push(Buffer.from(chunk))) {
                resolve()
              } else {
                self._resumeFetch = resolve
              }
            })
          },
          close: function () {
            resetTimers(true)
            if (!self._destroyed)
              self.push(null)
          },
          abort: function (err) {
            resetTimers(true)
            if (!self._destroyed)
              self.emit('error', err)
          }
        })
  
        try {
          response.body.pipeTo(writable).catch(function (err) {
            resetTimers(true)
            if (!self._destroyed)
              self.emit('error', err)
          })
          return
        } catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
      }
      // fallback for when writableStream or pipeTo aren't available
      var reader = response.body.getReader()
      function read () {
        reader.read().then(function (result) {
          if (self._destroyed)
            return
          resetTimers(result.done)
          if (result.done) {
            self.push(null)
            return
          }
          self.push(Buffer.from(result.value))
          read()
        }).catch(function (err) {
          resetTimers(true)
          if (!self._destroyed)
            self.emit('error', err)
        })
      }
      read()
    } else {
      self._xhr = xhr
      self._pos = 0
  
      self.url = xhr.responseURL
      self.statusCode = xhr.status
      self.statusMessage = xhr.statusText
      var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
      headers.forEach(function (header) {
        var matches = header.match(/^([^:]+):\s*(.*)/)
        if (matches) {
          var key = matches[1].toLowerCase()
          if (key === 'set-cookie') {
            if (self.headers[key] === undefined) {
              self.headers[key] = []
            }
            self.headers[key].push(matches[2])
          } else if (self.headers[key] !== undefined) {
            self.headers[key] += ', ' + matches[2]
          } else {
            self.headers[key] = matches[2]
          }
          self.rawHeaders.push(matches[1], matches[2])
        }
      })
  
      self._charset = 'x-user-defined'
      if (!capability.overrideMimeType) {
        var mimeType = self.rawHeaders['mime-type']
        if (mimeType) {
          var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
          if (charsetMatch) {
            self._charset = charsetMatch[1].toLowerCase()
          }
        }
        if (!self._charset)
          self._charset = 'utf-8' // best guess
      }
    }
  }
  
  inherits(IncomingMessage, stream.Readable)
  
  IncomingMessage.prototype._read = function () {
    var self = this
  
    var resolve = self._resumeFetch
    if (resolve) {
      self._resumeFetch = null
      resolve()
    }
  }
  
  IncomingMessage.prototype._onXHRProgress = function (resetTimers) {
    var self = this
  
    var xhr = self._xhr
  
    var response = null
    switch (self._mode) {
      case 'text':
        response = xhr.responseText
        if (response.length > self._pos) {
          var newData = response.substr(self._pos)
          if (self._charset === 'x-user-defined') {
            var buffer = Buffer.alloc(newData.length)
            for (var i = 0; i < newData.length; i++)
              buffer[i] = newData.charCodeAt(i) & 0xff
  
            self.push(buffer)
          } else {
            self.push(newData, self._charset)
          }
          self._pos = response.length
        }
        break
      case 'arraybuffer':
        if (xhr.readyState !== rStates.DONE || !xhr.response)
          break
        response = xhr.response
        self.push(Buffer.from(new Uint8Array(response)))
        break
      case 'moz-chunked-arraybuffer': // take whole
        response = xhr.response
        if (xhr.readyState !== rStates.LOADING || !response)
          break
        self.push(Buffer.from(new Uint8Array(response)))
        break
      case 'ms-stream':
        response = xhr.response
        if (xhr.readyState !== rStates.LOADING)
          break
        var reader = new global.MSStreamReader()
        reader.onprogress = function () {
          if (reader.result.byteLength > self._pos) {
            self.push(Buffer.from(new Uint8Array(reader.result.slice(self._pos))))
            self._pos = reader.result.byteLength
          }
        }
        reader.onload = function () {
          resetTimers(true)
          self.push(null)
        }
        // reader.onerror = ??? // TODO: this
        reader.readAsArrayBuffer(response)
        break
    }
  
    // The ms-stream case handles end separately in reader.onload()
    if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
      resetTimers(true)
      self.push(null)
    }
  }
  
  }).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
  },{"./capability":69,"_process":46,"buffer":24,"inherits":40,"readable-stream":86}],72:[function(require,module,exports){
  arguments[4][52][0].apply(exports,arguments)
  },{"dup":52}],73:[function(require,module,exports){
  arguments[4][53][0].apply(exports,arguments)
  },{"./_stream_readable":75,"./_stream_writable":77,"_process":46,"dup":53,"inherits":40}],74:[function(require,module,exports){
  arguments[4][54][0].apply(exports,arguments)
  },{"./_stream_transform":76,"dup":54,"inherits":40}],75:[function(require,module,exports){
  arguments[4][55][0].apply(exports,arguments)
  },{"../errors":72,"./_stream_duplex":73,"./internal/streams/async_iterator":78,"./internal/streams/buffer_list":79,"./internal/streams/destroy":80,"./internal/streams/from":82,"./internal/streams/state":84,"./internal/streams/stream":85,"_process":46,"buffer":24,"dup":55,"events":29,"inherits":40,"string_decoder/":88,"util":20}],76:[function(require,module,exports){
  arguments[4][56][0].apply(exports,arguments)
  },{"../errors":72,"./_stream_duplex":73,"dup":56,"inherits":40}],77:[function(require,module,exports){
  arguments[4][57][0].apply(exports,arguments)
  },{"../errors":72,"./_stream_duplex":73,"./internal/streams/destroy":80,"./internal/streams/state":84,"./internal/streams/stream":85,"_process":46,"buffer":24,"dup":57,"inherits":40,"util-deprecate":91}],78:[function(require,module,exports){
  arguments[4][58][0].apply(exports,arguments)
  },{"./end-of-stream":81,"_process":46,"dup":58}],79:[function(require,module,exports){
  arguments[4][59][0].apply(exports,arguments)
  },{"buffer":24,"dup":59,"util":20}],80:[function(require,module,exports){
  arguments[4][60][0].apply(exports,arguments)
  },{"_process":46,"dup":60}],81:[function(require,module,exports){
  arguments[4][61][0].apply(exports,arguments)
  },{"../../../errors":72,"dup":61}],82:[function(require,module,exports){
  arguments[4][62][0].apply(exports,arguments)
  },{"dup":62}],83:[function(require,module,exports){
  arguments[4][63][0].apply(exports,arguments)
  },{"../../../errors":72,"./end-of-stream":81,"dup":63}],84:[function(require,module,exports){
  arguments[4][64][0].apply(exports,arguments)
  },{"../../../errors":72,"dup":64}],85:[function(require,module,exports){
  arguments[4][65][0].apply(exports,arguments)
  },{"dup":65,"events":29}],86:[function(require,module,exports){
  exports = module.exports = require('./lib/_stream_readable.js');
  exports.Stream = exports;
  exports.Readable = exports;
  exports.Writable = require('./lib/_stream_writable.js');
  exports.Duplex = require('./lib/_stream_duplex.js');
  exports.Transform = require('./lib/_stream_transform.js');
  exports.PassThrough = require('./lib/_stream_passthrough.js');
  exports.finished = require('./lib/internal/streams/end-of-stream.js');
  exports.pipeline = require('./lib/internal/streams/pipeline.js');
  
  },{"./lib/_stream_duplex.js":73,"./lib/_stream_passthrough.js":74,"./lib/_stream_readable.js":75,"./lib/_stream_transform.js":76,"./lib/_stream_writable.js":77,"./lib/internal/streams/end-of-stream.js":81,"./lib/internal/streams/pipeline.js":83}],87:[function(require,module,exports){
  arguments[4][22][0].apply(exports,arguments)
  },{"buffer":24,"dup":22}],88:[function(require,module,exports){
  arguments[4][23][0].apply(exports,arguments)
  },{"dup":23,"safe-buffer":87}],89:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  var punycode = require('punycode');
  var util = require('./util');
  
  exports.parse = urlParse;
  exports.resolve = urlResolve;
  exports.resolveObject = urlResolveObject;
  exports.format = urlFormat;
  
  exports.Url = Url;
  
  function Url() {
    this.protocol = null;
    this.slashes = null;
    this.auth = null;
    this.host = null;
    this.port = null;
    this.hostname = null;
    this.hash = null;
    this.search = null;
    this.query = null;
    this.pathname = null;
    this.path = null;
    this.href = null;
  }
  
  // Reference: RFC 3986, RFC 1808, RFC 2396
  
  // define these here so at least they only have to be
  // compiled once on the first module load.
  var protocolPattern = /^([a-z0-9.+-]+:)/i,
      portPattern = /:[0-9]*$/,
  
      // Special case for a simple path URL
      simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
  
      // RFC 2396: characters reserved for delimiting URLs.
      // We actually just auto-escape these.
      delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
  
      // RFC 2396: characters not allowed for various reasons.
      unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
  
      // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
      autoEscape = ['\''].concat(unwise),
      // Characters that are never ever allowed in a hostname.
      // Note that any invalid chars are also handled, but these
      // are the ones that are *expected* to be seen, so we fast-path
      // them.
      nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
      hostEndingChars = ['/', '?', '#'],
      hostnameMaxLen = 255,
      hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
      hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
      // protocols that can allow "unsafe" and "unwise" chars.
      unsafeProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that never have a hostname.
      hostlessProtocol = {
        'javascript': true,
        'javascript:': true
      },
      // protocols that always contain a // bit.
      slashedProtocol = {
        'http': true,
        'https': true,
        'ftp': true,
        'gopher': true,
        'file': true,
        'http:': true,
        'https:': true,
        'ftp:': true,
        'gopher:': true,
        'file:': true
      },
      querystring = require('querystring');
  
  function urlParse(url, parseQueryString, slashesDenoteHost) {
    if (url && util.isObject(url) && url instanceof Url) return url;
  
    var u = new Url;
    u.parse(url, parseQueryString, slashesDenoteHost);
    return u;
  }
  
  Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
    if (!util.isString(url)) {
      throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
    }
  
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    var queryIndex = url.indexOf('?'),
        splitter =
            (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
        uSplit = url.split(splitter),
        slashRegex = /\\/g;
    uSplit[0] = uSplit[0].replace(slashRegex, '/');
    url = uSplit.join(splitter);
  
    var rest = url;
  
    // trim before proceeding.
    // This is to support parse stuff like "  http://foo.com  \n"
    rest = rest.trim();
  
    if (!slashesDenoteHost && url.split('#').length === 1) {
      // Try fast path regexp
      var simplePath = simplePathPattern.exec(rest);
      if (simplePath) {
        this.path = rest;
        this.href = rest;
        this.pathname = simplePath[1];
        if (simplePath[2]) {
          this.search = simplePath[2];
          if (parseQueryString) {
            this.query = querystring.parse(this.search.substr(1));
          } else {
            this.query = this.search.substr(1);
          }
        } else if (parseQueryString) {
          this.search = '';
          this.query = {};
        }
        return this;
      }
    }
  
    var proto = protocolPattern.exec(rest);
    if (proto) {
      proto = proto[0];
      var lowerProto = proto.toLowerCase();
      this.protocol = lowerProto;
      rest = rest.substr(proto.length);
    }
  
    // figure out if it's got a host
    // user@server is *always* interpreted as a hostname, and url
    // resolution will treat //foo/bar as host=foo,path=bar because that's
    // how the browser resolves relative URLs.
    if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var slashes = rest.substr(0, 2) === '//';
      if (slashes && !(proto && hostlessProtocol[proto])) {
        rest = rest.substr(2);
        this.slashes = true;
      }
    }
  
    if (!hostlessProtocol[proto] &&
        (slashes || (proto && !slashedProtocol[proto]))) {
  
      // there's a hostname.
      // the first instance of /, ?, ;, or # ends the host.
      //
      // If there is an @ in the hostname, then non-host chars *are* allowed
      // to the left of the last @ sign, unless some host-ending character
      // comes *before* the @-sign.
      // URLs are obnoxious.
      //
      // ex:
      // http://a@b@c/ => user:a@b host:c
      // http://a@b?@c => user:a host:c path:/?@c
  
      // v0.12 TODO(isaacs): This is not quite how Chrome does things.
      // Review our test case against browsers more comprehensively.
  
      // find the first instance of any hostEndingChars
      var hostEnd = -1;
      for (var i = 0; i < hostEndingChars.length; i++) {
        var hec = rest.indexOf(hostEndingChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
          hostEnd = hec;
      }
  
      // at this point, either we have an explicit point where the
      // auth portion cannot go past, or the last @ char is the decider.
      var auth, atSign;
      if (hostEnd === -1) {
        // atSign can be anywhere.
        atSign = rest.lastIndexOf('@');
      } else {
        // atSign must be in auth portion.
        // http://a@b/c@d => host:b auth:a path:/c@d
        atSign = rest.lastIndexOf('@', hostEnd);
      }
  
      // Now we have a portion which is definitely the auth.
      // Pull that off.
      if (atSign !== -1) {
        auth = rest.slice(0, atSign);
        rest = rest.slice(atSign + 1);
        this.auth = decodeURIComponent(auth);
      }
  
      // the host is the remaining to the left of the first non-host char
      hostEnd = -1;
      for (var i = 0; i < nonHostChars.length; i++) {
        var hec = rest.indexOf(nonHostChars[i]);
        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
          hostEnd = hec;
      }
      // if we still have not hit it, then the entire thing is a host.
      if (hostEnd === -1)
        hostEnd = rest.length;
  
      this.host = rest.slice(0, hostEnd);
      rest = rest.slice(hostEnd);
  
      // pull out port.
      this.parseHost();
  
      // we've indicated that there is a hostname,
      // so even if it's empty, it has to be present.
      this.hostname = this.hostname || '';
  
      // if hostname begins with [ and ends with ]
      // assume that it's an IPv6 address.
      var ipv6Hostname = this.hostname[0] === '[' &&
          this.hostname[this.hostname.length - 1] === ']';
  
      // validate a little.
      if (!ipv6Hostname) {
        var hostparts = this.hostname.split(/\./);
        for (var i = 0, l = hostparts.length; i < l; i++) {
          var part = hostparts[i];
          if (!part) continue;
          if (!part.match(hostnamePartPattern)) {
            var newpart = '';
            for (var j = 0, k = part.length; j < k; j++) {
              if (part.charCodeAt(j) > 127) {
                // we replace non-ASCII char with a temporary placeholder
                // we need this to make sure size of hostname is not
                // broken by replacing non-ASCII by nothing
                newpart += 'x';
              } else {
                newpart += part[j];
              }
            }
            // we test again with ASCII char only
            if (!newpart.match(hostnamePartPattern)) {
              var validParts = hostparts.slice(0, i);
              var notHost = hostparts.slice(i + 1);
              var bit = part.match(hostnamePartStart);
              if (bit) {
                validParts.push(bit[1]);
                notHost.unshift(bit[2]);
              }
              if (notHost.length) {
                rest = '/' + notHost.join('.') + rest;
              }
              this.hostname = validParts.join('.');
              break;
            }
          }
        }
      }
  
      if (this.hostname.length > hostnameMaxLen) {
        this.hostname = '';
      } else {
        // hostnames are always lower case.
        this.hostname = this.hostname.toLowerCase();
      }
  
      if (!ipv6Hostname) {
        // IDNA Support: Returns a punycoded representation of "domain".
        // It only converts parts of the domain name that
        // have non-ASCII characters, i.e. it doesn't matter if
        // you call it with a domain that already is ASCII-only.
        this.hostname = punycode.toASCII(this.hostname);
      }
  
      var p = this.port ? ':' + this.port : '';
      var h = this.hostname || '';
      this.host = h + p;
      this.href += this.host;
  
      // strip [ and ] from the hostname
      // the host field still retains them, though
      if (ipv6Hostname) {
        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
        if (rest[0] !== '/') {
          rest = '/' + rest;
        }
      }
    }
  
    // now rest is set to the post-host stuff.
    // chop off any delim chars.
    if (!unsafeProtocol[lowerProto]) {
  
      // First, make 100% sure that any "autoEscape" chars get
      // escaped, even if encodeURIComponent doesn't think they
      // need to be.
      for (var i = 0, l = autoEscape.length; i < l; i++) {
        var ae = autoEscape[i];
        if (rest.indexOf(ae) === -1)
          continue;
        var esc = encodeURIComponent(ae);
        if (esc === ae) {
          esc = escape(ae);
        }
        rest = rest.split(ae).join(esc);
      }
    }
  
  
    // chop off from the tail first.
    var hash = rest.indexOf('#');
    if (hash !== -1) {
      // got a fragment string.
      this.hash = rest.substr(hash);
      rest = rest.slice(0, hash);
    }
    var qm = rest.indexOf('?');
    if (qm !== -1) {
      this.search = rest.substr(qm);
      this.query = rest.substr(qm + 1);
      if (parseQueryString) {
        this.query = querystring.parse(this.query);
      }
      rest = rest.slice(0, qm);
    } else if (parseQueryString) {
      // no query string, but parseQueryString still requested
      this.search = '';
      this.query = {};
    }
    if (rest) this.pathname = rest;
    if (slashedProtocol[lowerProto] &&
        this.hostname && !this.pathname) {
      this.pathname = '/';
    }
  
    //to support http.request
    if (this.pathname || this.search) {
      var p = this.pathname || '';
      var s = this.search || '';
      this.path = p + s;
    }
  
    // finally, reconstruct the href based on what has been validated.
    this.href = this.format();
    return this;
  };
  
  // format a parsed object into a url string
  function urlFormat(obj) {
    // ensure it's an object, and not a string url.
    // If it's an obj, this is a no-op.
    // this way, you can call url_format() on strings
    // to clean up potentially wonky urls.
    if (util.isString(obj)) obj = urlParse(obj);
    if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
    return obj.format();
  }
  
  Url.prototype.format = function() {
    var auth = this.auth || '';
    if (auth) {
      auth = encodeURIComponent(auth);
      auth = auth.replace(/%3A/i, ':');
      auth += '@';
    }
  
    var protocol = this.protocol || '',
        pathname = this.pathname || '',
        hash = this.hash || '',
        host = false,
        query = '';
  
    if (this.host) {
      host = auth + this.host;
    } else if (this.hostname) {
      host = auth + (this.hostname.indexOf(':') === -1 ?
          this.hostname :
          '[' + this.hostname + ']');
      if (this.port) {
        host += ':' + this.port;
      }
    }
  
    if (this.query &&
        util.isObject(this.query) &&
        Object.keys(this.query).length) {
      query = querystring.stringify(this.query);
    }
  
    var search = this.search || (query && ('?' + query)) || '';
  
    if (protocol && protocol.substr(-1) !== ':') protocol += ':';
  
    // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
    // unless they had them to begin with.
    if (this.slashes ||
        (!protocol || slashedProtocol[protocol]) && host !== false) {
      host = '//' + (host || '');
      if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
    } else if (!host) {
      host = '';
    }
  
    if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
    if (search && search.charAt(0) !== '?') search = '?' + search;
  
    pathname = pathname.replace(/[?#]/g, function(match) {
      return encodeURIComponent(match);
    });
    search = search.replace('#', '%23');
  
    return protocol + host + pathname + search + hash;
  };
  
  function urlResolve(source, relative) {
    return urlParse(source, false, true).resolve(relative);
  }
  
  Url.prototype.resolve = function(relative) {
    return this.resolveObject(urlParse(relative, false, true)).format();
  };
  
  function urlResolveObject(source, relative) {
    if (!source) return relative;
    return urlParse(source, false, true).resolveObject(relative);
  }
  
  Url.prototype.resolveObject = function(relative) {
    if (util.isString(relative)) {
      var rel = new Url();
      rel.parse(relative, false, true);
      relative = rel;
    }
  
    var result = new Url();
    var tkeys = Object.keys(this);
    for (var tk = 0; tk < tkeys.length; tk++) {
      var tkey = tkeys[tk];
      result[tkey] = this[tkey];
    }
  
    // hash is always overridden, no matter what.
    // even href="" will remove it.
    result.hash = relative.hash;
  
    // if the relative url is empty, then there's nothing left to do here.
    if (relative.href === '') {
      result.href = result.format();
      return result;
    }
  
    // hrefs like //foo/bar always cut to the protocol.
    if (relative.slashes && !relative.protocol) {
      // take everything except the protocol from relative
      var rkeys = Object.keys(relative);
      for (var rk = 0; rk < rkeys.length; rk++) {
        var rkey = rkeys[rk];
        if (rkey !== 'protocol')
          result[rkey] = relative[rkey];
      }
  
      //urlParse appends trailing / to urls like http://www.example.com
      if (slashedProtocol[result.protocol] &&
          result.hostname && !result.pathname) {
        result.path = result.pathname = '/';
      }
  
      result.href = result.format();
      return result;
    }
  
    if (relative.protocol && relative.protocol !== result.protocol) {
      // if it's a known url protocol, then changing
      // the protocol does weird things
      // first, if it's not file:, then we MUST have a host,
      // and if there was a path
      // to begin with, then we MUST have a path.
      // if it is file:, then the host is dropped,
      // because that's known to be hostless.
      // anything else is assumed to be absolute.
      if (!slashedProtocol[relative.protocol]) {
        var keys = Object.keys(relative);
        for (var v = 0; v < keys.length; v++) {
          var k = keys[v];
          result[k] = relative[k];
        }
        result.href = result.format();
        return result;
      }
  
      result.protocol = relative.protocol;
      if (!relative.host && !hostlessProtocol[relative.protocol]) {
        var relPath = (relative.pathname || '').split('/');
        while (relPath.length && !(relative.host = relPath.shift()));
        if (!relative.host) relative.host = '';
        if (!relative.hostname) relative.hostname = '';
        if (relPath[0] !== '') relPath.unshift('');
        if (relPath.length < 2) relPath.unshift('');
        result.pathname = relPath.join('/');
      } else {
        result.pathname = relative.pathname;
      }
      result.search = relative.search;
      result.query = relative.query;
      result.host = relative.host || '';
      result.auth = relative.auth;
      result.hostname = relative.hostname || relative.host;
      result.port = relative.port;
      // to support http.request
      if (result.pathname || result.search) {
        var p = result.pathname || '';
        var s = result.search || '';
        result.path = p + s;
      }
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    }
  
    var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
        isRelAbs = (
            relative.host ||
            relative.pathname && relative.pathname.charAt(0) === '/'
        ),
        mustEndAbs = (isRelAbs || isSourceAbs ||
                      (result.host && relative.pathname)),
        removeAllDots = mustEndAbs,
        srcPath = result.pathname && result.pathname.split('/') || [],
        relPath = relative.pathname && relative.pathname.split('/') || [],
        psychotic = result.protocol && !slashedProtocol[result.protocol];
  
    // if the url is a non-slashed url, then relative
    // links like ../.. should be able
    // to crawl up to the hostname, as well.  This is strange.
    // result.protocol has already been set by now.
    // Later on, put the first path part into the host field.
    if (psychotic) {
      result.hostname = '';
      result.port = null;
      if (result.host) {
        if (srcPath[0] === '') srcPath[0] = result.host;
        else srcPath.unshift(result.host);
      }
      result.host = '';
      if (relative.protocol) {
        relative.hostname = null;
        relative.port = null;
        if (relative.host) {
          if (relPath[0] === '') relPath[0] = relative.host;
          else relPath.unshift(relative.host);
        }
        relative.host = null;
      }
      mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
    }
  
    if (isRelAbs) {
      // it's absolute.
      result.host = (relative.host || relative.host === '') ?
                    relative.host : result.host;
      result.hostname = (relative.hostname || relative.hostname === '') ?
                        relative.hostname : result.hostname;
      result.search = relative.search;
      result.query = relative.query;
      srcPath = relPath;
      // fall through to the dot-handling below.
    } else if (relPath.length) {
      // it's relative
      // throw away the existing file, and take the new path instead.
      if (!srcPath) srcPath = [];
      srcPath.pop();
      srcPath = srcPath.concat(relPath);
      result.search = relative.search;
      result.query = relative.query;
    } else if (!util.isNullOrUndefined(relative.search)) {
      // just pull out the search.
      // like href='?foo'.
      // Put this after the other two cases because it simplifies the booleans
      if (psychotic) {
        result.hostname = result.host = srcPath.shift();
        //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ?
                         result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      result.search = relative.search;
      result.query = relative.query;
      //to support http.request
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') +
                      (result.search ? result.search : '');
      }
      result.href = result.format();
      return result;
    }
  
    if (!srcPath.length) {
      // no path at all.  easy.
      // we've already handled the other stuff above.
      result.pathname = null;
      //to support http.request
      if (result.search) {
        result.path = '/' + result.search;
      } else {
        result.path = null;
      }
      result.href = result.format();
      return result;
    }
  
    // if a url ENDs in . or .., then it must get a trailing slash.
    // however, if it ends in anything else non-slashy,
    // then it must NOT get a trailing slash.
    var last = srcPath.slice(-1)[0];
    var hasTrailingSlash = (
        (result.host || relative.host || srcPath.length > 1) &&
        (last === '.' || last === '..') || last === '');
  
    // strip single dots, resolve double dots to parent dir
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = srcPath.length; i >= 0; i--) {
      last = srcPath[i];
      if (last === '.') {
        srcPath.splice(i, 1);
      } else if (last === '..') {
        srcPath.splice(i, 1);
        up++;
      } else if (up) {
        srcPath.splice(i, 1);
        up--;
      }
    }
  
    // if the path is allowed to go above the root, restore leading ..s
    if (!mustEndAbs && !removeAllDots) {
      for (; up--; up) {
        srcPath.unshift('..');
      }
    }
  
    if (mustEndAbs && srcPath[0] !== '' &&
        (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
      srcPath.unshift('');
    }
  
    if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
      srcPath.push('');
    }
  
    var isAbsolute = srcPath[0] === '' ||
        (srcPath[0] && srcPath[0].charAt(0) === '/');
  
    // put the host back
    if (psychotic) {
      result.hostname = result.host = isAbsolute ? '' :
                                      srcPath.length ? srcPath.shift() : '';
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
  
    mustEndAbs = mustEndAbs || (result.host && srcPath.length);
  
    if (mustEndAbs && !isAbsolute) {
      srcPath.unshift('');
    }
  
    if (!srcPath.length) {
      result.pathname = null;
      result.path = null;
    } else {
      result.pathname = srcPath.join('/');
    }
  
    //to support request.http
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.auth = relative.auth || result.auth;
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  };
  
  Url.prototype.parseHost = function() {
    var host = this.host;
    var port = portPattern.exec(host);
    if (port) {
      port = port[0];
      if (port !== ':') {
        this.port = port.substr(1);
      }
      host = host.substr(0, host.length - port.length);
    }
    if (host) this.hostname = host;
  };
  
  },{"./util":90,"punycode":47,"querystring":50}],90:[function(require,module,exports){
  'use strict';
  
  module.exports = {
    isString: function(arg) {
      return typeof(arg) === 'string';
    },
    isObject: function(arg) {
      return typeof(arg) === 'object' && arg !== null;
    },
    isNull: function(arg) {
      return arg === null;
    },
    isNullOrUndefined: function(arg) {
      return arg == null;
    }
  };
  
  },{}],91:[function(require,module,exports){
  (function (global){(function (){
  
  /**
   * Module exports.
   */
  
  module.exports = deprecate;
  
  /**
   * Mark that a method should not be used.
   * Returns a modified function which warns once by default.
   *
   * If `localStorage.noDeprecation = true` is set, then it is a no-op.
   *
   * If `localStorage.throwDeprecation = true` is set, then deprecated functions
   * will throw an Error when invoked.
   *
   * If `localStorage.traceDeprecation = true` is set, then deprecated functions
   * will invoke `console.trace()` instead of `console.error()`.
   *
   * @param {Function} fn - the function to deprecate
   * @param {String} msg - the string to print to the console when `fn` is invoked
   * @returns {Function} a new "deprecated" version of `fn`
   * @api public
   */
  
  function deprecate (fn, msg) {
    if (config('noDeprecation')) {
      return fn;
    }
  
    var warned = false;
    function deprecated() {
      if (!warned) {
        if (config('throwDeprecation')) {
          throw new Error(msg);
        } else if (config('traceDeprecation')) {
          console.trace(msg);
        } else {
          console.warn(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }
  
    return deprecated;
  }
  
  /**
   * Checks `localStorage` for boolean values for the given `name`.
   *
   * @param {String} name
   * @returns {Boolean}
   * @api private
   */
  
  function config (name) {
    // accessing global.localStorage can trigger a DOMException in sandboxed iframes
    try {
      if (!global.localStorage) return false;
    } catch (_) {
      return false;
    }
    var val = global.localStorage[name];
    if (null == val) return false;
    return String(val).toLowerCase() === 'true';
  }
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}],92:[function(require,module,exports){
  arguments[4][16][0].apply(exports,arguments)
  },{"dup":16}],93:[function(require,module,exports){
  // Currently in sync with Node.js lib/internal/util/types.js
  // https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9
  
  'use strict';
  
  var isArgumentsObject = require('is-arguments');
  var isGeneratorFunction = require('is-generator-function');
  var whichTypedArray = require('which-typed-array');
  var isTypedArray = require('is-typed-array');
  
  function uncurryThis(f) {
    return f.call.bind(f);
  }
  
  var BigIntSupported = typeof BigInt !== 'undefined';
  var SymbolSupported = typeof Symbol !== 'undefined';
  
  var ObjectToString = uncurryThis(Object.prototype.toString);
  
  var numberValue = uncurryThis(Number.prototype.valueOf);
  var stringValue = uncurryThis(String.prototype.valueOf);
  var booleanValue = uncurryThis(Boolean.prototype.valueOf);
  
  if (BigIntSupported) {
    var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
  }
  
  if (SymbolSupported) {
    var symbolValue = uncurryThis(Symbol.prototype.valueOf);
  }
  
  function checkBoxedPrimitive(value, prototypeValueOf) {
    if (typeof value !== 'object') {
      return false;
    }
    try {
      prototypeValueOf(value);
      return true;
    } catch(e) {
      return false;
    }
  }
  
  exports.isArgumentsObject = isArgumentsObject;
  exports.isGeneratorFunction = isGeneratorFunction;
  exports.isTypedArray = isTypedArray;
  
  // Taken from here and modified for better browser support
  // https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
  function isPromise(input) {
    return (
      (
        typeof Promise !== 'undefined' &&
        input instanceof Promise
      ) ||
      (
        input !== null &&
        typeof input === 'object' &&
        typeof input.then === 'function' &&
        typeof input.catch === 'function'
      )
    );
  }
  exports.isPromise = isPromise;
  
  function isArrayBufferView(value) {
    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
      return ArrayBuffer.isView(value);
    }
  
    return (
      isTypedArray(value) ||
      isDataView(value)
    );
  }
  exports.isArrayBufferView = isArrayBufferView;
  
  
  function isUint8Array(value) {
    return whichTypedArray(value) === 'Uint8Array';
  }
  exports.isUint8Array = isUint8Array;
  
  function isUint8ClampedArray(value) {
    return whichTypedArray(value) === 'Uint8ClampedArray';
  }
  exports.isUint8ClampedArray = isUint8ClampedArray;
  
  function isUint16Array(value) {
    return whichTypedArray(value) === 'Uint16Array';
  }
  exports.isUint16Array = isUint16Array;
  
  function isUint32Array(value) {
    return whichTypedArray(value) === 'Uint32Array';
  }
  exports.isUint32Array = isUint32Array;
  
  function isInt8Array(value) {
    return whichTypedArray(value) === 'Int8Array';
  }
  exports.isInt8Array = isInt8Array;
  
  function isInt16Array(value) {
    return whichTypedArray(value) === 'Int16Array';
  }
  exports.isInt16Array = isInt16Array;
  
  function isInt32Array(value) {
    return whichTypedArray(value) === 'Int32Array';
  }
  exports.isInt32Array = isInt32Array;
  
  function isFloat32Array(value) {
    return whichTypedArray(value) === 'Float32Array';
  }
  exports.isFloat32Array = isFloat32Array;
  
  function isFloat64Array(value) {
    return whichTypedArray(value) === 'Float64Array';
  }
  exports.isFloat64Array = isFloat64Array;
  
  function isBigInt64Array(value) {
    return whichTypedArray(value) === 'BigInt64Array';
  }
  exports.isBigInt64Array = isBigInt64Array;
  
  function isBigUint64Array(value) {
    return whichTypedArray(value) === 'BigUint64Array';
  }
  exports.isBigUint64Array = isBigUint64Array;
  
  function isMapToString(value) {
    return ObjectToString(value) === '[object Map]';
  }
  isMapToString.working = (
    typeof Map !== 'undefined' &&
    isMapToString(new Map())
  );
  
  function isMap(value) {
    if (typeof Map === 'undefined') {
      return false;
    }
  
    return isMapToString.working
      ? isMapToString(value)
      : value instanceof Map;
  }
  exports.isMap = isMap;
  
  function isSetToString(value) {
    return ObjectToString(value) === '[object Set]';
  }
  isSetToString.working = (
    typeof Set !== 'undefined' &&
    isSetToString(new Set())
  );
  function isSet(value) {
    if (typeof Set === 'undefined') {
      return false;
    }
  
    return isSetToString.working
      ? isSetToString(value)
      : value instanceof Set;
  }
  exports.isSet = isSet;
  
  function isWeakMapToString(value) {
    return ObjectToString(value) === '[object WeakMap]';
  }
  isWeakMapToString.working = (
    typeof WeakMap !== 'undefined' &&
    isWeakMapToString(new WeakMap())
  );
  function isWeakMap(value) {
    if (typeof WeakMap === 'undefined') {
      return false;
    }
  
    return isWeakMapToString.working
      ? isWeakMapToString(value)
      : value instanceof WeakMap;
  }
  exports.isWeakMap = isWeakMap;
  
  function isWeakSetToString(value) {
    return ObjectToString(value) === '[object WeakSet]';
  }
  isWeakSetToString.working = (
    typeof WeakSet !== 'undefined' &&
    isWeakSetToString(new WeakSet())
  );
  function isWeakSet(value) {
    return isWeakSetToString(value);
  }
  exports.isWeakSet = isWeakSet;
  
  function isArrayBufferToString(value) {
    return ObjectToString(value) === '[object ArrayBuffer]';
  }
  isArrayBufferToString.working = (
    typeof ArrayBuffer !== 'undefined' &&
    isArrayBufferToString(new ArrayBuffer())
  );
  function isArrayBuffer(value) {
    if (typeof ArrayBuffer === 'undefined') {
      return false;
    }
  
    return isArrayBufferToString.working
      ? isArrayBufferToString(value)
      : value instanceof ArrayBuffer;
  }
  exports.isArrayBuffer = isArrayBuffer;
  
  function isDataViewToString(value) {
    return ObjectToString(value) === '[object DataView]';
  }
  isDataViewToString.working = (
    typeof ArrayBuffer !== 'undefined' &&
    typeof DataView !== 'undefined' &&
    isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
  );
  function isDataView(value) {
    if (typeof DataView === 'undefined') {
      return false;
    }
  
    return isDataViewToString.working
      ? isDataViewToString(value)
      : value instanceof DataView;
  }
  exports.isDataView = isDataView;
  
  // Store a copy of SharedArrayBuffer in case it's deleted elsewhere
  var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
  function isSharedArrayBufferToString(value) {
    return ObjectToString(value) === '[object SharedArrayBuffer]';
  }
  function isSharedArrayBuffer(value) {
    if (typeof SharedArrayBufferCopy === 'undefined') {
      return false;
    }
  
    if (typeof isSharedArrayBufferToString.working === 'undefined') {
      isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
    }
  
    return isSharedArrayBufferToString.working
      ? isSharedArrayBufferToString(value)
      : value instanceof SharedArrayBufferCopy;
  }
  exports.isSharedArrayBuffer = isSharedArrayBuffer;
  
  function isAsyncFunction(value) {
    return ObjectToString(value) === '[object AsyncFunction]';
  }
  exports.isAsyncFunction = isAsyncFunction;
  
  function isMapIterator(value) {
    return ObjectToString(value) === '[object Map Iterator]';
  }
  exports.isMapIterator = isMapIterator;
  
  function isSetIterator(value) {
    return ObjectToString(value) === '[object Set Iterator]';
  }
  exports.isSetIterator = isSetIterator;
  
  function isGeneratorObject(value) {
    return ObjectToString(value) === '[object Generator]';
  }
  exports.isGeneratorObject = isGeneratorObject;
  
  function isWebAssemblyCompiledModule(value) {
    return ObjectToString(value) === '[object WebAssembly.Module]';
  }
  exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
  
  function isNumberObject(value) {
    return checkBoxedPrimitive(value, numberValue);
  }
  exports.isNumberObject = isNumberObject;
  
  function isStringObject(value) {
    return checkBoxedPrimitive(value, stringValue);
  }
  exports.isStringObject = isStringObject;
  
  function isBooleanObject(value) {
    return checkBoxedPrimitive(value, booleanValue);
  }
  exports.isBooleanObject = isBooleanObject;
  
  function isBigIntObject(value) {
    return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
  }
  exports.isBigIntObject = isBigIntObject;
  
  function isSymbolObject(value) {
    return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
  }
  exports.isSymbolObject = isSymbolObject;
  
  function isBoxedPrimitive(value) {
    return (
      isNumberObject(value) ||
      isStringObject(value) ||
      isBooleanObject(value) ||
      isBigIntObject(value) ||
      isSymbolObject(value)
    );
  }
  exports.isBoxedPrimitive = isBoxedPrimitive;
  
  function isAnyArrayBuffer(value) {
    return typeof Uint8Array !== 'undefined' && (
      isArrayBuffer(value) ||
      isSharedArrayBuffer(value)
    );
  }
  exports.isAnyArrayBuffer = isAnyArrayBuffer;
  
  ['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
    Object.defineProperty(exports, method, {
      enumerable: false,
      value: function() {
        throw new Error(method + ' is not supported in userland');
      }
    });
  });
  
  },{"is-arguments":41,"is-generator-function":42,"is-typed-array":43,"which-typed-array":95}],94:[function(require,module,exports){
  (function (process){(function (){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
    function getOwnPropertyDescriptors(obj) {
      var keys = Object.keys(obj);
      var descriptors = {};
      for (var i = 0; i < keys.length; i++) {
        descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
      }
      return descriptors;
    };
  
  var formatRegExp = /%[sdj%]/g;
  exports.format = function(f) {
    if (!isString(f)) {
      var objects = [];
      for (var i = 0; i < arguments.length; i++) {
        objects.push(inspect(arguments[i]));
      }
      return objects.join(' ');
    }
  
    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
        default:
          return x;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      if (isNull(x) || !isObject(x)) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }
    return str;
  };
  
  
  // Mark that a method should not be used.
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.
  exports.deprecate = function(fn, msg) {
    if (typeof process !== 'undefined' && process.noDeprecation === true) {
      return fn;
    }
  
    // Allow for deprecating things in the process of starting up.
    if (typeof process === 'undefined') {
      return function() {
        return exports.deprecate(fn, msg).apply(this, arguments);
      };
    }
  
    var warned = false;
    function deprecated() {
      if (!warned) {
        if (process.throwDeprecation) {
          throw new Error(msg);
        } else if (process.traceDeprecation) {
          console.trace(msg);
        } else {
          console.error(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }
  
    return deprecated;
  };
  
  
  var debugs = {};
  var debugEnvRegex = /^$/;
  
  if (process.env.NODE_DEBUG) {
    var debugEnv = process.env.NODE_DEBUG;
    debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/,/g, '$|^')
      .toUpperCase();
    debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
  }
  exports.debuglog = function(set) {
    set = set.toUpperCase();
    if (!debugs[set]) {
      if (debugEnvRegex.test(set)) {
        var pid = process.pid;
        debugs[set] = function() {
          var msg = exports.format.apply(exports, arguments);
          console.error('%s %d: %s', set, pid, msg);
        };
      } else {
        debugs[set] = function() {};
      }
    }
    return debugs[set];
  };
  
  
  /**
   * Echos the value of a value. Trys to print the value out
   * in the best way possible given the different types.
   *
   * @param {Object} obj The object to print out.
   * @param {Object} opts Optional options object that alters the output.
   */
  /* legacy: obj, showHidden, depth, colors*/
  function inspect(obj, opts) {
    // default options
    var ctx = {
      seen: [],
      stylize: stylizeNoColor
    };
    // legacy...
    if (arguments.length >= 3) ctx.depth = arguments[2];
    if (arguments.length >= 4) ctx.colors = arguments[3];
    if (isBoolean(opts)) {
      // legacy...
      ctx.showHidden = opts;
    } else if (opts) {
      // got an "options" object
      exports._extend(ctx, opts);
    }
    // set default options
    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
    if (isUndefined(ctx.depth)) ctx.depth = 2;
    if (isUndefined(ctx.colors)) ctx.colors = false;
    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    return formatValue(ctx, obj, ctx.depth);
  }
  exports.inspect = inspect;
  
  
  // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
  inspect.colors = {
    'bold' : [1, 22],
    'italic' : [3, 23],
    'underline' : [4, 24],
    'inverse' : [7, 27],
    'white' : [37, 39],
    'grey' : [90, 39],
    'black' : [30, 39],
    'blue' : [34, 39],
    'cyan' : [36, 39],
    'green' : [32, 39],
    'magenta' : [35, 39],
    'red' : [31, 39],
    'yellow' : [33, 39]
  };
  
  // Don't use 'blue' not visible on cmd.exe
  inspect.styles = {
    'special': 'cyan',
    'number': 'yellow',
    'boolean': 'yellow',
    'undefined': 'grey',
    'null': 'bold',
    'string': 'green',
    'date': 'magenta',
    // "name": intentionally not styling
    'regexp': 'red'
  };
  
  
  function stylizeWithColor(str, styleType) {
    var style = inspect.styles[styleType];
  
    if (style) {
      return '\u001b[' + inspect.colors[style][0] + 'm' + str +
             '\u001b[' + inspect.colors[style][1] + 'm';
    } else {
      return str;
    }
  }
  
  
  function stylizeNoColor(str, styleType) {
    return str;
  }
  
  
  function arrayToHash(array) {
    var hash = {};
  
    array.forEach(function(val, idx) {
      hash[val] = true;
    });
  
    return hash;
  }
  
  
  function formatValue(ctx, value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (ctx.customInspect &&
        value &&
        isFunction(value.inspect) &&
        // Filter out the util module, it's inspect function is special
        value.inspect !== exports.inspect &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      var ret = value.inspect(recurseTimes, ctx);
      if (!isString(ret)) {
        ret = formatValue(ctx, ret, recurseTimes);
      }
      return ret;
    }
  
    // Primitive types cannot have properties
    var primitive = formatPrimitive(ctx, value);
    if (primitive) {
      return primitive;
    }
  
    // Look up the keys of the object.
    var keys = Object.keys(value);
    var visibleKeys = arrayToHash(keys);
  
    if (ctx.showHidden) {
      keys = Object.getOwnPropertyNames(value);
    }
  
    // IE doesn't make error fields non-enumerable
    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
    if (isError(value)
        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
      return formatError(value);
    }
  
    // Some type of object without properties can be shortcutted.
    if (keys.length === 0) {
      if (isFunction(value)) {
        var name = value.name ? ': ' + value.name : '';
        return ctx.stylize('[Function' + name + ']', 'special');
      }
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      }
      if (isDate(value)) {
        return ctx.stylize(Date.prototype.toString.call(value), 'date');
      }
      if (isError(value)) {
        return formatError(value);
      }
    }
  
    var base = '', array = false, braces = ['{', '}'];
  
    // Make Array say that they are Array
    if (isArray(value)) {
      array = true;
      braces = ['[', ']'];
    }
  
    // Make functions say that they are functions
    if (isFunction(value)) {
      var n = value.name ? ': ' + value.name : '';
      base = ' [Function' + n + ']';
    }
  
    // Make RegExps say that they are RegExps
    if (isRegExp(value)) {
      base = ' ' + RegExp.prototype.toString.call(value);
    }
  
    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + Date.prototype.toUTCString.call(value);
    }
  
    // Make error with message first say the error
    if (isError(value)) {
      base = ' ' + formatError(value);
    }
  
    if (keys.length === 0 && (!array || value.length == 0)) {
      return braces[0] + base + braces[1];
    }
  
    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
      } else {
        return ctx.stylize('[Object]', 'special');
      }
    }
  
    ctx.seen.push(value);
  
    var output;
    if (array) {
      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
    } else {
      output = keys.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });
    }
  
    ctx.seen.pop();
  
    return reduceToSingleString(output, base, braces);
  }
  
  
  function formatPrimitive(ctx, value) {
    if (isUndefined(value))
      return ctx.stylize('undefined', 'undefined');
    if (isString(value)) {
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');
    }
    if (isNumber(value))
      return ctx.stylize('' + value, 'number');
    if (isBoolean(value))
      return ctx.stylize('' + value, 'boolean');
    // For some reason typeof null is "object", so special case here.
    if (isNull(value))
      return ctx.stylize('null', 'null');
  }
  
  
  function formatError(value) {
    return '[' + Error.prototype.toString.call(value) + ']';
  }
  
  
  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
    var output = [];
    for (var i = 0, l = value.length; i < l; ++i) {
      if (hasOwnProperty(value, String(i))) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            String(i), true));
      } else {
        output.push('');
      }
    }
    keys.forEach(function(key) {
      if (!key.match(/^\d+$/)) {
        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
            key, true));
      }
    });
    return output;
  }
  
  
  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
    var name, str, desc;
    desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
    if (desc.get) {
      if (desc.set) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (desc.set) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
    if (!hasOwnProperty(visibleKeys, key)) {
      name = '[' + key + ']';
    }
    if (!str) {
      if (ctx.seen.indexOf(desc.value) < 0) {
        if (isNull(recurseTimes)) {
          str = formatValue(ctx, desc.value, null);
        } else {
          str = formatValue(ctx, desc.value, recurseTimes - 1);
        }
        if (str.indexOf('\n') > -1) {
          if (array) {
            str = str.split('\n').map(function(line) {
              return '  ' + line;
            }).join('\n').substr(2);
          } else {
            str = '\n' + str.split('\n').map(function(line) {
              return '   ' + line;
            }).join('\n');
          }
        }
      } else {
        str = ctx.stylize('[Circular]', 'special');
      }
    }
    if (isUndefined(name)) {
      if (array && key.match(/^\d+$/)) {
        return str;
      }
      name = JSON.stringify('' + key);
      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
        name = name.substr(1, name.length - 2);
        name = ctx.stylize(name, 'name');
      } else {
        name = name.replace(/'/g, "\\'")
                   .replace(/\\"/g, '"')
                   .replace(/(^"|"$)/g, "'");
        name = ctx.stylize(name, 'string');
      }
    }
  
    return name + ': ' + str;
  }
  
  
  function reduceToSingleString(output, base, braces) {
    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
  
    if (length > 60) {
      return braces[0] +
             (base === '' ? '' : base + '\n ') +
             ' ' +
             output.join(',\n  ') +
             ' ' +
             braces[1];
    }
  
    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
  }
  
  
  // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.
  exports.types = require('./support/types');
  
  function isArray(ar) {
    return Array.isArray(ar);
  }
  exports.isArray = isArray;
  
  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }
  exports.isBoolean = isBoolean;
  
  function isNull(arg) {
    return arg === null;
  }
  exports.isNull = isNull;
  
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports.isNullOrUndefined = isNullOrUndefined;
  
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  exports.isNumber = isNumber;
  
  function isString(arg) {
    return typeof arg === 'string';
  }
  exports.isString = isString;
  
  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }
  exports.isSymbol = isSymbol;
  
  function isUndefined(arg) {
    return arg === void 0;
  }
  exports.isUndefined = isUndefined;
  
  function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
  }
  exports.isRegExp = isRegExp;
  exports.types.isRegExp = isRegExp;
  
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  exports.isObject = isObject;
  
  function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
  }
  exports.isDate = isDate;
  exports.types.isDate = isDate;
  
  function isError(e) {
    return isObject(e) &&
        (objectToString(e) === '[object Error]' || e instanceof Error);
  }
  exports.isError = isError;
  exports.types.isNativeError = isError;
  
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  exports.isFunction = isFunction;
  
  function isPrimitive(arg) {
    return arg === null ||
           typeof arg === 'boolean' ||
           typeof arg === 'number' ||
           typeof arg === 'string' ||
           typeof arg === 'symbol' ||  // ES6 symbol
           typeof arg === 'undefined';
  }
  exports.isPrimitive = isPrimitive;
  
  exports.isBuffer = require('./support/isBuffer');
  
  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }
  
  
  function pad(n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
  }
  
  
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'];
  
  // 26 Feb 16:19:34
  function timestamp() {
    var d = new Date();
    var time = [pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds())].join(':');
    return [d.getDate(), months[d.getMonth()], time].join(' ');
  }
  
  
  // log is just a thin wrapper to console.log that prepends a timestamp
  exports.log = function() {
    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
  };
  
  
  /**
   * Inherit the prototype methods from one constructor into another.
   *
   * The Function.prototype.inherits from lang.js rewritten as a standalone
   * function (not on Function.prototype). NOTE: If this file is to be loaded
   * during bootstrapping this function needs to be rewritten using some native
   * functions as prototype setup using normal JavaScript does not work as
   * expected during bootstrapping (see mirror.js in r114903).
   *
   * @param {function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {function} superCtor Constructor function to inherit prototype from.
   */
  exports.inherits = require('inherits');
  
  exports._extend = function(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;
  
    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  };
  
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  
  var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;
  
  exports.promisify = function promisify(original) {
    if (typeof original !== 'function')
      throw new TypeError('The "original" argument must be of type Function');
  
    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
      var fn = original[kCustomPromisifiedSymbol];
      if (typeof fn !== 'function') {
        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
      }
      Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn, enumerable: false, writable: false, configurable: true
      });
      return fn;
    }
  
    function fn() {
      var promiseResolve, promiseReject;
      var promise = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
      });
  
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      args.push(function (err, value) {
        if (err) {
          promiseReject(err);
        } else {
          promiseResolve(value);
        }
      });
  
      try {
        original.apply(this, args);
      } catch (err) {
        promiseReject(err);
      }
  
      return promise;
    }
  
    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  
    if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return Object.defineProperties(
      fn,
      getOwnPropertyDescriptors(original)
    );
  }
  
  exports.promisify.custom = kCustomPromisifiedSymbol
  
  function callbackifyOnRejected(reason, cb) {
    // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
    // Because `null` is a special error value in callbacks which means "no error
    // occurred", we error-wrap so the callback consumer can distinguish between
    // "the promise rejected with null" or "the promise fulfilled with undefined".
    if (!reason) {
      var newReason = new Error('Promise was rejected with a falsy value');
      newReason.reason = reason;
      reason = newReason;
    }
    return cb(reason);
  }
  
  function callbackify(original) {
    if (typeof original !== 'function') {
      throw new TypeError('The "original" argument must be of type Function');
    }
  
    // We DO NOT return the promise as it gives the user a false sense that
    // the promise is actually somehow related to the callback's execution
    // and that the callback throwing will reject the promise.
    function callbackified() {
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
  
      var maybeCb = args.pop();
      if (typeof maybeCb !== 'function') {
        throw new TypeError('The last argument must be of type Function');
      }
      var self = this;
      var cb = function() {
        return maybeCb.apply(self, arguments);
      };
      // In true node style we process the callback on `nextTick` with all the
      // implications (stack, `uncaughtException`, `async_hooks`)
      original.apply(this, args)
        .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
              function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
    }
  
    Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
    Object.defineProperties(callbackified,
                            getOwnPropertyDescriptors(original));
    return callbackified;
  }
  exports.callbackify = callbackify;
  
  }).call(this)}).call(this,require('_process'))
  },{"./support/isBuffer":92,"./support/types":93,"_process":46,"inherits":40}],95:[function(require,module,exports){
  (function (global){(function (){
  'use strict';
  
  var forEach = require('foreach');
  var availableTypedArrays = require('available-typed-arrays');
  var callBound = require('call-bind/callBound');
  
  var $toString = callBound('Object.prototype.toString');
  var hasToStringTag = require('has-tostringtag/shams')();
  
  var g = typeof globalThis === 'undefined' ? global : globalThis;
  var typedArrays = availableTypedArrays();
  
  var $slice = callBound('String.prototype.slice');
  var toStrTags = {};
  var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
  var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
  if (hasToStringTag && gOPD && getPrototypeOf) {
    forEach(typedArrays, function (typedArray) {
      if (typeof g[typedArray] === 'function') {
        var arr = new g[typedArray]();
        if (Symbol.toStringTag in arr) {
          var proto = getPrototypeOf(arr);
          var descriptor = gOPD(proto, Symbol.toStringTag);
          if (!descriptor) {
            var superProto = getPrototypeOf(proto);
            descriptor = gOPD(superProto, Symbol.toStringTag);
          }
          toStrTags[typedArray] = descriptor.get;
        }
      }
    });
  }
  
  var tryTypedArrays = function tryAllTypedArrays(value) {
    var foundName = false;
    forEach(toStrTags, function (getter, typedArray) {
      if (!foundName) {
        try {
          var name = getter.call(value);
          if (name === typedArray) {
            foundName = name;
          }
        } catch (e) {}
      }
    });
    return foundName;
  };
  
  var isTypedArray = require('is-typed-array');
  
  module.exports = function whichTypedArray(value) {
    if (!isTypedArray(value)) { return false; }
    if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
    return tryTypedArrays(value);
  };
  
  }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"available-typed-arrays":18,"call-bind/callBound":26,"es-abstract/helpers/getOwnPropertyDescriptor":28,"foreach":30,"has-tostringtag/shams":36,"is-typed-array":43}],96:[function(require,module,exports){
  module.exports = extend
  
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  
  function extend() {
      var target = {}
  
      for (var i = 0; i < arguments.length; i++) {
          var source = arguments[i]
  
          for (var key in source) {
              if (hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
              }
          }
      }
  
      return target
  }
  
  },{}]},{},[13]);
  