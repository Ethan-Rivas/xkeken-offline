angular.module('starter.controllers', [])

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
        if(ionic.Platform.isWebView()){

          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
          });

          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
          });

        }
        else {

          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);

          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);
        }
    }
  }
})


.controller('CatalogCtrl', function($scope, $http, API, $ionicLoading, $ionicModal, localStorageService, $location, $ionicPopup, $window) {
  $scope.$on('$ionicView.enter', function(e) {
    console.log(e);
  });

  /****** Testing Refresh all localStorages #1
  $scope.refresh = function() {
    alert('Refresacandole la vagina a tu gfa');
    localStorageService.set('businesses', []);
    localStorageService.set('tours', []);
    toursLoad();

    localStorageService.set('reservations', []);
    localStorageService.set('sales', []);

    $window.location.reload(true);
  }; ********/

  /******* Loading spinner *******/
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };

  API.get('users').then(function(response) {
    $scope.getUsers = response.data;
    localStorageService.set('users', $scope.getUsers);
  });

  /******* Dash Catalog *******/
  $scope.getTours = function () {
    API.get('tours').then(function(response) {
      $scope.getTours = response.data;

      localStorageService.set('tours', $scope.getTours);
    });

    $scope.tours = localStorageService.get('tours');
  };

  // tab -> catalog (Open Tour/Product)
  $ionicModal.fromTemplateUrl('templates/catalog/details/product-detail.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.productDetailModal = modal;
  });

  $scope.openProduct = function(product) {
    $scope.product = product;
    $scope.productDetailModal.show();
  };

  $scope.closeProduct = function() {
    $scope.productDetailModal.hide();
  };

  // tab -> catalog (Open image gallery)
  $scope.zoomMin = 1;

  $ionicModal.fromTemplateUrl('templates/catalog/details/zoom-image.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.imageZoom = modal;
  });

  $scope.openImage = function(images) {
    $scope.images = images;
    $scope.imageZoom.show();
  };

  $scope.closeImage = function() {
    $scope.imageZoom.hide();
  };

  // tab -> catalog (Start reservation)
  $ionicModal.fromTemplateUrl('templates/catalog/reservate/product-reservation.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.productReservationModal = modal;
  });

  $scope.product = {};

  $scope.startReservation = function(product) {
    $scope.product = product;
    $location.path('tab/tours/' + $scope.product.id + '/reservation');
    $scope.productDetailModal.hide();
  };

  $scope.closeReservation = function() {
    $scope.productReservationModal.hide();
  };

  $scope.printReceipt = function(sale) {
    $http.get('http://jade-paci.herokuapp.com/frontend/tour_reservations/' + sale.tour_reservation.id + '.txt').then(function(response) {
      S220.printText(response.data);
    });
  };
})

.controller('ReservationCtrl', function($scope, API, localStorageService, $stateParams, $location) {
  $scope.getLocal = localStorageService.get('tours');

  angular.forEach($scope.getLocal, function(tours) {
    if(tours.id == $stateParams.tourId){
      $scope.product = tours;
      console.log(JSON.stringify($scope.product) + ' ' + 'OK');
    }
  });

  function formatSoldProducts(adults, kids, adults_price, kids_price, product_id) {
    var params = [];
    for (var i = 0; i < adults; i++) {
      params.push({
        sold_price: adults_price,
        product_id: product_id,
        details: "adults"
      })
    }

    for (var i = 0; i < kids; i++) {
      params.push({
        sold_price: kids_price,
        product_id: product_id,
        details: "kids"
      })
    }

    return params;
  }

  $scope.tour_reservation = {
    adults: 0,
    kids: 0,
    infants: 0,
    deposit: 0,
    currency: 'MXN'
  };

  $scope.package = {
    price_in_cents: 0,
    price_in_cents_kids: 0,
    details: " ",
    quantity: 0
  };

  $scope.users = localStorageService.get('users');

  $scope.kids_price = 0;
  $scope.adults_price = 0;
  $scope.product_id = 0;

  $scope.reservations = [];

  $scope.reservationTest = [];

  $scope.sendData = function(valid, pack, product, user) {
    $scope.kids_price = pack.price_in_cents_kids;
    $scope.adults_price = pack.price_in_cents;
    $scope.product_id = pack.id;
    $scope.product_name = pack.name;
    $scope.user = user;

    var reservationAttrs = {
      "sale": {
        "user_id": $scope.user.id,
        "business_id": $scope.product.business_id,
        "sold_products_attributes": formatSoldProducts($scope.tour_reservation.adults, $scope.tour_reservation.kids, $scope.adults_price, $scope.kids_price, $scope.product_id)
      },
      "tour_reservation": {
        "activity": $scope.product_name,
        "client": $scope.tour_reservation.client,
        "hotel": $scope.tour_reservation.hotel,
        "room": $scope.tour_reservation.room,
        "deposit": $scope.tour_reservation.deposit,
        "promoter": $scope.user.email,
        "date": $scope.tour_reservation.date,
        "hour": $scope.tour_reservation.hour,
        "email": $scope.tour_reservation.email,
        "phone_number": $scope.tour_reservation.phone_number,
        "adults": $scope.tour_reservation.adults,
        "kids": $scope.tour_reservation.kids,
        "infants": $scope.tour_reservation.infants
      },
      "tour": {
        "tour_id": product.id
      }
    };

    $scope.reservationTest.push(reservationAttrs);

    $scope.validated = true;

    $scope.reservations = localStorageService.get('reservations');
    $scope.getLocal = localStorageService.set('reservations', []);

    $scope.reservations.push(reservationAttrs);
    localStorageService.set('reservations', $scope.reservations);

    alert('Reservación añadida al carrito');

    $location.path('tab/cart');
  };

  $scope.calculate = function(price_in_cents, price_in_cents_kids, adults, kids, infants, deposit, currency, exchange) {
    $scope.total = (((price_in_cents * adults) + (price_in_cents_kids * kids) + (price_in_cents * infants)) / 100);

    if (currency == "USD") {
      $scope.pay = $scope.total - (deposit * exchange);
    } else if (currency == "MXN") {
      $scope.pay = $scope.total - deposit;
    }
  }
})

