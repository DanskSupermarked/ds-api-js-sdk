/* global window */

(function(window) {

  var $ = window.jQuery;
  var force = (window.forcePolyfills === true);

  // Object.keys
  if (!Object.keys || window.forcePolyfills === true) {
    Object.keys = function(object) {
      var keys = [];
      $.each(object, function(key) {
        keys.push(key);
      });
      return keys;
    };
  }

  // Array.prototype.forEach
  if (!Array.prototype.forEach || force) {
    Array.prototype.forEach = function(callback) {
      if (this === null) {
        throw new TypeError(' this is null or not defined');
      }
      var self = this;
      $.each(self, function(index, value) {
        callback(value, index, self);
      });
    };
  }

  // String.prototype.trim
  if (!String.prototype.trim || force) {
    String.prototype.trim = function() {
      return $.trim(this);
    };
  }

  // String.prototype.startsWith
  if (!String.prototype.startsWith || force) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    };
  }

  // Promise
  if (!window.Promise || force) {
    (function() {

      // Map "fail" to "catch"
      var jQueryDeferred = $.Deferred;
      $.Deferred = function() {
        var deferred = jQueryDeferred.apply(this, arguments);
        var jQueryPromise = deferred.promise;
        deferred.promise = function() {
          var promise = jQueryPromise.apply(this, arguments);
          promise.catch = promise.fail;
          return promise;
        };
        return deferred;
      };

      window.Promise = function(callback) {
        var deferred = $.Deferred();
        callback(deferred.resolve, deferred.reject);
        return deferred.promise();
      };
      window.Promise.reject = function(obj) {
        var deferred = $.Deferred();
        deferred.reject(obj);
        return deferred.promise();
      };
      window.Promise.resolve = function(obj) {
        var deferred = $.Deferred();
        deferred.resolve(obj);
        return deferred.promise();
      };
      window.Promise.all = function(promises) {
        var deferred = $.when(promises);
        return deferred.promise();
      };
    }());

  }

  // fetch
  if (!window.fetch || force) {
    window.fetch = (function() {

      var responseHeaders = [
        'X-Version',
        'X-RateLimit-Remaining',
        'X-Total-Count',
        'X-Trace-Id',
        'X-Runtime',
        'Link',
        'Content-Type',
        'Cache-Control',
        'X-RateLimit-Reset',
        'X-RateLimit-Limit',
        'Expires'
      ];

      return function(url, options) {
        var promise = $.Deferred();
        $.ajax(url, options)
          .done(function(data, textStatus, jqXHR) {
            var headers = {};
            $.each(responseHeaders, function(i, header) {
              headers[header.toLowerCase()] = jqXHR.getResponseHeader(header);
            });
            promise.resolve({
              status: jqXHR.status,
              headers: headers,
              json: function() {
                var deferred = $.Deferred();
                deferred.resolve($.parseJSON(jqXHR.responseText));
                return deferred.promise();
              }
            });
          })
          .fail(function(jqXHR, textStatus) {
            promise.reject(new Error(textStatus));
          });

        return promise.promise();
      };
    }());
  }
}(window));
