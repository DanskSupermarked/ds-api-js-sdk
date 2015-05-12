# Dansk Supermarked Javascript SDK Documentation

- __Setup methods__
- [dsApi.setKey](#markdown-header-dsapisetkeykey)
- __AJAX methods__
- [dsApi.get](#markdown-header-dsapigetresource-options)
- [dsApi.getAll](#markdown-header-dsapigetallresource-options)

## Setup methods

### dsApi.setKey(key)

Set the api key to be used. If this is not set any ajax request will fail.

#### Arguments

__key__ (_string_): Your personal api key

#### Example

```js
dsApi.setKey('my-secret-key');
```

## AJAX methods

### dsApi.get(_resource_, [_options_])

Make a get request for a specific resource in the api.

#### Arguments

__resource__ (_string_): The resource you want to recieve from the API. You can
find available resource on the [developer site](https://developer.dansksupermarked.dk/v1/api/reference/overview/).

__options__ (_object_)

__options.wait__ (_boolean_, default `false`): Tells the request to wait if the rate limit is
reached. Thus the request will not fail but wait for the rate limit to reset.

__options.query__ (_object_): Key value pair for quering the resource on the API.

#### Returns

(__promise__): The promise will return an object with:

__status__ (_number_): The status code from the response.

__data__ (_object_): Body of response from API.

__meta__ (_object_): Information in response headers.

__pagination__ (_object_): Functions that gets _first_, _prev_, _next_ or _last_
in pagination. Returns a new promise.

#### Example

Get first stores:

```js
var request = dsApi.get('stores');

request.done(function(response) {
    console.log(response.status); // => 200
    console.log(response.data); // => Array[10]

    console.log(response.meta);
        // =>
        // {
        //     "apiVersion": "1.1.3",
        //     "ratelimitRemaining": 999,
        //     "totalCount": 1237,
        //     "traceId": "e4d6cb10-1d3d-11e4-bdb9-4b09a913e639",
        //     "runtime": 699,
        //     "link": ...,
        //     "ratelimitReset": 61,
        //     "ratelimitLimit": 1000
        // }
});

request.fail(function(response) {
    console.log(response.status); // => e.g. 500
    console.log(response.data); // => object with details about the error
});
```

Use pagination:

```js
dsApi.get('stores', {
    query: {
        perPage: 20
    }
}).done(function(firstResponse) {
    // Do something cool with the data in firstResponse.data

    // Get next 20 stores
    if (firstResponse.pagination.next) {
        firstResponse.pagination.next().done(function(nextResponse) {
            // Do something even cooler with the data in nextResponse.data
        });
    }
});
```

### dsApi.getAll(_resource_, [_options_])

Get all items for a resource.

Instead of paginating through responses, this is a
helper function to simply get all items.

Be aware, that if you are requesting
a resouce with many items it will take some time to retrieve the data and it
will take a big chunk in you rate limit.

#### Arguments

Same as [dsApi.get](#markdown-header-arguments_1)

#### Returns

(__promise__): The promise will return an object with:

__status__ (_number_): The status code from the response.

__data__ (_object_): Body of response from API.

__meta__ (_object_): Information in response headers.

#### Example

Get all stores:

```js
var request = dsApi.getAll('stores', {
    wait: true // Wait for rate limit reset if the limit has been reached
});

request.done(function(response) {
    console.log(response.status); // => 200
    console.log(response.data); // => Array[1237]
});

request.fail(function(response) {
    console.log(response.status); // => e.g. 500
    console.log(response.data); // => object with details about the error
});
```
