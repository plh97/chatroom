const mongoose = require('mongoose');
mongoose.connect('mongodb://root:ewqewq@mongodb:27017', {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;
