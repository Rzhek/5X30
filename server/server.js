require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { validateAccessToken } = require('./middleware/auth0.middleware');

const app = express();
app.use(express.json());
app.use(cors());
app.use(validateAccessToken);

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api', workoutRoutes);

const exerciseRoutes = require('./routes/exerciseRoutes');
app.use('/api', exerciseRoutes);

const recordRoutes = require('./routes/recordsRoutes');
app.use('/api', recordRoutes);

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
	res.send('Hello, Express & MongoDB!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//test comment
