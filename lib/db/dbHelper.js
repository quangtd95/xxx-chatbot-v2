var mysql = require('mysql');
require('dotenv').config();
var con = mysql.createConnection({
	host:"sql12.freesqldatabase.com",
	user:"sql12180928",
	password:"s8sZnvKMg7",
	database:"sql12180928"
});

con.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
});


module.exports = {
  executeQuery: function(param,type,callback){
    var query;
    switch(type){
      case 'getAll':
      query = 'select * from employee';
      break;
      case 'findByEmail':
      query = "select * from employee where `EMAIL` = '"+param.email+"'";
      break;
    }
    try {
      con.query(query,function(err,rows,fields){
       if (!err){
        if (rows.length == 0 ){
          callback(null);
        } else {
          callback(rows);
        }
        
      }
      else
        console.log('Error while performing Query.');         
    });
    } catch(err){
      console.log(err);
      throw err;
    }
  },
  addEmail:function (email) {
    var query ="UPDATE `employee` SET `REGISTED`='1' WHERE `EMAIL`='"+email+"'";
    con.query(query,function(err,rows,fields){
      if (err) return false;
      else return true;
    });
  },
  resetAll:function(){
    var query ="UPDATE `employee` SET `REGISTED`='0'";
    con.query(query,function(err,rows,fields){
      //TODO:
      if (err) return false;
      else return true;
    });
  } 
};

