// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

    mongoose.connect('mongodb://username:password@ds033133.mongolab.com:33133/wpe-todo');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

// define models =================
    var Team = mongoose.model('Team', {
        name : String,
        employees: []
    });

    var Rotation = mongoose.model('Rotation', {
        start_date : Date,
        end_date: Date,
        support_agent: String,
        status: String,
        day_schedule: []
    });

// Team API ---------------------------------------------------------------------
    // get all teams
    app.get('/api/teams', function(req, res) {

        // use mongoose to get all teams in the database
        Team.find(function(err, teams) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(teams); // return all teams in JSON format
        });
    });

    //get one team
    app.get('/api/teams/:team_id', function(req, res) {

      Team.find({
          _id : req.params.team_id
      }, function(err, team) {
          if (err)
              res.send(err);

          res.json(team); // return all teams in JSON format
    });
  });

    // create team and send back all teams after creation
    app.post('/api/teams', function(req, res) {

        // create a team, information comes from AJAX request from Angular
        Team.create({
            name : req.body.name,
            employees : req.body.employees
        }, function(err, team) {
            if (err)
                res.send(err);

            // get and return all the teams after you create another
            Team.find(function(err, teams) {
                if (err)
                    res.send(err)
                res.json(teams);
            });
        });

    });

  //update a team
  app.put('/api/teams/:team_id', function(req, res) {
    Team.findOne({
      _id : req.params.team_id
  }, function(err, team) {
        // do your updates here
        team.name = req.body.name;
        team.employees = req.body.employees
        console.log(team);

        team.save(function(err, teams) {
          if (err)
            res.send(err);

            Team.find(function(err, teams) {
                if (err)
                    res.send(err)
                res.json(teams);
            });
        });
    });
  });

    // delete a team
    app.delete('/api/teams/:team_id', function(req, res) {
        Team.remove({
            _id : req.params.team_id
        }, function(err, team) {
            if (err)
                res.send(err);

            // get and return all the teams after you create another
            Team.find(function(err, teams) {
                if (err)
                    res.send(err)
                res.json(teams);
            });
        });
    });

// Rotation API ---------------------------------------------------------------------

    // get all rotation
    app.get('/api/rotations', function(req, res) {

        // use mongoose to get all teams in the database
        Rotation.find(function(err, rotation) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(rotation); // return all teams in JSON format
        });
    });

    //get one team
    app.get('/api/rotations/:rotation_id', function(req, res) {

      Rotation.find({
          _id : req.params.rotation_id
      }, function(err, rotation) {
          if (err)
              res.send(err);

          res.json(rotation); // return all teams in JSON format
    });
  });

    // create team and send back all teams after creation
    app.post('/api/rotations', function(req, res) {

        // create a team, information comes from AJAX request from Angular
        Rotation.create({
            start_date : req.body.start_date,
            end_date: req.body.end_date,
            support_agent: req.body.support_agent,
            status: "Not Started",
            day_schedule: req.body.day_schedule
        }, function(err, rotation) {
            if (err)
                res.send(err);

            // get and return all the teams after you create another
            Rotation.find(function(err, rotations) {
                if (err)
                    res.send(err)
                res.json(rotations);
            });
        });

    });

    // delete a rotation
    app.delete('/api/rotations/:rotation_id', function(req, res) {
        Rotation.remove({
            _id : req.params.rotation_id
        }, function(err, rotation) {
            if (err)
                res.send(err);

            // get and return all the teams after you create another
            Rotation.find(function(err, rotations) {
                if (err)
                    res.send(err)
                res.json(rotations);
            });
        });
    });

    // application -------------------------------------------------------------
   app.get('*', function(req, res) {
       res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
   });

    // listen (start app with node server.js) ======================================
    app.listen(80);
    console.log("App listening on port 80");
