// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'LocalStorageModule', 'starter.controllers', 'starter.services', 'starter.directives', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  localStorageServiceProvider.setPrefix('paci');

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.catalog', {
    url: '/catalog',
    views: {
      'tab-catalog': {
        templateUrl: 'templates/catalog/tab-catalog.html',
        controller: 'CatalogCtrl'
      }
    }
  })

  .state('tab.reservate', {
    url: '/tours/:tourId/reservation',
    views: {
      'tab-tour-reservation': {
        templateUrl: 'templates/catalog/reservate/product-reservation.html',
        controller: 'ReservationCtrl'
      }
    }
  })

  .state('tab.reservations', {
    url: '/reservations',
    cache: false,
    views: {
      'tab-reservations': {
        templateUrl: 'templates/reservations/tab-reservation.html',
        controller: 'ReservationsCtrl'
      }
    }
  })

  /*
  .state('tab.reservation-details', {
    url: '/reservations/:reservationId',
    views: {
      'tab-reservation-details': {
        templateUrl: 'templates/reservations/reservation-details.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })*/

  .state('tab.cart', {
    url: '/cart',
    cache: false,
    views: {
      'tab-cart': {
        templateUrl: 'templates/cart/tab-cart.html',
        controller: 'CartCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/catalog');

});
