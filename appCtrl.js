var myApp = angular.module('myApp',['appRouts']);


myApp.directive('randomNinja', function(){

    // return OBJECT
    // within this object this is where we kind of define all of our different properties and
    // control our functionalities.
        return {
            restrict: 'EA', // we can use this diretive as E: element and A: atribute !
            scope: { 
                trips: '=',// bind data ('=')
                title: '='
            },
            template: 'proba custom directive(Random Gradovi): {{trips[random].city}}', // šta će biti pokazano u HTML-u !
            controller: function($scope){
                $scope.random = Math.floor(Math.random() * 8);
            }
        };
});

myApp.controller('homeCtrl', function($scope,$http,$window,$location){


    //-------------------------------------------------------------------

    

    //-------------------------------------------------------------------

    $scope.bookForm = false;

    $scope.interestShow = true;

    $scope.bookShow = true;

    $scope.studentLogout = false;

    $scope.stuLog = false;
    $scope.stuSing= false;

    var interest = 3;
    console.log("initial interest: " + interest);
    

    console.log($scope.studentLogout);
    

    
    
    var vac_id;
    var Price;

    // ------------------------------------------ STUDENT SINGUP/LOGIN ----------------------------------------------------



    $scope.stu_singup = function(){


        $http.post('/studentSingup', $scope.student).success(function(response){

            $scope.student = " ";
            console.log(response);
            

        });
    };

    $scope.stu_login = function(studentName,password){

        console.log(studentName + "  " + password);

        $http.post('/studentLogin', {studentName,password}).success(function(response){

            
            console.log(response);

            if(response){
                
                $scope.interestShow = false;
                $scope.bookShow = false;
                $scope.studentLogout = true;

                $scope.stuLog = true;
                $scope.stuSing= true;
                interest = 0;
                console.log("after login interest: " + interest);
            }else{
                window.alert("you enter invalid username or password");
            }
            
        });
        


    };

    $scope.studentLogoutt = function(){

        studentName = " ";

        $scope.interestShow = true;
        $scope.bookShow = true;
        $scope.studentLogout = false;

        $scope.stuLog = false;
        $scope.stuSing= false;
        interest = 3;
    };

    // ------------------------------------------  FILTERS ----------------------------------------------------------------

    $scope.priceFind = function(pricelow,pricehigh){

        
        $http.get('/trips/' + pricelow + "/" + pricehigh).success(function(response){

            console.log(response);

            $scope.defTrips = response;
            
        });

    };

    

    $scope.placeFind = function(country,city){

        console.log(country + " " + city);
        

        $http.get('/place/' + country + "/" + city).success(function(response){

            console.log(response);

            $scope.defTrips = response;
        });

      

    };

    //-------------------------------------------------------------------------------------------------------------------------

    
    //----------------------------------- HOME TRIPS DISPLAY ------------------------------------------------------------------

    var start = 0;
    var limit = 8;
    $scope.nomore = false;

    var match = '';
    

    var display = function(start,limit,match){

        match = 'trips';
        
    $http.get('/'+match+'?limit=' + limit + "&start=" + start).success(function(response){
        
        $scope.defTrips = response;
        console.log($scope.defTrips);
        
        if(response.length < limit){
            $scope.nomore = true;
        }else{
            $scope.nomore = false;
        }
        
    });
        
        
};
display(start,limit);

if(start == 0){
    $scope.page = 1;
}


$scope.forward = function () {
    $scope.page ++;
    start = start +8;
    display(start,limit);
}
$scope.backward = function () {
    $scope.page --;
    start = start -8;
    display(start,limit);
}

//------------------------------------------------------------------------

/*
$scope.orderhigh = function(){
    $http.get('/order/high').success(function(response){
        
        $scope.defTrips = response;
        
        
    });

};

$scope.orderlow = function(){
    $http.get('/order/low').success(function(response){
        
        $scope.defTrips = response;
        
        
    });

};
*/

$scope.order = function(priceOrder){

 //  growl.error('error message', {title: 'error'});

    $http.get('/order/' + priceOrder).success(function(response){

        
        isOrder = true;
        $scope.defTrips = response;
        
        
    });
    

}

//------------------------------ BOOK TICKET -----------------------------------



$scope.book = function(id,price){

     vac_id = id;
     Price  = price;


    $scope.bookForm = true;

};

$scope.bookTrip = function(){
    
    
    console.log("id: " + vac_id);
    console.log("price: " + Price);

    

    $http.post('/book/'+ vac_id + "/" + Price , $scope.booktrip).success(function(response){
        console.log(response);
        
    });
    $scope.booktrip = "";
    $scope.bookForm = false;

    $http.post('/book/'+ vac_id).success(function(response){
        console.log(response); 
    });
};


// ----------------------------------------------------  TICKETS ------------------------------------
$scope.ticketsManagement = function(){
    console.log(vac_id + "   ***   ");

    $http.put('/ticketManage/' + vac_id).success(function(response){

        console.log(response);
        
    });
    display(start,limit);
    
}

$scope.close = function(){
    $scope.bookForm = false;
}

// ------------------------------------- INTERESTING -------------------------------------

$scope.interesting = function(vacation_id){

    console.log(vacation_id + " hejj");
    interest++;
    console.log("press(3th) interest: " + interest);
    if(interest == 3){
        $scope.interestShow = true;
        
    }
    
    
    $http.put('/interesting/' + vacation_id).success(function(response){

        console.log(response);
        
    });
    display(start,limit); // ovo da refrešuje nakon svkog kliknutog interesting-a !!!


};

});

