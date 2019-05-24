var express    = require('express'); 
var app        = express();          
var mongojs    = require('mongojs'); 
var db         = mongojs('Trip', ['definedTrips','admin','book','users','comments','students']); // DB , [collections]
var bodyParser = require('body-parser');
var port       = process.env.PORT || 7000;
var jwt        = require('jsonwebtoken');

var {_} = require('lodash');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());



// -------------------------------------------------   FILTERS ---------------------------------------------------------------
app.get('/trips/:pricelow/:pricehigh', function(req,res){

    var PriceLow = parseInt(req.params.pricelow);
    var PriceHigh = parseInt(req.params.pricehigh);
  // console.log(PriceLow + "  " + PriceHigh);

    db.definedTrips.find({ $and: [{price: {$gte: PriceLow}},{price:{$lte: PriceHigh}}]},function(err,docs){
        res.json(docs)
    });

});

app.get('/place/:country/:city', function(req,res){

    var Country = req.params.country;
    var City = req.params.city;
    
    // treba uraditi tako da mi svi podaci u bazi budu lowercase, svi svi ... i onda samo vamo kad budem uzimao parametar da 
    // ga stavim u lowecase i to je to 

  //  console.log(Country + " " + City);
    
    db.definedTrips.find({ $or: [{country: Country}, {city: City}]}, function(err,docs){
        
       res.json(docs);
        
        
    });
   
   
   
    
});

app.post('/admin',function(req,res){
    var Name = req.body.name;
    var Pass = req.body.pass;
    
    db.admin.count({name: Name,password: Pass}, function(err,docs){
        if(!err)
            res.json(docs);
        else{
            res.status(401);
        }
        
    });
});

//-------------------------------------------------- STUDENT SINGUP/LOGIN ---------------------------------------------------------

app.post('/studentSingup', function(req,res){
    
    db.students.insert(req.body, function(err,docs){
        res.json(docs);
    });

});

app.post('/studentLogin',function(req,res){
    var Name = req.body.studentName;
    var Pass = req.body.password;
    
  //  console.log(Name + " " + Pass);
    
    
    db.students.findOne({username: Name,password: Pass}, function(err,docs){
        if(!err)
            res.json(docs);
        else{
            res.status(401);
        }
        
    });
    
});





//------------------------------------------------ DISPLAY TRIPS ------------------------------------------------------------------
app.get('/trips', function(req,res){
    var start = parseInt(req.query.start);
    var limit = parseInt(req.query.limit);

    db.definedTrips.find({}).limit(limit).skip(start,function(err,docs){
        res.json(docs);

       
    });


});



//--------------------------------------------------- ADMIN ---------------------------------------------------------

app.post('/trips',function(req,res){
    
    db.definedTrips.insert(req.body, function(err,docs){
        res.json(docs);
        
    });
    
});

app.delete('/tripDelete/:id',function(req,res){
    var ID = req.params.id;
    db.definedTrips.remove({_id: mongojs.ObjectId(ID)}, function(err,docs){
        res.json(docs);
    });
    
});

app.get('/tripEdit/:id', function(req,res){
    var ID = req.params.id;
    
    db.definedTrips.findOne({_id: mongojs.ObjectId(ID)}, function(err, docs){
        res.json(docs);
    });
});

app.put('/tripUpdate/:id', function(req,res){
    var id = req.params.id;
    //console.log(req.body.country);
    db.definedTrips.findAndModify({query: {_id: mongojs.ObjectId(id)}, //query: ==> selects property we wanna modifie !
    update: {$set: {image: req.body.image, tickets: req.body.tickets, country: req.body.country,
                    city: req.body.city,price: req.body.price,more: req.body.more}},
    new: true}, function(err,doc){
        res.json(doc);
    }
    
)

});

// ----------------------------- INTERESTING -----------------------------------

app.put('/interesting/:vacation_id', function(req,res){

    var id = req.params.vacation_id;
   //console.log(id + " **** ");
   db.definedTrips.findAndModify({query: {_id: mongojs.ObjectId(id)},
   update: {$inc: {interesting: 1}}}, function(err,docs){
       res.json(docs);
   });
   
    

});


//------------------------------------------------------------------------------------------
app.get('/order/:value',function(req,res){

    var V = req.params.value;
   // console.log(V);
    

    if(V == 'high'){
        db.definedTrips.find({}).sort({price: -1},function(err,docs){
            res.json(docs);
        });

// proba da li rade aggregatne funckcije !!!
        db.definedTrips.aggregate([
            {$match: {}},
            {$group: {_id: "$country", totalPrice: {$sum: "$price"}}}
        ]).sort({price: -1}, function(err,doc){
          //  console.log(doc);
            
        })
// rade !!!


    }else{
        
        db.definedTrips.find({}).sort({price: 1},function(err,docs){
            res.json(docs);
        });
    }

    
   
});
/*
app.get('/orderlow',function(req,res){

    

});
*/
//--------------------------------------------------------------------------------------------
//------------------------------------- BOOK -------------------------------------------------



