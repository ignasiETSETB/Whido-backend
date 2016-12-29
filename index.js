
//Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const cors = require('cors');
const port = process.env.PORT || 3090;


//App setup
app.use(morgan('combined'));  //adds requests logs to console
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

app.listen(port);
console.log('Server listening on: ' + port);

router(app);