//--------------------------------- LOGIN/ADMIN CONTROLLER -----------------------------


myApp.controller('loginCtrl', function($scope,$http,$window){

    $scope.login = function(name,pass){
        $http.post('/admin',{name,pass}).success(function(response){

            if(response == 1){
                $window.location.href = '/adminPanel/admin.html';
            }else{
                $window.alert("wrong username or password");
            }

        }, function(response){
            $window.alert("error occured !")
        });
    }
    
});

//----------------------------------- ABOUT CONTROLLER ----------------------------------

myApp.controller('aboutCtrl', function($scope,$http,$window){


    $scope.commentArea = true;
    $scope.showComments = true;

    $scope.userSingIn = false;
    $scope.userSingUp = false;

    $scope.commentsList = false;

    $scope.userLogOut = false;

    var personCom = "";
    
    $scope.singup = function(){

        console.log("-> " + $scope.usersin);
        

        $http.post('/singup', $scope.usersin).success(function(response){
            console.log(response);
            $scope.usersin = "";
        });
    };

    $scope.singin = function(name,pass){

        personCom = name;
        
        $http.post('/singin',{name,pass}).success(function(response){

            console.log(response);
            $scope.userlog = "";
            if(response){
                $window.localStorage.setItem('user', response.token);

                console.log(" token: " + response.token + "\n" + " all: " + response);
                
                getComments();

                $scope.showComments = false;
                $scope.commentArea = false;
                
                $scope.userSingIn = true;
                $scope.userSingUp = true;

                $scope.commentsList = true;
                
                $scope.userLogOut = true;
            }else{
                
                $window.alert("wrong username or password");
            }

        }, function(response){
            $window.alert("error occured !")
        });
    };

    $scope.userLogoutt = function(){

        $scope.showComments = true;
        $scope.commentArea = true;

        $scope.userSingIn = false;
        $scope.userSingUp = false;

        $scope.commentsList = false;
        
        $scope.userLogOut = false;
    };
    
  

    $scope.comment = function(){

       console.log("person: " + personCom);
       
        $http.post('/comment/' + personCom , $scope.comentar).success(function(response){
            console.log(response);
            getComments();
        });
        
    };

var getComments = function(){
    $http.get('/getcoment',{headers: { 'Authorization': $window.localStorage.getItem('user') }}).success(function(response){

        if(response){
            $scope.komentari = response;
            console.log("komentari: " + $scope.komentari);
            
            $scope.comentar = "";
        }

        

    });
};
//getComments();

});

