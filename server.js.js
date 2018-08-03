//
// # SimpleServer
//
//
var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('EDP2.db');
var multer = require('multer');
var rimraf = require('rimraf');
var im = require('imagemagick');
var gm = require('gm')
var router = express();
var fs = require('fs');
var server = http.createServer(router);
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rennzytest@gmail.com',
        pass: 'renzzy123'
    }
});

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/num', function(req, res, c) {
var bobby = db.get("SELECT ItemId FROM Item ORDER BY ItemId DESC LIMIT 1",function(err,row){
            c = row;
   if (err)
          {
         res.json({"Notifications":"ERROR"}); 
          }
          else
          {
       res.json(row); 
          }
    });
});


router.get('/numS', function(req, res, c) {
var bobby = db.get("SELECT ServiceId FROM Services ORDER BY ServiceId DESC LIMIT 1",function(err,row){
            c = row;
   if (err)
          {
         res.json({"Notifications":"ERROR"}); 
          }
          else
          {
       res.json(row); 
          }
    });
});

router.get('/numP', function(req, res, c) {
var bobby = db.get("SELECT ProjectId FROM Project ORDER BY ProjectId DESC LIMIT 1",function(err,row){
            c = row;
   if (err)
          {
         res.json({"Notifications":"ERROR"}); 
          }
          else
          {
       res.json(row); 
          }
    });
});


//Delect Code
  router.get('/delP/:id', function(req, res) {
    console.log("In Project Delete");
    var parm = req.params.id.split("&")
    var q = "DELETE FROM Project WHERE ProjectId="+parm[0];
rimraf('./Image/project/'+parm[1], function () { console.log('deleted folder'); });
  db.run(q,function(err,row){
    if(err){res.json({success:0});}else{

       res.json({success:1});

    
  




}
   
   });
});

router.get('/delI/:id', function(req, res) {
console.log("In Item Delete");
var parm = req.params.id.split("&")
var q = "DELETE FROM Item WHERE ItemId="+parm[0];
var q2 = "DELETE FROM calenderItem  WHERE calenderId ="+parm[0];

rimraf('./Image/item/'+parm[1], function () { console.log('deleted folder'); });
  db.run(q,function(err,row){
    if(err){res.json({success:0});}else{

db.run(q2,function(err,row2){
    if(err){res.json({success:0});}else{
       res.json({success:1});
    
  




}
   
   });
    
  




}
   
   });
});

  router.get('/delS/:id', function(req, res) {
    console.log("In Service Delete");
    var parm = req.params.id.split("&")
  var q = "DELETE FROM Services WHERE ServiceId="+parm[0];
  var q2 = "DELETE FROM calenderService  WHERE calenderId ="+parm[0];

rimraf('./Image/service/'+parm[1], function () { console.log('deleted folder'); });
  db.run(q,function(err,row){
    if(err){res.json({success:0});}else{

db.run(q2,function(err,row2){
    if(err){res.json({success:0});}else{
       res.json({success:1});
    
  




}
   
   });
    
  




}
   
   });
});






//Image post
    router.post('/upload/:num', function(req, res, c) {

      var par = req.params.num.split("&");
      var ncount = par[0];
      var dirname = par[1];
      console.log("Inside Upload "+ncount+"  "+dirname);
  var bobby = db.get("SELECT ItemId FROM Item ORDER BY ItemId DESC LIMIT 1",function(err,row){
            c = row;
            console.log(c);
            console.log(c.ItemId);
            var nextNum = c.ItemId + 1;
            var dir = './Image/item/' + dirname;
            // create the folder and put 4 generic images there
              if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
              console.log("Created the directory")
                  }
              console.log(bobby);
 console.log(c);
      var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            var name = (ncount);
            var s = file.mimetype.split("/");
            console.log(name+'.'+s[1]);
            console.log(file.mimetype);
            cb(null, name+'.'+s[1]);
        }
    }
    );
    var upload = multer({
        storage: storage
        }).single('file');
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});

      });
   });


});

    router.post('/uploadS/:num', function(req, res, c) {
      var par = req.params.num.split("&");
      var ncount = par[0];
      var dirname = par[1];
      console.log("Inside Upload "+ncount+"  "+dirname);

  var bobby = db.get("SELECT ServiceId FROM Services ORDER BY ServiceId DESC LIMIT 1",function(err,row){
            c = row;
            console.log(c);
            console.log(c.ServiceId);
            var nextNum = c.ServiceId + 1;
            var dir = './Image/service/' + dirname;
            // create the folder and put 4 generic images there
              if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
              console.log("Created the directory")
                  }
              console.log(bobby);
 console.log(c);
      var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            var name = (ncount);
            var s = file.mimetype.split("/");
            console.log(name+'.'+s[1]);
            console.log(file.mimetype);
            cb(null, name+'.'+s[1]);
        }
    }
    );
    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});

      });
   });
});


    router.post('/uploadP/:num', function(req, res, c) {
      var par = req.params.num.split("&");
      var ncount = par[0];
      var dirname = par[1];
      console.log("Inside Upload "+ncount+"  "+dirname);
  var bobby = db.get("SELECT ProjectId FROM Project ORDER BY ProjectId DESC LIMIT 1",function(err,row){
            c = row;
            console.log(c);
            console.log(c.ProjectId);
            var nextNum = c.ProjectId + 1;
            var dir = './Image/project/' + dirname;
            // create the folder and put 4 generic images there
              if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
              console.log("Created the directory")
                  }
              console.log(bobby);
 console.log(c);
      var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            var name = (ncount);
            var s = file.mimetype.split("/");
            console.log(name+'.'+s[1]);
            console.log(file.mimetype);
            cb(null, name+'.'+s[1]);
        }
    }
    );
    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});

      });
   });
});


