//Inicializar express
var express = require('express');
var app = express();
//Inicializar mongoose y body-parser
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//Uso del modelo
var Vehicle = require('./app/models/vehicle.js');

//Configure bodyParser to add data from the body
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Settear el puerto
var port = process.env.PORT || 3000;

//Connect to mongoDb
mongoose.connect('mongodb://localhost:27017/randomTests',
                  {useNewUrlParser: true });

//Active Router
var router = express.Router();
//Config default url of the api
app.use('/api',router);
//Uso de middleware de manera global
router.use(function(req,res,next){
  console.log("Middleware");
  next();
});

router.get('/', function(req,res){
  res.json({message:'Welcome'});
});

router.route('/vehicles')
  .post(function(req,res){
    var vehicle = new Vehicle();
      vehicle.make = req.body.make;
      vehicle.model = req.body.model;
      vehicle.color = req.body.color;

    vehicle.save(function(err){
      if (err) {
        res.send(err);
      }
      res.json({message:'Vehicle created successffuly'});
    });
  })

  .get(function(req,res){
    Vehicle.find(function(err,vehicle){
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicles/:vehicle_id')
  .get(function(req,res){
    Vehicle.findById(req.params.vehicle_id,function(err,vehicle){
      if(err){
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicles/colors/:vehicle_color')
  .get(function(req,res){
    Vehicle.find({color:req.params.vehicle_color},function(err,vehicle){
      if (err) {
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicles/make/:vehicle_make')
  .get(function(req,res){
    Vehicle.find({make:req.params.vehicle_make},function(err,vehicles){
      if (err) {
        res.send(err);
      }
      res.json(vehicles);
    });
  });

router.route('/vehicles/model/:vehicle_model')
  .get(function(req,res){
    Vehicle.find({model:req.params.vehicle_model},function(err,vehicles){
      if (err) {
        res.send(err);
      }
      res.json(vehicles);
    });
  });

app.listen(port);
console.log("Server listenning on port 3000");
