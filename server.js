var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://ivkkicwbrksmau:5c299e95162794eb2d24ffab04b1a554075466c03d248e01c2b5fe3eed174dc5@ec2-54-243-147-162.compute-1.amazonaws.com:5432/daf023q10sen3g?ssl=true')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//page
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

//Display All Products
app.get('/products', function (req, res) {
    db.any('select* from products ')
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/products', { products: data })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
})

//Display Products by ID
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { product: data[0] })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
})

//Add New Product
app.post('/products/add_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price) VALUES ('${title}','${price}','${id}')`;
    db.query(sql)
       .then(function(data){
           res.redirect('/products')
       })
       .catch(function(data){
           console.log('ERROR:'+console.error);
       })
});
app.get('/add_product', function (request, response){
    response.render('pages/add_product');
})
//Edit Product
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}', price = '${price}' where id = '${id}'`;
    db.query(sql)
       .then(function(data){
           res.redirect('/products')
       })
       .catch(function(data){
           console.log('ERROR:'+console.error);
       })
});

//Delete Product
app.get('/product_delete/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = 'DELETE FROM products';
    if (pid) {
        sql += ' where id =' + pid;
    }
    db.query(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//Display All Users
app.get('/users', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from users';
    if (id) {
        sql += ' Where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        })
});

//Display User By ID
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select* from users';
    if (id) {
        sql += ' Where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        })
});

//Update User
 app.post('/users/update', function (req, res) {
     var id = req.body.id;
     var email = req.body.email;
     var password = req.body.password;
     var sql = `update products set title = '${title}', price = '${price}' where id = '${id}'`;
     db.query(sql)
        .then(function(data){
            response.redirect('/products')
        })
        .catch(function(data){
            console.log('ERROR:'+console.error);
        })
 });
 

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
}); 
