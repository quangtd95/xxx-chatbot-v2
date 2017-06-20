var mysql = require('mysql');
require('dotenv').config();
var con = mysql.createConnection({
	host:process.env.DB_LOCAL_HOST||"sql12.freesqldatabase.com",
	user:process.env.DB_LOCAL_USER||"sql12180928",
	password:process.env.DB_LOCAL_PASSWORD||"s8sZnvKMg7",
	database:process.env.DB_LOCAL_SCHEMA||"sql12180928"
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
  getAccount:function(account,callback){
    var cmd = "select * from khachhang where `SOTAIKHOAN` = '"+account+"'";
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
  } 
};