////////////Live search hack
router.get('/liveSearch', function (req, res) {
  console.log(req.body.type +','+req.body.text)
   
   
  var querygetitems = 'select Title from Item like UNION select Title from Services'; 
   
  db.all(querygetitems,function(err,row2){
if(err){
  //res.json({"Result":"Nothing"});
}else{
}
/*  db.all(queryItem,function(err,row){
if(err){
  //res.json({"Result":"Nothing"});
}else{
}
});*/
 var out=[];
  for (var i = 0; i < row2.length; i++) {
        out.push(row2[i].Title);
}
   console.log(row2);
  res.json({"result":out});
}); 
 //res.json({"List":out}); 
})
//TODO:Implement the funciton
router.get('/getPremadeProjects', function (req, res) {
  var queryGetAll = "SELECT * FROM CategoryProduct";
db.all(queryGetAll,function(err,row){
          if (err){
      }
          else  {
        var out=[];
        var image =[];
for (var i = 0; i < row.length; i++) {
        out.push(row[i].Product);
        image.push(row[i].ImagePath);
}
console.log(out);
       res.json({"Projects":row}); 
       
      }
});

})



router.get('/getNotifications/:userid', function (req, res) {
	
  var queryGetAll = "SELECT * FROM Notification WHERE To_userid="+req.params.userid;
db.all(queryGetAll,function(err,row){
          if (err){
         res.json({"Notifications":"ERROR"}); 
	  }
          else  {
       res.json({"Notifications":row}); 
      }
});

})



router.get('/setViewed/:id', function (req, res) {
  var queryGetAll = "UPDATE Notification SET New=FALSE WHERE ID="+req.params.id;
db.run(queryGetAll,function(err,row){
          if (err){
	  	  
	  }

          else  {
        
        
      }
});


})

