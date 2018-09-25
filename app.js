const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

const port = 5000;

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