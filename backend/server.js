const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
