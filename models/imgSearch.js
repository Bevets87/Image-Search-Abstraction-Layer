var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgSearchSchema = new Schema({
  search_item: {
    type: String
  },
  time_stamp: {
    type: String
  }
});

var imgSearch = mongoose.model('imgSearch', imgSearchSchema);

module.exports = imgSearch;
