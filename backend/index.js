const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const stateRoutes = require('./routes/stateRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', taskRoutes);
app.use('/api', stateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
