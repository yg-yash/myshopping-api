const mongoose = require('mongoose');

try {
  mongoose.connect('Your_MONGO_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.set('useCreateIndex', true);
  console.log('database connected');
} catch (error) {
  console.log('db error');

  console.log(error);
}
