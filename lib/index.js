export const VERSION = '1.0.0';
const API_URL = 'https://api.dansksupermarked.dk/';
const MAX_PER_PAGE = 100;

var apiVersion = 'v1';
var authKey;
var request;

/**
 * Attach queries to a URL
 * @param {string}  baseUrl  A API url
 * @param {Object}  queryMap Key/value pairs of queries to attach to the url. Queries present in both the URL and the query object the query object will be favored.
 */
var buildUrl = function(baseUrl, queryMap) {
  if (Object.keys(queryMap).length === 0) {
    return baseUrl;
  }

  // Extract existing query params and add them to the query map
  if (baseUrl.indexOf('?') !== -1) {
    var baseUrlSections = baseUrl.split('?');
    baseUrl = baseUrlSections[0];

    baseUrlSections[1].split('&').forEach(function(queryString) {
      var queryStringSections = queryString.split('=');
      var key = queryStringSections[0];

      if (!queryMap[key] && queryStringSections.length > 1) {
        queryMap[key] = queryStringSections[1];
      }
    });
  }

  // URLify the query map
  var queryStrings = [];
  Object.keys(queryMap).forEach(function(key) {
    var value = queryMap[key];
    queryStrings.push(`${key}=${value}`);
  });

  // Attach querystring to final URL
  if (queryStrings.length > 0) {
    return baseUrl + '?' + queryStrings.join('&');
  }
  return baseUrl;

};

/**
 * Transform link header into a user-friendly pagination object with method.
 * @param {string} link Link header value
 */
var parseLinkHeaders = function(link) {
  if (!link) {
    return;
  }
  var links = {};
  link.split(',').forEach(part => {
    var section = part.split(';');
    var url = section[0].replace(/<(.*)>/, '$1').trim();
    var name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = () => request(url);
  });
  return links;
};

/**
 * Set authentication token for Dansk Supermarked API. This should be set before
 * any requests are made.
 * @param {string} key A unique token
 */
export var auth = function(key) {
  authKey = key;
};

/**
 * Change the version of the API from the default.
 * @param {string} version Formatted as `v1`, `v2`... `vn`
 */
export var setApiVersion = function(version) {
  apiVersion = version;
};

/**
 * Make a request for a resource in the api
 * @param  {string}     resource Either the full url for the resource or a relative path. E.g. `/stores`
 * @param  {string}     method   A http method in upper cases. Defaults to `GET`
 * @param  {Object}     query    A object with queries for the query string. Could e.g. include pagination queries like `page` and `per_page`
 * @return {Promise}             Promise returns an object
 */
export var request = function(resource, method = 'GET', query = {}, data = null) {
  if (!authKey) {
    return Promise.reject(new Error('authentication key was not set. Use the auth method'));
  }
  if (!resource) {
    return Promise.reject(new TypeError('needs a `resource` string as first parameter.'));
  }

  // Build URL
  var baseUrl = resource.startsWith(API_URL) ? resource : `${API_URL}${apiVersion}/${resource}`;
  var url = buildUrl(baseUrl, query);

  // Perform the ajax call
  return fetch(url, {
    method,
    headers: {
      'Authorization': 'Basic ' + btoa(`${authKey}:js-sdk`),
      'Content-Type': 'application/json; charset=utf-8'
    },
    data
  }).then(function(response) {
    return response.json().then(data => {
      return {
        data: data,
        status: response.status,
        headers: response.headers,
        count: parseInt(response.headers['x-total-count'], 10) || 1,
        pagination: parseLinkHeaders(response.headers.link),
        url
      };
    });
  });
};

/**
 * AJAX GET request
 */
export var get = function(resource, query) {
  return request(resource, 'GET', query);
};

/**
 * AJAX POST request
 */
export var post = function(resource, data) {
  return request(resource, 'POST', {}, data);
};

/**
 * AJAX PUT request
 */
export var put = function(resource, data) {
  return request(resource, 'PUT', {}, data);
};

/**
 * AJAX DEL request
 */
export var del = function(resource) {
  return request(resource, 'DELETE');
};

/**
 * Shorthand for returning the number of results for a resource
 * @param  {string}     resource Either the full url for the resource or a relative path. E.g. `/stores`
 * @param  {Object}     query    A Map of queries for the query string. Could e.g. include pagination queries like `page` and `per_page`
 * @return {Promise}             Promise returns integer
 */
export var count = function(resource, query = {}) {
  query.per_page =  1;
  query.page =  1;

  return request(resource, 'GET', query).then(response => {
    if (response.status !== 200) {
      return Promise.reject(response);
    }
    return parseInt(response.headers['x-total-count'], 10) || 1;
  });
};

/**
 * Get all results (not paginated) from a resource
 * @param  {string}     resource Either the full url for the resource or a relative path. E.g. `/stores`
 * @param  {Object}    query     A map of queries for the query string. Could e.g. include filter on brand
 * @return {Promise}             Promise returns an object
 */
export var getAll = function(resource, query = {}) {

  // Get the first element from the resource. This is just used to retrieve the
  // X-Total-Count header to be able to calculate all requests that need to be
  // sent.
  query.per_page = 1;
  query.page = 1;

  // Get total count
  return request(resource, 'GET', query).then(response => {

    // The first response in used as a container for the final response to the
    // user. As data is being retrieved it is added to this initial response.

    // No need for pagination because we are retrieving all
    delete response.pagination;

    // The initial URL is not valid, because it includes pagination queries
    delete response.url;

    if (response.status !== 200) {
      return Promise.reject(response);
    }

    // Total number of pages for this resource if we are retrieving MAX per
    // request
    var pages = Math.ceil(response.count / MAX_PER_PAGE);

    // Perform requests for all pages in parallel
    var requests = [];
    var results = [];
    for (let page = 1; page <= pages; page++) {
      let paginatedQuery = {};
      paginatedQuery.per_page = MAX_PER_PAGE;
      paginatedQuery.page = page;

      requests.push(request(resource, 'GET', paginatedQuery).then(resp => {
        if (resp.status !== 200) {
          return Promise.reject(resp);
        }
        results[page - 1] = resp.data;
      }));
    }

    // When all requests have been fulfilled the data is attached to the initial
    // response, which finally is sent to the user.
    return Promise.all(requests)
      .then(function() {
        response.data = [];
        results.forEach(result => result.forEach(val => response.data.push(val)));
      })
      .then(() => response)
      .catch(err => err);

  });
};
