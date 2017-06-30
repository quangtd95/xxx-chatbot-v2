var mysql = require('mysql');
require('dotenv').config();
/*var opts = {
  host:process.env.DB_LOCAL_HOST||"us-cdbr-iron-east-04.cleardb.net",
  user:process.env.DB_LOCAL_USER||"bbe428e16729e7",
  password:process.env.DB_LOCAL_PASSWORD||"96fb9d3f",
  database:process.env.DB_LOCAL_SCHEMA||"heroku_1f48a5c323a97c2"
};*/
var poolOpts = {
 connectionLimit : 10,
 host:process.env.DB_LOCAL_HOST||"us-cdbr-iron-east-04.cleardb.net",
 user:process.env.DB_LOCAL_USER||"bbe428e16729e7",
 password:process.env.DB_LOCAL_PASSWORD||"96fb9d3f",
 database:process.env.DB_LOCAL_SCHEMA||"heroku_1f48a5c323a97c2"
}
// var con = mysql.createConnection(opts);
var con = mysql.createPool(poolOpts);

/*con.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
});*/



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
  },
  sendMoney:function(from,to,money,callback){
    var cmd = "select * from `taikhoan` where `SOTAIKHOAN` = '"+from+"'";
    try{
      con.query(cmd,function(err,rows,fields){
        if (err){
          callback(false,"Please try again later");
          return;
        }
        if (rows.length <=0 || rows.length >1){
          callback(false,"Please try again later");
          return;
        }
        if (rows[0].SODU<money){
          callback(false,"Your current balance is not enough to send!");
          return;
        }
        var currentBalanceFrom = rows[0].SODU;
        var cmd = "select * from `taikhoan` where `SOTAIKHOAN` ='"+to+"'";
        try{
          con.query(cmd,function (err,rows,fields) {
           if (err){
            callback(false,"Please try again later");
            return;
          }
          if (rows.length <=0 || rows.length >1){
            callback(false,"Please try again later");
            return;
          }
          if (rows[0].SODU<money){
            callback(false,"Your current balance is not enough to send!");
            return;
          }
          var currentBananceTo = rows[0].SODU;
          var query1 ="UPDATE `taikhoan` SET `SODU` = "+(currentBalanceFrom - money)+" WHERE `SOTAIKHOAN`='"+from+"';";
          var query2 ="UPDATE `taikhoan` SET `SODU` = "+(currentBananceTo + money)+" WHERE `SOTAIKHOAN`='"+to+"';";

          con.getConnection(function(err,connection){
            connection.beginTransaction(function(err){
              if (err){throw err;
                callback(false,err);
                return; }
                connection.query(query1,function(err,result){
                  if (err){
                    connection.rollback(function(){
                      throw err;
                      callback(false,err);
                      return;
                    });
                  }
                  connection.query(query2,function(err,result){
                    if (err){
                      connection.rollback(function(){
                        throw err;
                        callback(false,err);
                        return;
                      })
                    }
                    connection.commit();
                  })
                  callback(true,'');
                  return;
                });
              });  
          });
          

        });
        }catch(err){
          throw err;
        }

      });
    } catch(err){
      throw err;
    }
  },

};





