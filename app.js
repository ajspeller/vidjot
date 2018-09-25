const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

const port = 5000;

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
  console.log(Date.now());
  next();
});

app.get('/', (req, res) => {
  res.send('INDEX');
});

app.get('/about', (req, res) => {
  res.send('ABOUT');
});

app.listen(port, () => {
  console.log(`Server started on ${port} ...`);
});