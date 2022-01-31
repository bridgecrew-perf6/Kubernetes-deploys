const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('{ "response": "Hello From the otherside" }');
});

app.get('/will', function (req, res) {
    res.send('{ "response": "Hello World" }');
});
app.get('/ready', function (req, res) {
    res.send('{ "response": " Great!, It works!" }');
});
app.listen(process.env.PORT || 3000);
module.exports = app;