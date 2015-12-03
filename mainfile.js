var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/getRequest', function(req,res,next){
	//var series = 'LAUCN040010000000005';
	var series = 'APU0000701111';
	var context = {};
	request('http://api.bls.gov/publicAPI/v2/timeseries/data/' + series, function(err,response, body) {
		if (!err && response.statusCode < 400){
			//context.bls = JSON.parse(body);
			context.bls = body;
			res.render('getRequest', context);
		}else{
			next(err);
		}
	})
});

app.get('/postRequest', function(req,res,next){
	var context = {};
	request({
		"url":"http://api.bls.gov/publicAPI/v2/timeseries/data/",
		"method":"POST",
		"headers":{
			"Content-Type":"application/json"
		},
		"body":'{"seriesid":["LAUCN040010000000005", "LAUCN040010000000006"]}'
	}, function(err, response, body){
		if(!err && response.statusCode < 400){
			context.bls = body;
			res.render('postRequest',context);
		}else{
			console.log(err);
			if(response){
				console.log(response.statusCode);
			}
			next(err);
		}
	});
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});