var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');
var request = require('request');

var format = ".json";
var apikey = process.env.WU_ACCESS  //WU API key for heroku configuration

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Port is now set to 9001
var port = process.env.PORT || 9001;
//app.set('port', (process.env.PORT || 9001));

//Just to confirm app is running
app.get('/', function(req, res){
  res.send('Hello Everyone!!');
});

//app.post will be triggered when a POST request is sent to the URL ‘/post’
app.post('/post', function(req, res){
  
//Get message from slash command
var query = req.body.text

//Get weather elements from Weather API using weather underground API e.g http://api.wunderground.com/api/dc4bfe7a43a22962/conditions/q/CA/San_Jose.json
var parsed_url = url.format({
    pathname: 'http://api.wunderground.com/api/' + apikey + '/conditions/q/' + req.body.text + format,
  });

  console.log(parsed_url);
  request(parsed_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var temp = data.current_observation.temperature_string;
      var weatherCondition = data.current_observation.weather
      var icon = data.current_observation.icon_url
      var city = data.current_observation.display_location.full
      var body = {
        response_type: "in_channel",
        "attachments": [
          {
            "text": "City Name: " + city + "\n" + "Temperature: " + temp + "\n" + "Condition: " + weatherCondition,
            "image_url": icon
          }
        ]
      };
      res.send(body);
      }
  });
});

//Informs application which port to listen on
app.listen(port, function() {
  console.log('Weather app is running on port', + port);
});