.controller('ReservationsCtrl', function($scope, API, localStorageService, $location, $window, $ionicModal, $cordovaNetwork, ConnectivityMonitor) {
  $scope.$on('$ionicView.enter', function(e) {
    console.log(e);
  });

  $scope.getReservations = function () {
    API.get('sales').then(function(response) {
      $scope.getCompletedReservations = response.data;
      localStorageService.set('sales', $scope.getCompletedReservations);
    });

    $scope.completedReservations = localStorageService.get('sales');
  };

  $scope.getPendingReservations = function() {
    $scope.pending = localStorageService.get('pendingReservations');
  };

  if(ConnectivityMonitor.isOnline()){
     //do something
     $scope.isActive = true;
  }else{
    //do something else
    $scope.isActive = false;
  }

  $scope.sendReservation = function(reservation, index) {
    if(ConnectivityMonitor.isOnline()){
       //do something
       $scope.isActive = true;

       API.post('tours/' + reservation.tour.tour_id + '/reservations', reservation).then(function(response) {
         $scope.pending.splice(index, 1);
         localStorageService.set('pendingReservations', $scope.pending);

         alert('Reservación Completada!');
         console.log('response: OK');

         $scope.getReservations();
       },function errorCallBack(response) {
         $scope.pending.splice(index, 1);
         localStorageService.set('pendingReservations', $scope.pending);

         alert('Reservación Completada!');
         console.log('Running on errorCallBack ' + index);

         $scope.getReservations();
       });
    }else{
      //do something else
      alert('ERROR: No hay conexión a internet!');
    }

    $location.path('/tab/catalog');
  };

  $scope.clearPendings = function(pendingReservations) {
    alert('Borrando: ' + localStorageService.get('pendingReservations').length);
    localStorageService.set('pendingReservations', []);

    $window.location.reload(true);
  };

  // tab -> reservations (Check/Print Reservation)
  $ionicModal.fromTemplateUrl('templates/reservations/reservation-details.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.reservationDetail = modal;
  });

  $scope.openReservation = function(reservation) {
    $scope.reservation = reservation;
    $scope.reservationDetail.show();
  };

  $scope.closeReservationDetail = function() {
    $scope.reservationDetail.hide();
  };
})

.controller('CartCtrl', function($scope, localStorageService, $location) {
  $scope.$on('$ionicView.enter', function(e) {
    console.log(e);
  });

  /****** Shopping Cart ******/
  $scope.getReservations = function() {
    $scope.cart_reservation = localStorageService.get('reservations');
  };

  $scope.total_cart_value = 0;

  $scope.totalCart = function(cart_reservation) {
    var total = 0;
    var depositBucket = 0;

    for (var i = 0; i < cart_reservation.length; i++) {
      cart_reservation[i].sale.sold_products_attributes.forEach(function(sold_product) {
        total += sold_product.sold_price;
      });
      if(cart_reservation[i].tour_reservation.deposit != null) {
        depositBucket += parseInt(cart_reservation[i].tour_reservation.deposit);
      } else {
        depositBucket += 0;
      }
    }
    $scope.total_cart_value = (total / 100) - depositBucket;

    return total;
  };

  $scope.pendingReservations = [];

  $scope.createAsPending = function(cart_reservation) {
    $scope.pendingReservations = localStorageService.get('pendingReservations');
    $scope.getLocal = localStorageService.set('pendingReservations', []);

    for(var i = 0; i < cart_reservation.length; i++) {
      $scope.pendingReservations.push(cart_reservation[i]);
    }

    localStorageService.set('pendingReservations', $scope.pendingReservations);

    console.log(JSON.stringify(localStorageService.get('pendingReservations')));

    // Clear cart
    alert('Reservaciones creadas con estado: PENDIENTE!');
    localStorageService.set('reservations', []);

    $location.path('/tab/reservations');
  };

  $scope.removeItem = function(index) {
    if(confirm("Esta seguro que desea eliminar este item?")) {
      $scope.cart_reservation.splice(index, 1);

      localStorageService.set('reservations', $scope.cart_reservation);
      $scope.totalCart($scope.cart_reservation);
    }
  };

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
