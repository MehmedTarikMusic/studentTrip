var myApp = angular.module('adminApp',['adminRouts']);


myApp.controller('tripsCtrl', function($scope,$http,$window){

var refresh = function(){
    $http.get('/trips').success(function(response){
        
        $scope.defTrips = response;
        $scope.trip = "";
    });
};
refresh();
//-----------------------------------------------------------
    $scope.submitTrip = function(){
        
        $http.post('/trips', $scope.trip)
        .success(function(response){

            refresh();
        });
    }
//-----------------------------------------------------------
$scope.remove = function(id){
    
    $http.delete('/tripDelete/' + id).success(function(response){
        refresh();
    });
    
};
//------------------------------------------------------------
$scope.edit = function(id){
    console.log(id);
    $http.get('/tripEdit/' + id).success(function(response){
        $scope.trip = response; // put the content in inputs !
    });
    
};

$scope.update= function() {
    console.log($scope.trip._id);
    $http.put('/tripUpdate/' + $scope.trip._id, $scope.trip)
    .success(function(response){
        refresh();
    });
};
    

});

myApp.controller('managementCtrl', function($scope,$http,$window){

    $http.get('/totalProfit').success(function(response){

      
        $scope.totalProfit = response;
        
    });

    $http.get('/getBookedTrips').success(function(response){

        $scope.personInfo = response;
        
    });

    $http.get('/eachBookedTrip').success(function(response){

        $scope.personGroupInfo = response;   
        
        
        
    });

    $http.get('/getCount/' + "stu").success(function(response){

        
        $scope.totalStudents = response;

    });

    $http.get('/getCount/' + "book").success(function(response){

        $scope.totalBook = response;

    });

});

myApp.directive('chart1',function(){

    return {
        restrict: 'A',
        link: function($scope,$elm,$attr){  // link for a google chart !

            var data = new google.visualization.DataTable();
            data.addColumn('string','Javascript Frameworks'); // ('type','nameOfColumn')
            data.addColumn('number','students');
            data.addRows([['angular',10],['bootstrap',6],['nodejs',4],['php',12]]);

            var options = {
                'title': 'students interests',
                'width': 500,
                'height':500
            }
            var chart = new google.visualization.PieChart($elm[0]);
            chart.draw(data, options);
        }          
    }
    
});

//google.load("visualization", "1", {packages:["corechart"]});