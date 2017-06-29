var mysql = require('mysql');
require('dotenv').config();
var con = mysql.createConnection({
	host:process.env.DB_LOCAL_HOST||"us-cdbr-iron-east-04.cleardb.net",
	user:process.env.DB_LOCAL_USER||"bbe428e16729e7",
	password:process.env.DB_LOCAL_PASSWORD||"96fb9d3f",
	database:process.env.DB_LOCAL_SCHEMA||"heroku_1f48a5c323a97c2"
});

con.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
});


module.exports = {
  getAllAccount: function () {
    var cmd = "select * from khachhang";
    con.query(cmd,function (err,rows,fields) {
      console.log(rows);
    })
  },
  getAccount:function(number,callback){
    var cmd = "select * from khachhang where `SOTAIKHOAN` = '"+number+"'";
    try{
      con.query(cmd,function(err,rows,fields){
        if (err){
          callback(null);
          return;
        }
        if (rows.length == 0){
          callback(null);
          return;
        }   
        if (rows.length > 1){
          callback(null);
          return;
        }
        if (rows.length == 1){
          callback(rows[0]);
          return;
        }
      });
    }catch(err){
      console.log(err);
      return null;
    }
  },
  findName:function(name,callback){
    var cmd = "select * from khachhang where LOWER(`HOTEN`) = LOWER('"+name+"')";
    try{
      con.query(cmd,function(err,rows,fields){
        if (err){
          callback(false);
          return;
        }
        if (rows.length <= 0){
          callback(false);
          return;
        }
        callback(true);
        return ;
      });
    } catch(err){
      console.log(err);
      callback(false);
      return;
    }
  } 
};


