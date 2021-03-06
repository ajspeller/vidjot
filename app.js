const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const expressMessages = require('express-messages');
const flash = require('connect-flash');

const app = express();

const port = process.env.PORT || 5000;

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport config
require('./congif/passport')(passport);

let URI = 'mongodb://localhost/vidjot-dev';
if (process.env.NODE_ENV === 'production') {
  URI = process.env.MONGODB_URI
}

// connect to mongoose
mongoose.connect(URI, {
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

// body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
  secret: 'luke-cage',
  resave: true,
  saveUninitialized: true,
}));

// passport middleware === must be after express-session middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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

// use routes
app.use('/ideas', ideas);
app.use('/users', users);


// start server
app.listen(port, () => {
  console.log(`Server started on ${port} ...`);
});