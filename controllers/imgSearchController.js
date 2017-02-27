var request = require('request');
var imgSearch = require('../models/imgSearch.js');

var requestUrl = "https://www.googleapis.com/customsearch/v1?key="+ process.env.API_KEY +"&cx="+ process.env.API_CX +"&searchType=image&num=10&q=";

exports.create_query_get = function(req, res, next){
 var query = req.params.query;
 var url = requestUrl + query;
 if(req.query.offset){
   url += '?' + req.query.offset;
 }
 findInDatabase(query).then(function(results){
   if(!results){
     makeVendorApiRequest(url).then(function(results){
       res.json(results);
       var time = new Date(Date.now());
       addToDatabase(query, time).then(function(results){
         console.log('Query has been added to the database.')
         console.log(results);
       })
     })
   }else{
     console.log('Already in the database. Making API request only.')
     makeVendorApiRequest(url).then(function(results){
       res.json(results);
     })
   }
 })
}

exports.get_latest = function(req, res, next){
     imgSearch.find({}, function(err, results){
      if(err){return next(err)}
      var jsonArray = [];
      for(var i = 0; i < results.length; i++){
      var jsonData = {};
       jsonData.query = results[i].search_item;
       jsonData.when = results[i].time_stamp;
       jsonArray.push(jsonData);
     }
       res.json(jsonArray);
     })
}

//Helper Functions

var parseBody = function(data){
  data = JSON.parse(data)
  var results = [];
  for(var i= 0; i < data.items.length; i++){
      var obj = {};
      obj.title = data.items[i].title;
      obj.link = data.items[i].link;
      obj.snippet = data.items[i].snippet;
      results.push(obj);
              }
              return results;
}

var makeVendorApiRequest = function(url){
            return new Promise(function(resolve,reject){
                      request(url, function(error, response, body){
                        if(error){reject(error)}
                        var results = parseBody(body);
                        resolve(results);
                     });
                 });
             }
var addToDatabase = function(query, date){
   return new Promise(function(resolve,reject){
    imgSearch.create({
                search_item: query,
                time_stamp: date
     },function(err, results){
       if(err){reject(err)}
        resolve(results);
     })
   })
}

var findInDatabase = function(query){
  return new Promise(function(resolve,reject){
   imgSearch.find({search_item: query},function(err, results){
      if(err){reject(err)}
       resolve(results[0]);
    })
  })
}
