const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser')



// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'summerintership'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE summerintership';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});

// Create Product table
app.get('/create_products_table', (req, res) => {
    let sql = 'CREATE TABLE products(id int AUTO_INCREMENT, name VARCHAR(255), description VARCHAR(255), brand VARCHAR(255), price VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Products table created...');
    });
});

// Create Product_Album table
app.get('/create_products_reviews_table', (req, res) => {
  let sql = 'CREATE TABLE products_reviews(id int AUTO_INCREMENT, product_id int, reviews_id int, PRIMARY KEY(id), FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE,FOREIGN KEY (reviews_id) REFERENCES reviews(id) ON UPDATE CASCADE )';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Product_Album table created...');
  });
});

// Create Product_Review table
app.get('/create_products_albums_table', (req, res) => {
  let sql = 'CREATE TABLE products_albums(id int AUTO_INCREMENT,product_id int, albums_id int, PRIMARY KEY(id), FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE,FOREIGN KEY (albums_id) REFERENCES albums(id) ON UPDATE CASCADE )';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Product_Review table created...');
  });
});
// Create Album table
app.get('/create_albums_table', (req, res) => {
  let sql = 'CREATE TABLE albums(id int AUTO_INCREMENT, product_id int,path VARCHAR(255), PRIMARY KEY(id), FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE  )';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Album table created...');
  });
});

// Create Review table
app.get('/create_reviews_table', (req, res) => {
  let sql = 'CREATE TABLE reviews(id int AUTO_INCREMENT, score int, description VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('Review table created...');
  });
});

// Insert post 1
app.get('/addproducts', (req, res) => {
  console.log(req.body)
    let product = {name:req.body.name, description:req.body.description,brand:req.body.brand,price:req.body.price};
    let sql = 'INSERT INTO products SET ?';
    let query = db.query(sql, product, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Product 1 added...');
    });
});

// Insert post 2
app.post('/product/:id/reviews', (req, res) => {
    let review = {score:'5', description:'This is desc number two'};
    let sql = 'INSERT INTO reviews SET ?';
    let sql2 = 'INSERT INTO products_reviews SET product_id = '+req.params.id+', reviews_id = LAST_INSERT_ID()';
    let query = db.query(sql, review, (err, result) => {
      db.query(sql2)
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
});

// Select posts
app.get('/getproducts', (req, res) => {
    let sql = 'SELECT * FROM products'; 
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.json(results);
    });
});

// Select single post
app.get('/getproducts/:id', (req, res) => {
    let sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
});

// Update post
app.get('/updateproducts/:id', (req, res) => {
    let newTitle = 'Updated name';
    let sql = `UPDATE products SET name = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Product name updated...');
    });
});

// Delete post
app.get('/deleteproducts/:id', (req, res) => {
    let sql = `DELETE FROM products WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Product deleted...');
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});