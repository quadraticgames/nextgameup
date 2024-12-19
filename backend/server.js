const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Next Game Up API is running');
});

app.get('/api/boardgame/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `https://boardgamegeek.com/xmlapi2/thing?id=${req.params.id}&type=boardgame&stats=1`,
      {
        headers: {
          'Accept': 'application/xml',
          'Content-Type': 'application/xml',
        },
        timeout: 5000, // 5 second timeout
      }
    );

    if (!response.data) {
      return res.status(404).send('Game not found');
    }

    res.set('Content-Type', 'application/xml');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching game:', error.message);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send('No response from BoardGameGeek API');
    } else {
      res.status(500).send('Error processing request');
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
