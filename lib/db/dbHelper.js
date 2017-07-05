var mysql = require('mysql');
var moment = require('moment');
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
    var cmd = "select * from `khachhang` where `SOTAIKHOAN` = '"+number+"'";
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
    var cmd = "select * from `khachhang` where LOWER(`HOTEN`) = LOWER('"+name+"')";
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
    var money = Number(money);
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
        var currentBalanceFrom = Number(rows[0].SODU);
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
          var currentBalanceTo = Number(rows[0].SODU);
          
          var query1 ="UPDATE `taikhoan` SET `SODU` = "+Number((Number(currentBalanceFrom) - Number(money)))+" WHERE `SOTAIKHOAN`='"+from+"';";
          var query2 ="UPDATE `taikhoan` SET `SODU` = "+Number((Number(currentBalanceTo) + Number(money)))+" WHERE `SOTAIKHOAN`='"+to+"';";
          var created =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
          var query3 ="INSERT INTO `lichsugiaodich` (`NGAYGIAODICH`, `TKNGUOIGUI`, `TKNGUOINHAN`, `SOTIEN`, `SODUNGUOIGUI`, `SODUNGUOINHAN`, `MUCDICH`) VALUES ('"+created+"', '"+from+"', '"+to+"', '"+money+"', '"+Number((Number(currentBalanceFrom) - Number(money)))+"', '"+Number((Number(currentBalanceTo) + Number(money)))+"', '1');";

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
                    connection.query(query3,function (err,result){
                      if (err){
                        connection.rollback(function(){
                          throw err;
                          callback(false,err);
                          return;
                        });
                      }
                      connection.commit();  
                    })
                    
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
  checkBalance:function(accountNumber,callback){
    var cmd = "select `SODU` from `taikhoan` WHERE `SOTAIKHOAN` = '"+accountNumber+"';";
    con.query(cmd,function (err,rows,fields) {
     if (err){
      callback(false,"Please try again later");
      return;
    }
    if (rows.length <=0 || rows.length >1){
      callback(false,"Please try again later");
      return;
    }
    callback(true,rows[0].SODU);
    return;
  });
  },
  getTradingHistory:function(accountNumber,callback){
    var cmd = "select * from `lichsugiaodich` where `TKNGUOIGUI` = '"+accountNumber+"' or `TKNGUOINHAN` = '"+accountNumber+"';";
    con.query(cmd, function (err,rows,fields){
      if (err){
        callback(false,"");
        return;
      }
      if (rows.length <= 0){
        callback(true,"No transaction record!!!");
        return;
      }
      var data ="Your transaction history: %0A";
      for (var i = 0 ; i < rows.length; i++){
        if (rows[i].TKNGUOIGUI == accountNumber){
          data+="**************************************************%0A";
          data+="send to "+rows[i].TKNGUOINHAN + " "+ rows[i].SOTIEN+" vnd%0A";
          data+="your balance was down to "+rows[i].SODUNGUOIGUI+" vnd%0A";
          data+="**************************************************%0A";
        }
        else {
          data+="**************************************************%0A";
          data+="receive from "+rows[i].TKNGUOIGUI + " "+ rows[i].SOTIEN+" vnd%0A"; 
          data+="your balance was up to "+rows[i].SODUNGUOINHAN+" vnd%0A";
          data+="**************************************************%0A";
        }
      }
      callback(true,data);
      return;
    });
  }
}