//{"USERID":"299","ServiceId":[],"ItemId":[349]} ////user servuce id to retrivew userid, userdid to get email
//select  * 
//from USER 
//where UserId=(Select Services.UserId from Services where ServiceId=337)
//Select Item.UserId from Item where ItemId=541;
router.post('/sendFirstNotifications', function (request, res) {
var USERID = request.body.USERID;	//userid of person clicking 

	var serviceQuery = 'SELECT Services.UserId,Services.ServiceId FROM Services WHERE ServiceId=';
 for (var i = 0; i < request.body.ServiceId.length; i++) {
    if(i==0){
      serviceQuery+=request.body.ServiceId[i];
 }else{
    serviceQuery+=' OR ServiceId=';
    serviceQuery+=request.body.ServiceId[i]; 
 }}
  console.log(serviceQuery);     


  var itemQuery = 'SELECT Item.UserId,Item.ItemId FROM Services WHERE ItemId=';
 for (var i = 0; i < request.body.ItemId.length; i++) {
    if(i==0){
      itemQuery+=request.body.ItemId[i];
 }else{
    itemQuery+=' OR ItemId=';
    itemQuery+=request.body.ItemId[i]; 
 }}
  console.log(itemQuery);          
	/////////////////////////////////////////////////////////////

var service_email = 'Select * from USER,Services where USER.UserId=Services.UserId AND (Services.ServiceId=';
 for (var i = 0; i < request.body.ServiceId.length; i++) {
    if(i==0){
      service_email+=request.body.ServiceId[i];
 }else{
     service_email+=' OR ServiceId=';
    service_email+=request.body.ServiceId[i]; 
 }}

 service_email+=')';

  console.log("email query service"+service_email); 

var item_email = 'Select * from USER,Item where USER.UserId=Item.UserId AND (Item.ItemId=';
 for (var i = 0; i < request.body.ItemId.length; i++) {
    if(i==0){
      item_email+=request.body.ItemId[i];
 }else{
     item_email+=' OR ItemId=';
    item_email+=request.body.ItemId[i]; 
 }}

 item_email+=')';


  console.log("email query item"+item_email); 
var getname= 'select Name from USER where USER.UserId='+USERID;
db.get(getname,function(err,getusername){
  if (err){console.log("error getting email");}else{


db.all(service_email,function(err,emailsOfService){
  if (err){console.log("error item service");}else{

for (var i = 0; i < emailsOfService.length; i++) {

         
  console.log(emailsOfService[i].email+emailsOfService[i].Title+getusername.Name);
  var mail={
            from: 'rennzytest@gmail.com',
            to: emailsOfService[i].email,
            subject: 'Message Regarding '+ emailsOfService[i].Title,
           html: '<p>Dear renzzy User,</p><p>You have been contacted by <span style="color: #2196f3;"><strong>'+getusername.Name+' </strong></span>regarding your Serive/Item&nbsp; for <span style="color: #2196f3;"><strong>'+emailsOfService[i].Title+'</strong></span></p><p><strong>Please click the link to confirm</strong>(Your information will be shared with the requester after this): <a href="renzzy.com">renzzy.com</a></p><p>Thank you for using<strong> <span style="color: #2196f3;">ren</span><span style="color: #ff0000;">zz</span><span style="color: #2196f3;">y</span>.</strong><span style="color: #000000;">com</span></p><p>&nbsp;</p><p>&nbsp;</p><p><img src="http://www.renzzy.com/renzzylogo.png" alt="logo" width="142" height="36" /></p><div><a href="http://renzzy.com" target="_blank">renzzy.com</a> | Contact Us</div><div>Email: <a href="mailto:raza.bb10@gmail.com" target="_blank">raza.bb10@gmail.com</a></div><div>Address: Ryerson DMZ</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>Connect with us on <a href="http://facebook.com">Facebook</a>, <a href="http://twitter.com">Twitter</a>, <a href="http://Instagram.com">Instagram</a> &nbsp;&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div><span style="color: #999999;">CONFIDENTIALITY NOTE: The information transmitted, including attachments, is intended only for the person(s) or entity to which it is addressed and may contain confidential and/or privileged material. Any review, retransmission, dissemination or other use of, or taking of any action in reliance upon this information by persons or entities other than the intended recipient is prohibited.</span></div>'
    };
    

    
 transporter.sendMail(mail, function(err2, suc){
           console.log('email sent');
            
              if(err2)
            err2 ? console.log("error") : console.log("success");

           
        });
 
}

}

db.all(item_email,function(err,emailsOfService){
	if (err){console.log("error item email");}else{

for (var i = 0; i < emailsOfService.length; i++) {

         
  console.log(emailsOfService[i].email+emailsOfService[i].Title+getusername.Name);
  var mail={
            from: 'rennzytest@gmail.com',
            to: emailsOfService[i].email,
            subject: 'Message Regarding '+ emailsOfService[i].Title,
            html: '<p>Dear renzzy User,</p><p>You have been contacted by <span style="color: #2196f3;"><strong>'+getusername.Name+' </strong></span>regarding your Serive/Item&nbsp; for <span style="color: #2196f3;"><strong>'+emailsOfService[i].Title+'</strong></span></p><p><strong>Please click the link to confirm</strong>(Your information will be shared with the requester after this): <a href="renzzy.com">renzzy.com</a></p><p>Thank you for using<strong> <span style="color: #2196f3;">ren</span><span style="color: #ff0000;">zz</span><span style="color: #2196f3;">y</span>.</strong><span style="color: #000000;">com</span></p><p>&nbsp;</p><p>&nbsp;</p><p><img src="http://www.renzzy.com/renzzylogo.png" alt="logo" width="142" height="36" /></p><div><a href="http://renzzy.com" target="_blank">renzzy.com</a> | Contact Us</div><div>Email: <a href="mailto:raza.bb10@gmail.com" target="_blank">raza.bb10@gmail.com</a></div><div>Address: Ryerson DMZ</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>Connect with us on <a href="http://facebook.com">Facebook</a>, <a href="http://twitter.com">Twitter</a>, <a href="http://Instagram.com">Instagram</a> &nbsp;&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div><span style="color: #999999;">CONFIDENTIALITY NOTE: The information transmitted, including attachments, is intended only for the person(s) or entity to which it is addressed and may contain confidential and/or privileged material. Any review, retransmission, dissemination or other use of, or taking of any action in reliance upon this information by persons or entities other than the intended recipient is prohibited.</span></div>'
    };
    

    
 transporter.sendMail(mail, function(err2, suc){
           console.log('email sent');
            
              if(err2)
            err2 ? console.log("error") : console.log("success");

             res.json({"status":"SUCCESS"});
        });
 
}

}});
});
  }});





})

