const express = require('express');
const app = express();
const port = 3000;

const products = [
    { name: "Apple: ", country: "Italy", cost: 3, instock: 10 },
    { name: "Orange: ", country: "Spain", cost: 4, instock: 3 },
    { name: "Bean: ", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbag: ", country: "USA", cost: 1, instock: 8 },
  ];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});