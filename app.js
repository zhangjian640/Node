/**
 * Created by zj on 2017/4/6.
 */
var express = require("express"); // express模块
var app = express(); // process是全局变量

var path = require('path'); //查找路径

var port = process.env.PORT || 3000; // 端口
app.listen(port); // 监听

var _underscore = require('underscore'); // extend方法用新对象里的字段替换老的字段

app.locals.moment = require("moment");// 载入moment模块，格式化日期

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/look");
/*  mongoose 简要知识点补充
 * mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
 * Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
 * Model对象表示集合中的所有文档。
 * Document对象作为集合中的单个文档的表示。
 * mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
 * */

var serveStatic = require('serve-static');  // 静态文件处理
app.use(serveStatic('public')); // 路径：public
var bodyParser = require('body-parser'); // bodyParser模块来做文件解析，将表单里的数据进行格式化
app.use(bodyParser.urlencoded({ extended: true }));
// 返回一个只解析urlencoded消息体的中间件，只接受utf-8对消息体进行编码
// 同时支持自动的gzip/deflate编码解析过的消息放在req.body对象中。
// 任何类型(当extended设置为true)
app.use(bodyParser.json());

app.set("views", "./views/pages"); // 视图根目录
app.set("view engine", "jade"); // 视图引擎

var Movie = require("./models/movie");

// index page 首页
app.get("/", function (req, res) {

  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: '首页',
      movies: movies
    })
  });
});

// detail page 详情页
app.get("/movie/:id", function (req, res) {
  var id = req.params.id;
  Movie.findById(id, function (err, movie) {
    if(err){
      console.log(err);
    }
    res.render('detail', {
      title: '详情页',
      movie:movie
    })
  });
});

// 列表页的表单提交
app.post('/admin/movie/new', function (req, res) {
  console.log(req.body.movie);
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id !== 'undefined') {  // 已经存在的
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _underscore.extend(movie, movieObj);

      _movie.save(function (err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/'+ movie._id);
      });
    });
  } else { // 添加
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    });

    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/'+ movie._id);
    });
  }
});


// admin page 后台录入页
app.get("/admin/movie", function (req, res) {
  res.render("admin", {
    title: "后台录入页",
    movie: {
      director: '',
      country:'',
      language: '',
      title: '',
      year: '',
      poster: '',
      flash: '',
      summary: ''
    }
  });
});

//admin update movie
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render("admin", {
        title: "后台录入页",
        movie: movie
      });
    });
  }
});

// list page 列表页
app.get("/admin/list", function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
    }

    res.render("list", {
      title: "列表页",
      lists: movies
    });
  });
});
console.log('look 项目已启动' ,port);