//raza(349),vasu(541),honey 337, 299 
//{"sid":[337,9870],"iid":[266,349]}
//   curl -d '{"sid":[337,9870],"iid":[266,349]}' -H "Content-Type: application/json" http://127.0.0.1:3000/getCalendar
//SELECT * FROM Calendar,USER where (USER.UserId=Calendar.UserId AND Calendar.UserId=701)
router.post('/getCalendar', function (input, out) {
  console.log(input.body);
  var queryCal = "SELECT DISTINCT  ServiceTags,mon,tue,wed,thu,fri,Name, Price,Title ,Rating FROM calenderService ,USER,Services WHERE USER.UserId=Services.UserId AND calenderService.calenderId=Services.ServiceId AND ";          
var queryCal2 = "SELECT DISTINCT  ItemTag,mon,tue,wed,thu,fri,Name, Price,Title ,Rating FROM calenderItem,USER,Item WHERE USER.UserId=Item.UserId AND calenderItem.calenderId=Item.ItemId AND ";          
 


if(input.body.sid.length!=0){
 for (var i = 0; i < input.body.sid.length; i++) {
  if(i==0)
      queryCal+='(Services.ServiceId=';
  else
      queryCal+=' OR Services.ServiceId=';

     
    queryCal+=input.body.sid[i]; 
      
  }
queryCal+=')';
  console.log(queryCal);
}
else{
queryCal=""
}

if(input.body.iid.length!=0){
 for (var i = 0; i < input.body.iid.length; i++) {
  if(i==0)
      queryCal2+='(Item.ItemId=';
  else
      queryCal2+=' OR Item.ItemId=';

     
    queryCal2+=input.body.iid[i]; 
     
  }
 queryCal2+=')';
  console.log(queryCal2);
}else{
queryCal2="";
}



db.all(queryCal,function(err,row1){if (err){
  console.log("error1");
  db.all(queryCal2,function(err,row2){if (err){console.log("error2"); 
  out.json({"Service":[],"Item":[]});  }else{   
  
  


        out.json({"Service":[],"Item":row2}); 
}
});

}else{   
  db.all(queryCal2,function(err,row2){if (err){
    console.log("error3"); 
  out.json({"Service":row1,"Item":[]});  }else{   
  
  


        out.json({"Service":row1,"Item":row2}); 
}
});
}
});


})



router.post('/setReview', function (req, res) {
            
	
      db.run("INSERT INTO Reviews (From_userid,To_userid,Rating,Comment) VALUES (?,?,?,?)",req.body.From_userid,
      req.body.To_userid,req.body.Rating,req.body.Comment);
      res.send({"status":"success"})

})
router.get('/getReviews/:userid', function (req, res) {
	
  var queryGetAll = "SELECT * FROM Reviews WHERE To_userid="+req.params.userid;
db.all(queryGetAll,function(err,row){
          if (err){
         res.json({"Reviews":"ERROR"}); 
	  
	  
	  }

          else  {
        
        
       res.json({"Reviews":row}); 
      }
});

})


router.get('/getServicebyID/:sId', function (req, res) {
  //9852
  console.log("called get serive by id");
  var queryGetAll = "SELECT * FROM Services where ServiceId="+req.params.sId;
  console.log(queryGetAll);
db.all(queryGetAll,function(err,row){
          if (err){
      }
          else{ 
             console.log(row[0].UserId);
       
       var queryUser = "SELECT * FROM USER where UserId="+row[0].UserId;
       db.all(queryUser,function(err,row2){
         
       
       res.json({"Service":row,"User":row2}); 
       
       });
       
       
      }
});

})

