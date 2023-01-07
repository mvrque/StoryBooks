const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true  //whitespace trim
    },
    body: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'public', //public or private story
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //connect use to each story, who wrote what
        ref: 'User' //connect to user model with ref
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Story', StorySchema)