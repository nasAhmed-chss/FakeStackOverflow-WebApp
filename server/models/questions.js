// Question Document Schema

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 50 },
    summary: { type: String, required: true, maxlength: 140 },
    text: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    asked_by: { type: String, default: 'Anonymous' },
    ask_date_time: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
});

questionSchema.virtual('url')
    .get(function () {
        return 'posts/question/' + this._id;
    });

module.exports = mongoose.model('Question', questionSchema);