router.get('/getServiceItemsForSelectedProject/:pCat', function (req, res) {
 //SELECT Id from CategoryProduct where Product="Basement"
 //SELECT Items from Product_Subcategory_items where parentid="1"
var one;
var outItems=[];
var outService=[];
console.log(req.params.pCat);
db.all('SELECT Id from CategoryProduct where Product=?',req.params.pCat,function(err,row){

console.log(row[0].Id);
one= row[0].Id;
'select * from USER, Services where USER.UserId = Services.UserId'
var queryItems = 'SELECT Items from Product_Subcategory_items where parentid="'+one+'"';
db.all(queryItems,function(err,row){
  var out=[];
  for (var i = 0; i < row.length; i++) {
    outItems.push(row[i].Items);
  }
            console.log(outItems);


var queryServices = 'SELECT services from Product_Subcategory_services where parentid="'+one+'"';
db.all(queryServices,function(err,row){
  for (var i = 0; i < row.length; i++) {
    outService.push(row[i].services);
  }
             console.log(outService);
       
       res.json({"Items":outItems,"Service":outService,"ProjectName":req.params.pCat});
});


});


});
        
  

})

//{"Services":["Plumber","Flooring installer",”Drywall installer”],"Items":["Saw","Plyer"]}
//Select * from Services where ServiceTags like "%Drywall installer%" OR ServiceTags like "%Plumber%";
//Select * from Item where ItemTag like "%Plyer%"
//Select * from Item where ItemTag=
router.post('/getMatchingUsersForServiceAndItems', function (request, response) {
console.log(request.body); 
  var services=[];
  var items=[];
  var query ='select * from USER, Services where USER.UserId = Services.UserId AND (';
//select * from USER, Services where USER.UserId = Services.UserId AND Services.ServiceTags like "%Drywall installer%";
  for (var i = 0; i < request.body.Services.length; i++) {
    if(i==0)
      query+=' ServiceTags like "%';
  else
      query+=' OR ServiceTags like "%';
    services.push(request.body.Services[i]);
    console.log(services[i]);
    query+=services[i];
    query+='%"';  
  }
  query+=')';
  console.log(query);
  
  
 //query= Select * from Services where ServiceTags like "%Drywall installer%" OR ServiceTags like "%Plumber%";
  var queryItem ='select * from USER, Item where USER.UserId = Item.UserId AND (';
  //select * from USER, Item where USER.UserId = Item.UserId AND
  for (var i = 0; i < request.body.Items.length; i++) {
    if(i==0)
      queryItem+=' ItemTag like "%';
  else
      queryItem+=' OR ItemTag like "%';
    items.push(request.body.Items[i]);
    console.log(items[i]);
    queryItem+=items[i];
    queryItem+='%"';  
  }
  queryItem+=')';
  console.log(queryItem);

var userlistservice=[];
var userlistitem=[];

  db.all(query,function(err,row2){

  db.all(queryItem,function(err,row){

  console.log(row); 
  response.json({"Service":row2,"Item":row});
  

});
  
}); 

  
})





//INSERT INTO PROJECT  (ImagePath,SkillID,UserName,ProjectDesciption,Itemtags,Servicetags,UserId,lat,long)
router.post('/postProject',function(req,res){
  var servicetags = "";
  var itemtags = "";
  
 // console.log("QWERTY "+req.body.UserName);
  
  for(var i = 0; i < req.body.Servicetags.length; i++)
  {
    if((i+1) ==  req.body.Servicetags.length )
    servicetags +=  req.body.Servicetags[i];
    else 
    servicetags +=  req.body.Servicetags[i]+",";

  }
    for(var i = 0; i < req.body.Itemtags.length; i++)
  {
    if((i+1) ==  req.body.Itemtags.length )
    itemtags +=  req.body.Itemtags[i];
    else 
    itemtags +=  req.body.Itemtags[i]+",";

  }
  
  
//res.send({"Status":"Success"});
var curtime =5;//Math.floor(Date.now() / 1000);
	console.log("QWERTY "+req.body);

db.run("insert into PROJECT (Deadline,Status,Title,SkillID, UserName, ProjectDesciption, Itemtags,Servicetags, UserId, lat, long) values (?,?,?,?,?,?,?,?,?,?,?)",curtime,false,req.body.Title, 
                                                                  req.body.SkillID, 
                                                                  req.body.UserName, 
                                                                  req.body.ProjectDesciption, 
                                                                  itemtags,
                                                                  servicetags,
                                                                  req.body.UserId,
                                                                  req.body.Lat,
                                                                  req.body.Long,function(err,row){
          if (err)
          {console.log(err)
        res.json({"stat":"error"});
      }
          else{

          var IDItem=this.lastID;
        var filepath = 'Image/project/'+this.lastID
var query = 'UPDATE PROJECT SET ImagePath="'+ filepath +'" WHERE PROJECT.ProjectId ='+this.lastID;
console.log(query);
  db.run(query);

console.log("done");
res.json({"stat":IDItem});
    }
      });
          
                                
});






