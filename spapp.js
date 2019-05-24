angular.module('appRouts', ['ngRoute'])

.config(function($routeProvider){

    $routeProvider
    .when('/',{
        templateUrl: 'home.html',
        controller: 'homeCtrl'
    })
    .when('/about',{
        templateUrl: 'about.html',
        controller: 'aboutCtrl'
    })
    
    .when('/login',{
        templateUrl: 'login.html',
        controller: 'loginCtrl'
    })
   // .otherwise({redirectTo: '/'});
});