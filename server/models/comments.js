// Schema for comments

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    commented_by: String,
    votes: { type: Number, default: 0 },
    comment_date_time: { type: Date, default: Date.now() },
});

commentSchema.virtual('url')
    .get(function () {
        return 'posts/users/' + this._id;
    });

module.exports = mongoose.model("Comment", commentSchema);
