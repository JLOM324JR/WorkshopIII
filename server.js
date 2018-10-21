var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://ivkkicwbrksmau:5c299e95162794eb2d24ffab04b1a554075466c03d248e01c2b5fe3eed174dc5@ec2-54-243-147-162.compute-1.amazonaws.com:5432/daf023q10sen3g?ssl=true')
var app = express();
var moment = require('moment');
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
    db.any('select* from products order by id ASC')
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
    var time = moment().format();
    var sql = "select * from products where id =" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { product: data[0],time:time })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
})

//addnewproduct
app.post('/product/add_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    // var tags = req.body.tags;
    
    var sql = `INSERT INTO products (id, title, price,created_at) VALUES ('${id}', '${title}', '${price}', '${time}')`;
    // res.send(sql)
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
})
app.get('/add_product', function (req, res) {
    var time = moment().format();
    res.render('pages/add_product', { time: time});
});
//Edit Product
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    var sql = `update products set title = '${title}', price = '${price}', created_at = '${time}' where id = '${id}'`;
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
    var time = moment().format();
    var sql = "select * from users where id =" + id;
    db.any(sql)
        .then(function (data) {
            res.render('pages/user_edit', { user: data[0],time:time })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
})

//Add New User
app.post('/user/add_user', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `INSERT INTO users (id, email, password)
    VALUES ('${id}', '${email}', '${password}')`;
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
})
app.get('/add_user', function (req, res) {
    var time = moment().format();
    res.render('pages/add_user',{time:time});
})

 //Edit User
app.post('/user/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `update users set email = '${email}', password = '${password}', created_at = '${time}' where id = '${id}'`;
    db.query(sql)
       .then(function(data){
           res.redirect('/users')
       })
       .catch(function(data){
           console.log('ERROR:'+console.error);
       })
});

//Delete User
app.get('/user_delete/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = 'DELETE FROM users';
    if (pid) {
        sql += ' where id =' + pid;
    }
    db.query(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
+
//Display All Purchases Item
app.get('/purchases', function (req, res) {
    db.any('SELECT purchases.id, name, address, users.email FROM purchases INNER JOIN users ON purchases.user_id = users.id')
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/purchases', { products: data })
        })
        .catch(function (error) {
            console.log('ERROR : ' + error);
        });
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
}); 
