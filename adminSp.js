angular.module('adminRouts', ['ngRoute'])

.config(function($routeProvider){

    $routeProvider
    .when('/',{
        templateUrl: '/adminPanel/defineTrip.html',
        controller: 'tripsCtrl'
    })
    .when('/management',{
        templateUrl: '/adminPanel/management.html',
        controller: 'managementCtrl'
    })
    
   // .otherwise({redirectTo: '/'});
});