app.post('/book/:vac_id/:Price', function(req,res){

    var idd = req.params.vac_id;
   
    var price = parseInt(req.params.Price);
 
    var name = req.body.username;
  
    var Phone = req.body.phone;
  
    
    
    db.book.insert({vacation_id: mongojs.ObjectId(idd),price:price,username: name,phone: Phone}, function(err,docs){
        res.json(docs);
     //   console.log(docs);
        
    });

});
// -------------------------------- TICKETS MANAGEMENT --------------------------------------------


app.put('/ticketManage/:vac_id', function(req,res){

    var id = req.params.vac_id;

    db.definedTrips.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$inc: {tickets: -1}}}, function(err,docs){
       res.json(docs);
   });
   
    
});



//--------------------------------- JWT -----------------------------------------------------------


function verifyJWTToken(token) 
{
  return new Promise((resolve, reject) =>
  {
    jwt.verify(token, "mehmed", (err, decodedToken) => 
    {
      if (err || !decodedToken)
      {
        return reject(err)
      }
      resolve(decodedToken)
    })
  })
}

function createJWToken(details)
{
  if (typeof details !== 'object')
  {
    details = {}
  }
  if (!details.maxAge || typeof details.maxAge !== 'number')
  {
    details.maxAge = 180
  }
  details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) =>
  {
    if (typeof val !== "function" && key !== "password")
    {
      memo[key] = val
    }
    return memo
  }, {})
  let token = jwt.sign({
     data: details.sessionData
    }, "mehmed", { // "mehmed" --> secret key !
      expiresIn: details.maxAge,
      algorithm: 'HS256'
  })
  return token
}

function verifyJWT_MW(req, res, next)
{
    
  let token = (req.method === 'POST') ? req.body.token : req.query.token || req.headers.authorization
  console.log('**token', token)
  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken.data
      console.log('**success')
      next()
    })
    .catch((err) =>
    {
        console.log('***token error', err)
      res.status(400)
        .json({message: "Invalid auth token provided."})
    })
}

//--------------------  ABOUT -------------------------------------------------------------------------------

app.post('/singup', function(req,res){

    console.log("--> " + req.body);
    

    db.users.insert(req.body, function(err,docs){
        res.json(docs);
    });
});

app.post('/singin', function(req,res){

    var Name = req.body.name;
    var Pass = req.body.pass;

    console.log(Name + "  " + Pass);
    
    db.users.find({username: Name,password: Pass}, function(err,docs){
       
          //  res.json(docs);
            console.log(docs);

            if(docs){
                for(var i=0;i<docs.length;i++){
                res.status(200).json({
                    token: createJWToken({
                        sessionData: docs[i],
                        maxAge: 180
                      })
                })
                console.log("docs[i]: " + docs[i]);
                break;
            }
            }else{
                res.status(401 + " custom error");
            }
       
        
    });
    
    
});

app.post('/comment/:personCom', function(req,res){

   var Person = req.params.personCom;
   console.log(Person);
   var komentar = req.body.comentar;
   console.log("komentar: " + komentar);
   
    

    db.comments.insert({person: Person,Commentar: komentar}, function(err,docs){
        res.json(docs);
    });

});

app.get('/getcoment',verifyJWT_MW, function(req,res){

    
    
    db.comments.find({},function(err,docs){
        res.json(docs);
    });
});

//--------------------------------------------------------- ADMIN MANAGEMENT -----------------------------------------------------------------------

app.get('/totalProfit', function(req,res){
    var totalProfitt = 10;
    db.book.aggregate(
        [
            {$match: {}},
            {$group: {_id: "$vacation_id",
             total: {$sum: "$price"}}}
        ]).sort({price: -1}, function(err,docs){
            
           // res.json(docs[i]);
           for(var i=0;i<docs.length;i++){

            totalProfitt = totalProfitt + docs[i].total;
           }
          //  console.log(totalProfitt);
            res.json(totalProfitt);
        })
});

app.get('/getBookedTrips', function(req,res){

    db.book.find({}, function(err,docs){
        res.json(docs);
    });
});

app.get('/eachBookedTrip',function(req,res){

    db.book.aggregate(
        [
            {$match: {}},
            {$group: {_id: "$vacation_id",
             total: {$sum: "$price"},
             number: {$sum: 1}}}
        ]).sort({price: -1}, function(err,docs){
            res.json(docs);
        })
});

app.get('/getCount/:Show', function(req,res){

    var show = req.params.Show;
  //  console.log(show);
    
    if(show == "stu"){
    db.students.count({},function(err,docs){

        res.json(docs);
    });
    }else{
    db.book.count({},function(err,docs){

        res.json(docs);
    });
    }
});

/*
   db.book.aggregate(
        [
            {$match: {}},
            {$group: {_id: "$vacation_id",
             total: {$sum: "$price"},
             number: {$sum: 1}}}
        ]).sort({price: -1}, function(err,docs){
            
            res.json(docs);
            
        })
        
    
});
*/ 


app.listen(port, function(){
    console.log("Running the server on port: " + port );
});