router.get('/getServices', function (req, res) {
  
  var queryGetAll = "select * from ServiceTags";
db.all(queryGetAll,function(err,row){
  

          if (err){
        
      }
          else  {
        var out=[];
for (var i = 0; i < row.length; i++) {
  out.push(row[i].ServiceTagId);
}
        
        
             console.log(out);
       res.json({"Services":out}); 
      }
});

})



router.post('/getSearchResults', function (req, res) {
  console.log(req.body.type +','+req.body.text)
   
 
  var query ='select * from USER, Services where USER.UserId = Services.UserId AND ( Title like "%'+req.body.text+'%")'; 
//select * from USER, Services where USER.UserId = Services.UserId AND Services.ServiceTags like "%Drywall installer%";
 
  console.log(query);
  
 //query= Select * from Services where ServiceTags like "%Drywall installer%" OR ServiceTags like "%Plumber%";
  var queryItem ='select * from USER, Item where USER.UserId = Item.UserId AND ( Title like "%'+req.body.text+'%")'; 
  //select * from USER, Item where USER.UserId = Item.UserId AND
 

var userlistservice=[];
var userlistitem=[];

  db.all(query,function(err,row2){
if(err){
  //res.json({"Result":"Nothing"});
}else{
  
}
  db.all(queryItem,function(err,row){
if(err){
  //res.json({"Result":"Nothing"});
}else{
  
}
   console.log(row2[0]+','+row[0]);
  res.json({"Service":row2,"Item":row});

});
  
}); 
   
 //res.json({"List":out}); 
})

router.get('/getItems', function (req, res) {
  
  var queryGetAll = "select * from ItemTags";
db.all(queryGetAll,function(err,row){
  

          if (err){
        
      }
          else  {
        var out=[];
for (var i = 0; i < row.length; i++) {
  out.push(row[i].ItemTagId);
}
        
        
             console.log(out);
       res.json({"Items":out}); 
      }
});

})



//RAZA CODE
router.get('/getallItems/:id', function (req,res){
        db.all("SELECT * FROM item WHERE UserId=?",req.params.id,function(err,row){
           if (err)
          res.json({ "Name":"ERR"});
          else
          res.json(row);
        });

});

router.get('/getallProjects/:id', function (req,res){
        db.all("SELECT * FROM project WHERE UserId=?",req.params.id,function(err,row){
           if (err)
          res.json({ "Name":"ERR"});
          else
          res.json(row);
        });

});

router.get('/getallServices/:id', function (req,res){
        db.all("SELECT * FROM services WHERE UserId=?",req.params.id,function(err,row){
           if (err)
          res.json({ "Name":"ERR"});
          else
          res.json(row);
        });
});

router.get('/getUserbyEmail/:id', function (req,res){ // I do a search by email
        if(req.params.id != null)
        {
        db.get("SELECT * FROM user WHERE email=?",req.params.id,function(err,row){
          if (err)
          res.json({ "Name":"ERR"});
          else
          res.json(row);
      });
        }
});

router.get('/getUserbyId/:id', function (req,res){
        db.get("SELECT * FROM user WHERE UserId=?",req.params.id,function(err,row){
           if (err)
          res.json({ "Name":"ERR"});
          else
          res.json(row);
        });
        
});

router.post('/newUser',function(req,res){
      db.run("INSERT INTO USER (Name,GPS,Address,email,ImagePath,Lat,Long,PhoneNumber,Rating) VALUES (?,?,?,?,?,?,?,?,?)",
      req.body.Name,req.body.GPS,req.body.Address,req.body.email,req.body.ImagePath,req.body.Lat,req.body.Long,req.body.PhoneNumber,req.body.Rating);
      
      res.send({"status":"success"});
      });
      


