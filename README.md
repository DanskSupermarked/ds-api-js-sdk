# Javascript SDK for Dansk Supermarked API [ ![Codeship Status for DanskSupermarked/ds-api-js-sdk](https://codeship.com/projects/36ec9160-dac9-0132-128b-7e6cf4be967c/status?branch=master)](https://codeship.com/projects/79394)
[https://developer.dansksupermarked.dk/v1/api/libraries/javascript/ds-api/](https://developer.dansksupermarked.dk/v1/api/libraries/javascript/ds-api/)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [Contribute](#contribute)
- [Support](#support)

## Documentation
- [How to use the javascript SDK](https://developer.dansksupermarked.dk/v1/api/libraries/javascript/ds-api/)
- [How to use the Dansk Supermarked API](https://developer.dansksupermarked.dk/v1/overview/)

## Changelog

### 1.0.5
- Bugfixes
  - Post should use `body` instead of deprecated `data` in fetch

### 1.0.4
- Bugfixes:
  - Firefox can not use forEach on Headers in fetch

### 1.0.3
- Bugfixes:
  - Use count 0 if no items are found

### 1.0.2
- Use HEAD request for counting

### 1.0.1
- Map headers to javascript object.

### 1.0.0
- not dependent of jQuery, but using latest EcmaScript methods, which should be polyfilled with [polyfill.io](https://cdn.polyfill.io/v1/docs/)
- jQuery polyfill added
- refactored source code using ES6
- `count` has been added

### 0.1.1
- `getAll` have implemented `progress` for the promise

### 0.1.0
- `get`, `getAll` and `setKey` added
- pagination functions
- meta data (headers)

## Contribute
Feel free to contribute to the SDK. Just make sure to comply with the rulesets for JSHint and jscs.

To contribute make a fork of this project and when you are happy with the code make a pull request.

Before submitting a Pull Request make sure that all tests are run successfully:

```bash
$ npm test
```

## Support
If you need any help with the SDK write a request to [apisupport@dansksupermarked.dk](mailto:apisupport@dansksupermarked.dk).
