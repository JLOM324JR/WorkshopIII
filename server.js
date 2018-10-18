var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://ivkkicwbrksmau:5c299e95162794eb2d24ffab04b1a554075466c03d248e01c2b5fe3eed174dc5@ec2-54-243-147-162.compute-1.amazonaws.com:5432/daf023q10sen3g?ssl=true')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*app.get('/',function(request, response){
    response.send('Hello, ExpressJS');
    });

app.get('/test',function(request, response){
    response.send('<H1>Test</H1>');
    });*/
//app.use(express.static('static'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/index', function (req, res) {
    res.render('pages/index');
});


app.get('/about', function (req, res) {
    var name = 'JLOM A.';
    var hobbies = ['Football', 'Movie', 'Programming']
    var bdate = '14/07/1997'
    res.render('pages/about', { nickname: name, hobbies: hobbies, bdate: bdate });
});

//DISPLAY ALL PRODUCTS1

/*
app.get('/products', function (req, res){
// res.download('static/index.html');//เปิดมาถึงโหลดเลย
res.redirect('/about');
});
*/
//DISPLAY ALL PRODUCTS2

app.get('/products', function (req, res) {
    db.any('select* from products')
        .then(function (data) {
            console.log('DATA' + data);
            //res.json(data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });

})


app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
    db.any(sql)
        .then(function (data) {
            //console.log('DATA' + data[0]);
            //res.json(data);
            res.render('pages/product_edit', { product: data[0] })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
})

app.get('/users', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from users';

    if (id) {
        sql += ' Where id =' + id;
    }

    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            //res.json(data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        })


});

app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select* from users';

    if (id) {
        sql += ' Where id =' + id;
    }

    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            //res.json(data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        })


});
 app.post('/product/update', function (req, res) {
     var id = req.body.id;
     var title = req.body.title;
     var price = req.body.price;
     //var sql = 'update product set title = "'+title+'", price ="'+price+'" where id = '+id;
     var sql = `update products set title = '${title}', price = '${price}' where id = '${id}'`;
     //Alt96
     //db.none
     //res.send(sql); result update product set title = Desktop Computer, price = 499.99 where id = 6
     //res.send('id:'+id + ',title=' +title);
     console.log('UPDATE:'+sql);
     res.redirect('/product');
 
 });

//console.log('App is running at http://localhost:8080');
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
}); 
//app.listen(8080);