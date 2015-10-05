var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');

var Note = require('./modules/note');

var port = process.env.PORT || 4000;
var app = express();
var pageNum = 6;//单页显示数目
mongoose.connect('mongodb://localhost/note');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.listen(port);

console.log('note start on port ' + port);

//detail page
app.get('/detail/:id',function(req,res){
	var id = req.params.id;
	Note.findById(id,function(err,note){
		res.render('detail',{
			title : '详情页',
			note : note
		});
	});
});

//add page
app.get('/add',function(req,res){
	res.render('add',{
		title : '后台录入页',
		note : {
			title : "",
			author : "" ,
			date : "" ,
			content : "" 
		}
	});
});
//index
app.get('/',function(req,res){
	res.redirect('/list');
});


//list page
app.get('/list',function(req,res){
	var id = 0;
	var _num_ = 0;
	var _pageNum_ = pageNum;
	Note.count(function(err,num){
		_num_ = num;
	}); 
	Note.fetchLimit(pageNum,0,function(err,notes){
		if (err) {
			console.log(err);
		};
		res.render('list',{
			id : id,
			num : _num_,
			pageNum : _pageNum_,
			title : "列表页",
			notes : notes
		});
	});
});
app.get('/list/:id',function(req,res){
	var id = req.params.id;
	var _num_ = 0;
	var _pageNum_ = pageNum;
	Note.count(function(err,num){
		_num_ = num;
	}); 
	Note.fetchLimit(pageNum,pageNum*id,function(err,notes){
		if (err) {
			console.log(err);
		};
		res.render('list',{
			id : id,
			num : _num_,
			pageNum : _pageNum_,
			title : '列表页',
			notes : notes
		});
	});
});
//add new post
app.post('/note/new',function(req,res){
	var id = req.body.note._id;
	var noteObj = req.body.note
	var _note;

	if(id !== 'undefined'){
		Note.findById(id,function(err,note){
			if(err){
				console.log(err);
			}
			_note = _.extend(note,noteObj);
			_note.save(function(err,note){
				if(err){
					console.log(err);
				}
				res.redirect('/detail/' + _note._id);
			});
		})
	}else{
		_note = new Note({
			title : noteObj.title,
			author : noteObj.author,
			date : noteObj.date,
			content : noteObj.content,
		});
		_note.save(function(err, note){
			if(err){
				console.log(err)
			}
			res.redirect('/detail/' + note._id)
		})
	}
});

//edit page
app.get('/edit/:id',function(req,res){
	var id = req.params.id;
	console.log('updating ', id)
	if(id){
		Note.findById(id, function(err,note){
			res.render('edit',{
				title: '修改页',
				note: note
			})
		})
	}
});

//dele
app.delete('/list',function(req,res){

	var id = req.query.id
	console.log("deleting ", id)
	
	if(id){
		Note.remove({ _id : id}, function(err,note){
			if(err){
				console.log(err)
			} else {
				res.json({success: 1})
			}
		})
	}
})