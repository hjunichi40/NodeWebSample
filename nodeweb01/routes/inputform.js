
/*
 * GET home page.
 */

exports.initdisp = function(req, res){
    console.log("initdisp Log");
    console.log(req.body);
    res.render('inputform', { title: 'ABS パーカー購入サイト' });
};

exports.apply = function(req, res){
    console.log("apply Log");
    console.log(req.query.name);
    res.render('applyresult', { title: 'ABS パーカー購入サイト', uname: req.query.name });
};