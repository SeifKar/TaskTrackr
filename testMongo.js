const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tasktrackr', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
    process.exit(0);
})
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});
