/**
 * Created by zj on 2017/3/28.
 */
var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    year: Number,
    flash: String,
    poster: String,
    summary: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//每次存入数据时调用
MovieSchema.pre('save', function (next) {
    if (this.isNew) { // 数据是新数据
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

MovieSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

module.exports = MovieSchema;