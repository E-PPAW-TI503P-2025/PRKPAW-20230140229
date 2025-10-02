const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
const port = 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Muhammad Abdullah Faqih!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
