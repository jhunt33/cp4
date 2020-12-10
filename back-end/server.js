//new server

const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/movies', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  poster: String,
  title: String,
  year: String,
  review: String,
  imdbID: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

app.post('/api/movieItems', async (req, res) => {
 // console.log("in post");
  const item = new Item({
    poster: req.body.poster,
    title: req.body.title,
    year: req.body.year,
    review: req.body.review,
    imdbID: req.body.imdbID,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/movieItems', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/movieItems/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      imdbID: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/movieItems/:id', async (req, res) => {
  try {
    const item = await Item.findOne({
      imdbID: req.params.id
    });
    item.review = req.body.review;
    //console.log(item.review);
    item.save();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3030, () => console.log('Server listening on port 3030!'));