router.post('/postItem',function(req,res){
  
          console.log("recieved request");
          console.log(req.body.item.Lat);
console.log(req.body.item.long);


var sch = JSON.parse(req.body.sch);
if(sch.mon.match("None") )sch.mon='false';
if(sch.tue.match("None") )sch.tue='false';
if(sch.wed.match("None") )sch.wed='false';
if(sch.thu.match("None") )sch.thu='false';
if(sch.fri.match("None") )sch.fri='false';



          db.run("insert into item (Price,Title,Date, UserId,Lat,long, ItemTag, description) values (?,?,?,?,?,?,?,?)",req.body.item.Price,
          req.body.item.Title,req.body.item.Date,req.body.item.UserId,req.body.item.Lat,req.body.item.long,req.body.item.ItemTag,req.body.item.description,function(err,row){
          if (err)
          {console.log(err)
        res.json({"stat":"error"});
      }
          else{

          var IDItem=this.lastID;
        var filepath = 'Image/item/'+this.lastID
var query = 'UPDATE item SET ImagePath="'+ filepath +'" WHERE item.ItemId='+this.lastID;
console.log(query);
  db.run(query);

         db.run("insert into calenderItem  (calenderId,mon,tue,wed,thu,fri) values (?,?,?,?,?,?)",this.lastID,sch.mon,sch.tue,sch.wed,sch.thu,sch.fri);
console.log("done");
res.json({"stat":IDItem});
    }
      });
          


          
        });





router.post('/postService',function(req,res){
          console.log("recieved request");
          console.log(req.body);

var sch = JSON.parse(req.body.sch);
if(sch.mon.match("None") )sch.mon='false';
if(sch.tue.match("None") )sch.tue='false';
if(sch.wed.match("None") )sch.wed='false';
if(sch.thu.match("None") )sch.thu='false';
if(sch.fri.match("None") )sch.fri='false';

  db.run("insert into Services (Title, date,Price,Description,ServiceTags, UserId, Lat, Long) values (?,?,?,?,?,?,?,?)", req.body.service.Title, req.body.service.date,req.body.service.Price, req.body.service.Description
  ,req.body.service.ServiceTags,req.body.service.UserId,req.body.service.Lat,req.body.service.Long,function(err,row){
          if (err)
          {console.log(err)
        res.json({"stat":"error"});}
          else{
          console.log("val  "+this.lastID);


 var IDItem=this.lastID;
        var filepath = 'Image/service/'+this.lastID
var query = 'UPDATE Services SET ImagePath="'+ filepath +'" WHERE Services.ServiceId='+this.lastID;
console.log(query);
  db.run(query);

         db.run("insert into calenderService   (calenderId,mon,tue,wed,thu,fri) values (?,?,?,?,?,?)",this.lastID,sch.mon,sch.tue,sch.wed,sch.thu,sch.fri);
console.log("done");


res.json({"stat":IDItem});
    }
      });
 

});

router.post('/xpostProject',function(req,res){
              var a = true;
              var SkillId  = Math.floor((Math.random() * 500) + 1);
              var b;
              b =  db.get("SELECT * FROM PROJECT WHERE SkillId = ?",SkillId,
              function(err, row, callback) 
              {
              if(row == null)
              {
                console.log(req.body);
               db.run("INSERT INTO PROJECT (UserId,UserName,Status,BuyerID,ProjectDesciption,SkillId,ImagePath) VALUES (?,?,?,?,?,?,?)",req.body.UserID,req.body.UserName,req.body.Status,req.body.BuyerID,req.body.ProjectDesciption,
               SkillId,req.body.ImagePath);
               // manufacture the string for
                db.run("INSERT INTO SkillRequirements (SkillID,Skill1,Skill_2,Skill_3,Skill_4,Skill_5) VALUES (?,?,?,?,?,?)",SkillId,req.body.ItemTags[0],req.body.ItemTags[1],req.body.ItemTags[2],
               req.body.ItemTags[3],req.body.ItemTags[4]);
               res.send({"Status":"Success"});
              }
        }
    );
              
});

router.post('/postTesting',function(req,res){
      res.send(req.body);
	console.log("this should work");
	
    });
    
server.listen(3000, process.env.IP, function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
