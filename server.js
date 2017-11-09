var express     = require('express');
var app         = express();
var bodyparser  = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db = null;
var ObjectID    = require('mongodb').ObjectID;
var nodemailer  = require('nodemailer');
const fs        = require('fs');
var webshot     = require('webshot');
var CronJob     = require('cron').CronJob;
var cron = require('node-cron');
var async       = require('async');
var request     = require('request');
var gbk         = require('gbk');


MongoClient.connect("mongodb://localhost:27017/arrDB",function(err,dbconn){
	if(!err){
		console.log("we are connected!");
		db = dbconn;
	}	
});

app.use(express.static('public'));

app.use(bodyparser.json());

app.get('/projects',function(req,res,next){

	db.collection('arr',function(err,arrCollection){
		arrCollection.find().toArray(function(err,arr){
			console.log(arr);
			return res.json(arr);
		})
	});
  //res.send(arr);
});

/*app.post('/projectsdata',function(req,res,next){
	console.log(req.body);

	db.collection('projects',function(err,projectsCollection){
		var newResv=req.body.newResv;
		projectsCollection.insert(newResv,{w:1},function(err){
			return res.send(newResv);
			return res.send();
		});
	});
});*/

app.get('/projectsdata',function(req,res,next){

	db.collection('versiondt',function(err,versiondtCollection){
		versiondtCollection.find().toArray(function(err,arr){

			//console.log('finish reading cvs file data!');
			return res.json(arr);
		})
	});
  //res.send(arr);
});

/*creat pdf file*/
function getPdf(){
	var options = {
		screenSize: {
			width: 1200,
			height: 900
		}
		,shotSize:{
			width: 900,
			height:'all'
		}
		,renderDelay:10000
	};
	webshot('http://localhost:4005/','screenshot.pdf',options,function(err){
		if(err){
			console.log('something wrong');
		}
	});
}
getPdf();

/*send email*/
app.post('/subscribe',function(req,res,next){

	//console.log(req.body.newSubs);

	function sendMail(){
		var transporter = nodemailer.createTransport({
				service:'gmail',
				auth:{
					user:'testemailsender333@gmail.com',
					pass:'333testemailsender'
				}
		});

		//setup email data
		var mailOptions = {
				from:'testemailsender333@gmail.com',
				//to:'lena.wang369@gmail.com',
				to:req.body.newSubs.receiver,
				subject:['pdf file'],
				text: 'send successfully!',
				attachments:[{
					path:'./screenshot.pdf',
					contentType:"application/pdf"
				}]
		};

		transporter.sendMail(mailOptions,function(err,info){
			if(err){
				console.log(err);
			}else{
				console.log('Email sent:' + info.response);
			}
			transporter.close();
		});
	}

	//var rate = '00 00 9 * * 1-5'; //Daily: Monday-Friday 9:00 AM 
	var rate = '* * * * */1'; //every minute

	/*if(req.body.newSubs.date){

		console.log(req.body.newSubs.date);
		var a = Date.parse(req.body.newSubs.date); 
	    var b = new Date(a);
	    console.log(a);
		rate = toString(a);
	}*/

	cron.schedule(rate,function(){
		//getHTML();
		sendMail();
	}) 

	res.send();
});

app.listen(4005, function(){
	console.log('app listensing on port 4005!');
});

