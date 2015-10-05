var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
	title:String,
	author:String,
	date:String,
	content:String
});
NoteSchema.statics = {
	fetch : function(cb){
		return this.find({}).sort('date').exec(cb);
	},
	fetchLimit : function(limit,skip,cb){
		return this.find({}).sort('date').limit(limit).skip(skip).exec(cb);
	},
	findById : function(id,cb){
		return this.findOne({_id : id}).exec(cb);
	},
	getCount : function(cb){
		return this.find({}).count().exec(cd);
	}
}
module.exports = NoteSchema;