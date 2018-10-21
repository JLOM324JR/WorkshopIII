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
    db.any('select* from products order by product_id ASC')
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
    var sql = "select * from products where product_id =" + pid;
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
    
    var sql = `INSERT INTO products (product_id, title, price,created_at) VALUES ('${id}', '${title}', '${price}', '${time}')`;
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
    var sql = `update products set title = '${title}', price = '${price}', created_at = '${time}' where product_id = '${id}'`;
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
        sql += ' where product_id =' + pid;
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
    
    var sql = 'select* from users order by user_id ASC';
    if (id) {
        sql += ' Where user_id =' + id;
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
    var sql = "select * from users where user_id =" + id;
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
    var sql = `INSERT INTO users (user_id, email, password,created_at) VALUES ('${id}', '${email}', '${password}', '${time}')`;
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
    var sql = `update users set email = '${email}', password = '${password}', created_at = '${time}' where user_id = '${id}'`;
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
        sql += ' where user_id =' + pid;
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

//report product
app.get('/purchases_item', function(req, res){
    var sql ='select products.product_id,products.title,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price from products inner join purchase_items on purchase_items.product_id=products.product_id group by products.product_id;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
 
        // console.log('DATA' + data);
        res.render('pages/purchases_item', { item: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })

});
app.get('/purchases', function(req, res) {
    var sql='select users.email,purchases.name,products.title,purchase_items.quantity,purchase_items.price*purchase_items.quantity as tatol FROM users INNER JOIN purchases ON purchases.user_id = users.user_id INNER JOIN purchase_items ON purchase_items.purchase_id=purchases.purchase_id   INNER JOIN products ON products.product_id = purchase_items.product_id order by purchase_items.price*purchase_items.quantity DESC limit 25'
    db.any(sql)
        .then(function (data) 
        {
            console.log('DATA' + data);
            res.render('pages/purchases', {purchases: data});
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
}); 
