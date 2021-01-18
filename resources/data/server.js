const express = require('express');
const app = express();
const cors = require('cors');
const data = require('./player-stats.json');

app.use(cors());

const playerStats = data;

app.get('/player-stats', (req, res) => {
  res.json(playerStats);
});

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});
