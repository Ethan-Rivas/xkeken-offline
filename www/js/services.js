angular.module('starter.services', [])

.constant('APIConfig', {
  PREFIX: 'http://' + 'jade-paci.herokuapp.com' + '/api/offline/'
})

.service('API', function($http, APIConfig) {
  function url(resource, params) {
    var url = APIConfig.PREFIX + resource;
    if (params && params.id) {
      url += '/' + params.id;
    }

    return url;
  }

  function get(resource, params) {
    return $http({
      method: 'GET',
      url:    url(resource, params),
      params: params
    });
  }

  function post(resource, params) {
    return $http.post(url(resource), params);
  }

  function put(resource, id, params) {
    return $http.put(url(resource, { id: id }), params);
  }

  function del(resource, id, params) {
    return $http.delete(url(resource, { id: id }));
  }

  return {
    get:    get,
    post:   post,
    put:    put,
    delete: del
  };
});
