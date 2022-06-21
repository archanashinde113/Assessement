const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// this is our schema file for the mongodb

let accountSchema = new Schema({
  transaction_from:{type:String},
  transaction_to:{type:String},
  value:{type:String},
  transaction_hash:{type:String},
  addressData:{type:String},
  private_Key:{type:String},
  alltransaction:{type:String},
},
{timestamps:true});

// Export the model
module.exports = mongoose.model('Account', accountSchema);
