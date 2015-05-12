# Javascript SDK for Dansk Supermarked API [ ![Codeship Status for DanskSupermarked/ds-api-js-sdk](https://codeship.com/projects/36ec9160-dac9-0132-128b-7e6cf4be967c/status?branch=master)](https://codeship.com/projects/79394)
Intro text
- [Documentation](#markdown-header-documentation)
- [Download](#markdown-header-download)
- [Installation](#markdown-header-installation)
- [Changelog](#markdown-header-changelog)
- [Contribute](#markdown-header-contribute)
- [Support](#markdown-header-support)

## Documentation
- [How to use the javascript SDK](https://bitbucket.org/DanskSupermarked/api-sdk-javascript/src/32966f033f4db832c034878231750e60749eea6b/docs/index.md?at=master)
- [How to use the Dansk Supermarked API](https://developer.dansksupermarked.dk/v1/overview/)

## Download
[ds-api.js (uncompressed)](raw/master/dist/ds-api.js) | [ds-api.min.js (compressed: 2,8 KB - 1,4 KB gzipped)](raw/master/dist/ds-api.min.js)

## Installation
### Dependencies:
- [jquery](http://jquery.com/).

### In browser:

```html
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="/scripts/ds-api.min.js"></script>
<script>
    dsApi.setKey('yout-secret-api-key');
    var req = dsApi.get('stores');
    req.then(function(resp) {
        console.log(resp);
    })
</script>
```

### In AMD loader ([require.js](http://requirejs.org/)):

```js
require(['ds-api'], function(dsApi) {
    var req = dsApi.get('stores');
});
```

### In [Node.js](http://nodejs.org/) and [Browserify](http://browserify.org/)

```js
var dsApi = require('ds-api');

var req = dsApi.get('stores');
```

## Changelog
### 0.1.1
- 'getAll' have implemented `progress` for the promise

### 0.1.0
- `get`, `getAll` and `setKey` added
- pagination functions
- meta data (headers)

## Contribute
Feel free to contribute to the SDK. Just make sure to comply with the rulesets for JSHint and jscs.

To contribute make a fork of this project and when you are happy with the code make a pull request.

To test the code you can open the code in a browser (like chrome) and debug/test it:

```
$ gulp serve
```

Before making a pull request make sure that the SDK can build:

```
$ gulp build
```

Build is running all tests and also rely on a test coverage above 95%, so you have to make tests for new functionality.

## Support
If you need any help with the SDK write a request to [apisupport@dansksupermarked.dk](mailto:apisupport@dansksupermarked.dk).
