var dsApi = require('./index');

var timer = Date.now();
dsApi.setKey('CocaD0d0');
dsApi.get('jobs').then(function(resp) {
  console.log({
    method: 'dsApi.get(`jobs`)',
    resp: resp,
    runtime: Date.now() - timer
  });
  timer = Date.now();
}).then(function() {
  return dsApi.getAll('jobs');
}).then(function(resp) {
  console.log({
    method: 'dsApi.getAll(`jobs`)',
    resp: resp,
    runtime: Date.now() - timer
  });
  timer = Date.now();
}).then(function() {
  return dsApi.count('jobs');
}).then(function(resp) {
  console.log({
    method: 'dsApi.count(`jobs`)',
    resp: resp,
    runtime: Date.now() - timer
  });
  timer = Date.now();
}).catch(function(err) {
  console.error(err);
});
