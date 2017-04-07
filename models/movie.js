/**
 * Created by zj on 2017/3/29.
 */

var mongoose = require('mongoose');

//模式
var MovieSchema = require('../schemas/movie');

//编译模型
var Movie = mongoose.model('look',MovieSchema);

module.exports = Movie;