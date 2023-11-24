const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://soumya-9641:soumya@cluster0.y7qxfvq.mongodb.net/kodagu?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});