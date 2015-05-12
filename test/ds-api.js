/* global window */
var expect;
var sinon;
var dsApi;
var VERSION = '1.0.0';
var fetchStub;

/**
 * Node test setup
 */
if (typeof exports !== 'undefined') {
  // Node test setup
  expect = require('chai').expect;
  sinon = require('sinon');
  dsApi = require('../');
  VERSION = require('../package.json').version;
  global.fetch = function() {
    return fetchStub.apply(this, arguments);
  };

  /**
   * Browser test setup
   */
} else {
  expect = window.expect;
  dsApi = window.dsApi;
  sinon = window.sinon;
  window.fetch = function() {
    return fetchStub.apply(this, arguments);
  };
}

/**
 * Mock data from API
 */

var stores = [{
  name: 'A-Z Hjørring',
  brand: 'bilka',
  address: {
    street: 'A.F.Heidemannsvej 20',
    city: 'Hjørring',
    zip: '9800',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Esbjerg',
  brand: 'bilka',
  address: {
    street: 'Stormgade 157',
    city: 'Esbjerg N',
    zip: '6715',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Herning',
  brand: 'bilka',
  address: {
    street: 'Golfvej 5',
    city: 'Herning',
    zip: '7400',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Hillerød',
  brand: 'bilka',
  address: {
    street: 'Slotsarkaderne 26',
    city: 'Hillerød',
    zip: '3400',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Holstebro',
  brand: 'bilka',
  address: {
    street: 'Nyholmvej 20',
    city: 'Holstebro',
    zip: '7500',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Horsens',
  brand: 'bilka',
  address: {
    street: 'Høegh Guldbergsgade 10',
    city: 'Horsens',
    zip: '8700',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Hundige',
  brand: 'bilka',
  address: {
    street: 'Over Bølgen 1',
    city: 'Greve',
    zip: '2670',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Ishøj',
  brand: 'bilka',
  address: {
    street: 'Ishøj Lille Torv 1',
    city: 'Ishøj',
    zip: '2635',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Kolding',
  brand: 'bilka',
  address: {
    street: 'Skovvangen 40 - 42',
    city: 'Kolding',
    zip: '6000',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Næstved',
  brand: 'bilka',
  address: {
    street: 'Næstved Storcenter 1',
    city: 'Næstved',
    zip: '4700',
    country: 'DK',
    extra: null
  }
}, {
  name: 'Bilka Odense',
  brand: 'bilka',
  address: {
    street: 'Niels Bohrs Alle 150',
    city: 'Odense M',
    zip: '5230',
    country: 'DK',
    extra: null
  }
}];

/**
 * Tests
 */

describe('ds-api', function() {

  beforeEach(function() {
    dsApi.setKey('test');
    dsApi.setApiVersion('v1');
    fetchStub = sinon.stub();
    fetchStub.returns(new Promise(function(resolve) {
      resolve({
        json: function() {
          return Promise.resolve(stores.slice(0, 10));
        },
        status: 200,
        headers: {
          'x-total-count': stores.length,
          link: '<https://api.dansksupermarked.dk/v1/stores?per_page=10&page=1>; rel="first", <https://api.dansksupermarked.dk/v1/stores?per_page=10&page=2>; rel="last", <https://api.dansksupermarked.dk/v1/stores?per_page=10&page=2>; rel="next"'
        }
      });
    }));
  });

  describe('#.VERSION', function() {

    it('should have version number available', function() {
      expect(dsApi.VERSION).to.be.equal(VERSION);
    });

  });

  describe('#.request(resource, method, query)', function() {

    it('should fetch data from the API', function(done) {
      dsApi
        .request('stores')
        .then(function(response) {
          expect(response.data).to.eql(stores.slice(0, 10));
          done();
        })
        .catch(done);
    });

    it('should return status code', function(done) {
      dsApi
        .request('stores')
        .then(function(response) {
          expect(response.status).to.eql(200);
          done();
        })
        .catch(done);
    });

    it('should return count indicating total number in resource', function(done) {
      dsApi
        .request('stores')
        .then(function(response) {
          expect(response.count).to.eql(stores.length);
          done();
        })
        .catch(done);
    });

    it('should return headers for response', function(done) {
      dsApi
        .request('stores')
        .then(function(response) {
          expect(response.headers).to.exist;
          done();
        })
        .catch(done);
    });

    it('should convert relative path to absolute API URL', function(done) {
      dsApi
        .request('stores')
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores');
          done();
        })
        .catch(done);
    });

    it('should use absolute path if resource starts with API_URL + API_VERSION', function(done) {
      dsApi
        .request('https://api.dansksupermarked.dk/v1/jobs')
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/jobs');
          done();
        })
        .catch(done);
    });

    it('should add query string based on query', function(done) {
      dsApi
        .request('stores', 'GET', {
          brand: 'bilka'
        })
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?brand=bilka');
          done();
        })
        .catch(done);
    });

    it('should favor queries in query object', function(done) {
      dsApi
        .request('stores?brand=netto', 'GET', {
          brand: 'bilka'
        })
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?brand=bilka');
          done();
        })
        .catch(done);
    });

    it('should return easy-to-use pagination methods', function(done) {
      dsApi
        .request('stores?per_page=10&page=1')
        .then(function(response) {
          return response.pagination.next();
        })
        .then(function() {
          expect(fetchStub.args.length).to.eql(2);
          expect(fetchStub.args[1][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=10&page=2');
          done();
        })
        .catch(done);
    });

  });

  describe('#.get(resource, query)', function() {

    it('should be a shorthand for #.request(resource, "GET", query)', function(done) {
      dsApi
        .get('stores')
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores');
          expect(fetchStub.args[0][1].method).to.eql('GET');
          done();
        })
        .catch(done);
    });

  });

  describe('#.post(resource, query)', function() {

    it('should be a shorthand for #.request(resource, "POST", query)', function(done) {
      dsApi
        .post('stores')
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores');
          expect(fetchStub.args[0][1].method).to.eql('POST');
          done();
        })
        .catch(done);
    });

  });

  describe('#.put(resource, query)', function() {

    it('should be a shorthand for #.request(resource, "PUT", query)', function(done) {
      dsApi
        .put('stores')
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores');
          expect(fetchStub.args[0][1].method).to.eql('PUT');
          done();
        })
        .catch(done);
    });

  });

  describe('#.del(resource, query)', function() {

    it('should be a shorthand for #.request(resource, "DELETE", query)', function(done) {
      dsApi
        .del('stores')
        .then(function() {
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores');
          expect(fetchStub.args[0][1].method).to.eql('DELETE');
          done();
        })
        .catch(done);
    });

  });

  describe('#.count(resource, query)', function() {

    it('should return the total number within the resource', function(done) {
      dsApi
        .count('stores')
        .then(function(count) {
          expect(count).to.eql(stores.length);
          done();
        })
        .catch(done);
    });

  });

  describe('#.getAll(resource, query)', function() {

    it('should use GET requests', function(done) {
      dsApi
        .getAll('stores')
        .then(function() {
          expect(fetchStub.args[0][1].method).to.eql('GET');
          done();
        })
        .catch(done);
    });

  });

  describe('#.getAll(resource, query)', function() {

    it('should get all instances of a resource (test with 11 instances - 1 page)', function(done) {

      dsApi
        .getAll('stores')
        .then(function() {

          // One call to get the x-total-count header + one call to get the 11 instances
          expect(fetchStub.args.length).to.eql(2);
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=1&page=1');
          expect(fetchStub.args[1][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=100&page=1');
          done();
        })
        .catch(done);
    });

    it('should get all instances of a resource (test with 1001 instances - 11 page)', function(done) {

      fetchStub.returns(new Promise(function(resolve) {
        resolve({
          json: function() {
            return Promise.resolve(stores.slice(0, 10));
          },
          status: 200,
          headers: {
            'x-total-count': 1001
          }
        });
      }));

      dsApi
        .getAll('stores')
        .then(function() {

          // One call to get the x-total-count header + 11 calls to get the 1001 instances
          expect(fetchStub.args.length).to.eql(12);
          expect(fetchStub.args[0][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=1&page=1');
          expect(fetchStub.args[1][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=100&page=1');
          expect(fetchStub.args[5][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=100&page=5');
          expect(fetchStub.args[11][0]).to.eql('https://api.dansksupermarked.dk/v1/stores?per_page=100&page=11');
          done();
        })
        .catch(done);
    });

  });

});
