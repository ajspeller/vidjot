const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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

// load Idea Model
require('./models/Idea');
const Idea = mongoose.model('idea');

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// index route
app.get('/', (req, res) => {
  const title = 'Welcome!!!'
  res.render('index', {
    title
  });
});

// about route
app.get('/about', (req, res) => {
  res.render('about');
});

// add idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// processidea form
app.post('/ideas', (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    res.send('passed');
  }
});


// start server
app.listen(port, () => {
  console.log(`Server started on ${port} ...`);
});