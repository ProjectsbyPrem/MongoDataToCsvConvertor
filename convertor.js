// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/admin", function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('system.users');
 var result;

collection.find({},{_id:0,user:true,db:true,roles:true } ).toArray(function(err, items) {
  // console.log(items);
  db.command({'hostInfo':1}, function(err, systeminfo){


      var club = {'hostname' : systeminfo.system.hostname}
      // abc.push(club)
  items.push(club)
  console.log(items);
  items.forEach(function (item) {

   roles = item.roles;
   if(roles){
   roles.forEach(function(arr){
     console.log(arr)
     if(arr.role){
       if(arr.role != "read"){
         item.elevated = true
       }
       if(arr.role == "root"){
         item.superuser = true
       }
     }
   })
}
 })

  console.log(club)
  var temp = items[0];
  items[0] = items[items.length-1];
  items[items.length-1] = temp;


  var json2csv = require('json2csv');
  var fs = require('fs');
  var fields = ['hostname','user', 'db','elevated','superuser'];
  var csv = json2csv({ data: items, fields: fields });

  fs.writeFile('file.csv', csv, function(err) {
  if (err) throw err;
  console.log('file saved');
  });


});
});
});
