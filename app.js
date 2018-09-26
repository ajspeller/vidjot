const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const expressMessages = require('express-messages');
const flash = require('connect-flash');

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

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
  secret: 'luke-cage',
  resave: true,
  saveUninitialized: true,
}));

// connect-flash middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


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

// Ideas index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas', {
        ideas
      });
    });
});

// add idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// edit idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render('ideas/edit', {
        idea
      });
    });
});

// process idea form
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
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea added!');
        res.redirect('/ideas');
      });
  }
});

// edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      // new values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Video Idea edited!');
          res.redirect('/ideas');
        });
    });
});

// delete idea
app.delete('/ideas/:id', (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      idea.remove()
        .then(idea => {
          req.flash('success_msg', 'Video Idea removed!');
          res.redirect('/ideas');
        });
    });
});



// start server
app.listen(port, () => {
  console.log(`Server started on ${port} ...`);
});