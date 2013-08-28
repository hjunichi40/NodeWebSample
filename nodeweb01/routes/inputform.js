
/*
 * GET home page.
 */
var mysql = require('mysql');


/* Insert */
function InsertWithTransaction (req, connection, callback) {
    console.log("InsertWithTransaction 1");
    //var querystr = 'start transaction';
    var querystr = 'select * from AppliedUsers;';
    var query = connection.query(querystr, function(err, result) {
        console.log("InsertWithTransaction 2");
        console.log(result);
        if (!err) {
            console.log("InsertWithTransaction 3");
            querystr = 'insert into AppliedUsers(MailAddress, SurName) values (?, ?)';
            connection.query(querystr, [req.query.email, req.query.surname], function(err, result) {
            if (!err) {
                //商品情報登録を実施する予定 TODO
              querystr = 'select * from AppliedUsers where surname = ?';
              connection.query(querystr, [req.query.surname], function(err, result) {
                if (!err) {
                  // 両方登録完了でcommit
                  querystr = 'commit';
                  connection.query(querystr, function(err) {
                    // commit自体に失敗した場合は
                    // scheduleとuserの削除が反映されないが、
                    // エラーが発生したことをコールバックで伝達。
                    console.log("エラーが発生したことをコールバックで伝達");
                    callback(err);
                  });
                } else {
                  // 商品情報の登録に失敗
                  // とはいえ、既にユーザ情報を登録しているので、
                  // rollbackする。
                  querystr = 'rollback';
                  connection.query(querystr, function(e) {
                    if (!e) {
                      // データ登録に失敗したことをコールバックで伝達
                      console.log("データ登録に失敗したことをコールバックで伝達");
                      callback(err);
                    } else {
                      // rollbackに失敗した旨をコールバックで伝達
                      console.log("rollbackに失敗した旨をコールバックで伝達");
                      callback(e);
                    }
                  });
                }
              });
            } else {
              // ユーザ情報の登録に失敗。
              console.log("ユーザ情報の登録に失敗");
              callback(err);
            }
          });
        } else {
          // start transactionに失敗。
          console.log("start transactionに失敗");
          callback(err);
        }
    });
}

function callback(err, connection) {
      console.log(err);
      connection.end();
}

/* 登録フォーム初期化処理 */
exports.initdisp = function(req, res){
    console.log("initdisp Log");
    console.log(req.body);
    /*
    var connection = mysql.createConnection({
        host: '127.4.17.129', database: 'c9', user: 'hjunichi40', password: ''
	});
	
	
	var query = connection.query('start transaction', function (err, results) {
        if(err){
            console.log(err);
        }else{
            console.log('--- results ---');
            console.log(results);
            //console.log('name is ...');
            //console.log(results[0].last_name);
		}
	});

	query = connection.query('insert into AppliedUsers(MailAddress, SurName) values (?, ?)', ["hasea@aa", "abdd"], function (err, results) {
        if(err){
            console.log(err);
        }else{
            console.log('--- results ---');
            console.log(results);
            //console.log('name is ...');
            //console.log(results[0].last_name);
		}
	});

    
	query = connection.query('select * from AppliedUsers where surname=? ;', ["hase"], function (err, results) {
        if(err){
            console.log(err);
        }else{
            console.log('--- results ---');
            console.log(results);
            //console.log('name is ...');
            //console.log(results[0].last_name);
		}
	});

	connection.end(function() {
        console.log('connection end');
	});
    */
    res.render('inputform', { title: 'ABS パーカー購入サイト' });
};

/* 登録時の処理 */
exports.apply = function(req, res){
    console.log("apply Log");
    console.log(req.query);
    console.log(req.query.surname);
    
    var connection = mysql.createConnection({
        host: '127.4.17.129', database: 'c9', user: 'hjunichi40', password: ''
	});
	
	console.log("apply Log2");
	connection.connect();
    console.log("apply Log3");
    
    /* トランザクション開始 */
    var query = connection.query('start transaction', function (err, results) {
        if(err){
            console.log(err);
            connection.end(function() {console.log('connection end');});
            /* 処理終了でエラー画面へ TODO */
            res.render('applyresult', { title: 'ABS パーカー購入サイト', uname: req.query.surname , status:"ERROR"});
            return;
        }else{
            console.log('--- results ---');
            console.log(results);
		}
	});
    
    /* ユーザ情報登録 */
    var autoid;
	query = connection.query('insert into AppliedUsers(MailAddress, SurName, GivingName, TelNumber, PostCode, Address1, Address2, Gender, Context, ContextDetail) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
	[req.query.email, req.query.surname, req.query.givingname, req.query.telnumber, req.query.postcode, req.query.address1, req.query.address2, req.query.gender, req.query.context, ""], function (err, results) {
        if(err){
            console.log(err);
            connection.end(function() {console.log('connection end');});
            /* 処理終了でエラー画面へ TODO */
            res.render('applyresult', { title: 'ABS パーカー購入サイト', uname: req.query.surname , status:"ERROR"});
            return;
        }else{
            console.log('--- results ---');
            console.log(results);
            autoid = results.insertId;
		}
	});
	console.log("auto ID");
    console.log(autoid);
    
    /* ここで商品情報の登録
	query = connection.query('select * from AppliedUsers where surname=? ;', ["hase"], function (err, results) {
        if(err){
            console.log(err);
            //RollBack
            connection.query('rollback ;', function (err, results) {
                connection.end(function() {console.log('connection end');});
            });//TODOエラーの時のCloaseがない
            //処理終了でエラー画面へ TODO
            res.render('applyresult', { title: 'ABS パーカー購入サイト', uname: req.query.surname , status:"ERROR"});
            return;
        }else{
            console.log('--- results ---');
            console.log(results);
            //console.log('name is ...');
            //console.log(results[0].last_name);
		}
	}); */
	
    query = connection.query('commit; ', function (err, results) {
        connection.end(function() {
            console.log('connection end');
        });
    });
    
    res.render('applyresult', { title: 'ABS パーカー購入サイト', uname: req.query.surname });
};


