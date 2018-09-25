const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

const port = 5000;

// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch((err) => {
    console.log(err);
  });

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// routes
app.get('/', (req, res) => {
  const title = 'Welcome!!!'
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// start server
app.listen(port, () => {
  console.log(`Server started on ${port} ...`);
});