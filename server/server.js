// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const secretMade = crypto.randomBytes(64).toString('hex');
console.log("secret: ", secretMade);


const Tag = require('./models/tags')
const Answer = require('./models/answers')
const Question = require('./models/questions')
const User = require('./models/users');
const Comment = require('./models/comments');

const mongoDB = 'mongodb://127.0.0.1/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB successfully connected...'))
    .catch(err => console.error(err));

const app = express();
const port = 8000; // Change the port number here
app.use(cors());
app.use(express.json());

const time = 1000 * 60 * 60
app.use(session({
    secret: 'secretMade', // Change this to a real secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: time, sameSite: "lax" }, // Session lasts for an hours
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/sessions' })
}));

app.get("/", function (req, res) {
    res.send("Hello  new");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const properShutdown = async () => {
    try {
        await mongoose.connection.close();
        console.log('Server closed. Database instance disconnected');
        process.exit(0);
    } catch (err) {
        console.error('Error during database disconnection:', err);
        process.exit(1);
    }
};

process.on('SIGINT', properShutdown);


//get questions from db
app.get('/post/questions', async (req, res) => {
    try {
        const questions = await Question.find().populate('tags').populate('answers');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


//query questions
app.get('/post/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('tags').populate('answers');
        if (!question) return res.status(404).json({ message: 'Question not located' });
        res.json(question);



    } catch (err) {
        res.status(500).json({ message: err.message });

    }
});

// Query answers
app.get('/post/answers/:id', async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id).populate('comments'); // Populate related comments

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        res.json(answer); // Send back the found answer
    } catch (err) {
        console.error('Error fetching answer:', err); // Log the error
        res.status(500).json({ message: 'Internal server error', error: err.message }); // Send an error response
    }
});



//search

//post a new question
app.post('/post/questions', async (req, res) => {
    console.log('Data:', req.body);

    const { title, text, summary, asked_by } = req.body;

    const newQuestion = new Question({
        title,
        summary,
        text,
        tags: req.body.tagIds,
        asked_by,
    });

    try {
        console.log("Question saved")
        await newQuestion.save();

        res.status(201).json(newQuestion);

    } catch (err) {
        res.status(400).json({ message: 'Save Question Err', error: err });
    }
});





//get tags from db 
app.get('/post/tags', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})


//search tags
app.get('/post/tags', async (req, res) => {
    const tagName = req.query.name;
    try {
        const tags = await Tag.find({ name: tagName });
        res.json(tags);


    } catch (err) {
        res.status(500).json({ message: err.message });

    }

})

// get a specific tag by ID from the database
app.get('/post/tags/:id', async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (tag) {
            res.json(tag);
        } else {
            res.status(404).json({ message: "Tag not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get a specific tag by name from the database
app.get('/post/tags/name/:tagName', async (req, res) => {
    try {
        const tagName = req.params.tagName;
        const tag = await Tag.findOne({ name: tagName });
        if (tag) {
            res.json(tag);
        } else {
            //res.status(404).json({ message: "Tag not found" });
            res.json(null);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//post a new tag
app.post('/post/tags', async (req, res) => {
    const { name } = req.body;
    //check if name not present
    if (!name) {
        return res.status(400).json({ message: "Tag name required" })
    }

    try {
        const currentTag = await Tag.findOne({ name });
        if (currentTag) {
            return res.status(400).json({ message: 'Tag exists, try another' });
        }

        const newTag = new Tag({ name });
        await newTag.save();
        res.status(201).json(newTag);


    } catch (err) {
        res.status(500).json({ message: "Error: ", err })

    }


})




//gets answers from db 
app.get('/post/answers', async (req, res) => {

    try {
        const answers = await Answer.find();
        res.json(answers);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})


//post answer
app.post('/post/questions/:id/answers', async (req, res) => {
    console.log("Answer Data: ", req.body);
    const questionId = req.params.id;
    const { text, ans_by, ans_date_time } = req.body;
    try {
        const newAnswer = new Answer({
            text,
            ans_by,
            ans_date_time,
            question: questionId
        });

        const saveAnswer = await newAnswer.save();
        console.log('Saved Answer', saveAnswer);

        await Question.findByIdAndUpdate(questionId, { $push: { answers: saveAnswer._id } });
        console.log("Savign Complete");
        res.status(201).json(savedAnswer);
    }
    catch (err) {
        res.status(400).json({ message: 'Error', error: err });
    }
})


//increase views
app.patch('/post/questions/:id/view-added', async (req, res) => {

    try {
        const ques = await Question.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!ques) {
            return res.status(404).send('Question not found');
        }
        res.json(ques);

    } catch (err) {
        res.status(500).send('Increment Error');
    }
});

// get all users
app.get('/post/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetches all users from the database
        res.status(200).json(users); // Sends the users as a JSON response with status 200
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({ message: 'Error retrieving users', error: error }); // Sends an error response
    }
});

// get user by id
app.get('/posts/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
});


// get a user by username (email)
app.get('/post/users/username/:username', async (req, res) => {
    console.log('username passed in: ', req.params.username);
    try {
        const userName = req.params.username;
        const user = await User.findOne({ username: userName });
        if (user) {
            res.json(user);
        } else {
            // res.status(404).json({ message: "User not found" });
            res.json(null);
        }
    } catch (err) {
        console.log("error while searching user with username");
        res.status(500).json({ message: err.message });
    }
});

// registering a new user
app.post('/post/users/register', async (req, res) => {
    try {
        const { firstName, lastName, username, password } = req.body;
        const newUser = new User({ firstName, lastName, username, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while creating user', error });
    }
});


// login function
app.post('/post/users/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'No user with that email exits.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = user.username; // Start the session
            console.log("this is the session: ", req.session.user);
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid password.' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Error logging in.', error: err });
    }
});

// logout user
app.post('/logout', (req, res) => {
    if (req.session.user) {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Failed to destroy the session:', err);
                return res.status(500).json({ message: 'Failed to log out, please try again.' });
            }
            // Clear the session cookie
            res.clearCookie('connect.sid', { path: '/', httpOnly: true, sameSite: "lax" }); // Adjust these options to match your cookie settings
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } else {
        res.status(400).json({ message: 'No active session to log out from' });
    }
});

// check to see if there is currently a session
app.get('/check-session', async (req, res) => {
    if (req.session.user) {
        try {
            const user = await User.findOne({ username: req.session.user });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'Session is active', user: user });
        } catch (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ message: 'Failed to retrieve user', error: err });
        }
    } else {
        res.status(401).json({ message: 'No active session' });
    }
});

// up vote 
app.post('/post/questions/:questionId/upvote', async (req, res) => {
    const { userId } = req.body;
    const questionId = req.params.questionId;
    console.log('ueser id: ', userId);
    console.log('question id: ', questionId);

    try {
        const question = await Question.findByIdAndUpdate(questionId, { $inc: { votes: 1 } });
        if (!question) {
            return res.status(404).send('Question not found');
        }

        // Update the user's reputation
        //const reputationChange = voteType === 'up' ? 5 : -10;
        await User.findByIdAndUpdate(userId, { $inc: { reputation: 5 } });
        if (!question) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error });
    }
});

// down vote 
app.post('/post/questions/:questionId/downvote', async (req, res) => {
    const { userId } = req.body;
    const questionId = req.params.questionId;
    console.log('ueser id: ', userId);
    console.log('question id: ', questionId);

    try {
        const question = await Question.findByIdAndUpdate(questionId, { $inc: { votes: -1 } });
        if (!question) {
            return res.status(404).send('Question not found');
        }
        // Update the user's reputation
        //const reputationChange = voteType === 'up' ? 5 : -10;
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -10 } });
        if (!question) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Downvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error downvoting', error });
    }
});


// answer up vote 
app.post('/post/questions/:answerId/upvoteanswer', async (req, res) => {
    const { userId } = req.body;
    const answerId = req.params.answerId;
    console.log('ueser id: ', userId);
    console.log('answer id: ', answerId);

    try {
        const ans = await Answer.findByIdAndUpdate(answerId, { $inc: { votes: 1 } });
        if (!ans) {
            return res.status(404).send('Answer not found');
        }

        // Update the user's reputation
        //const reputationChange = voteType === 'up' ? 5 : -10;
        await User.findByIdAndUpdate(userId, { $inc: { reputation: 5 } });
        if (!ans) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error });
    }
});

// answer down vote 
app.post('/post/questions/:answerId/downvoteanswer', async (req, res) => {
    const { userId } = req.body;
    const answerId = req.params.answerId;
    console.log('ueser id: ', userId);
    console.log('answer id: ', answerId);

    try {
        const ans = await Answer.findByIdAndUpdate(answerId, { $inc: { votes: -1 } });
        if (!ans) {
            return res.status(404).send('Answer not found');
        }

        // Update the user's reputation
        //const reputationChange = voteType === 'up' ? 5 : -10;
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -10 } });
        if (!ans) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Downvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error });
    }
});
app.get('/post/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})



app.post('/post/comments', async (req, res) => {
    try {
        const newComment = new Comment({
            text: req.body.text,
            commented_by: req.body.commented_by,
            // Other necessary fields...
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/post/questions/:id/comments', async (req, res) => {
    const { text, commented_by } = req.body;

    try {
        // Create and save the new comment in one step
        const savedComment = await Comment.create({
            text,
            commented_by,
            votes: 0
        });

        // Update the question with the new comment's ID
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: savedComment._id } }, // Push the comment ID
            { new: true }
        );

        if (!question) {
            return res.status(404).send('Question not found');
        }

        // Optionally, populate comments to return the full comment details
        // await question.populate({ path: 'comments', model: Comment }).execPopulate();

        res.json(question.comments);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Server error');
    }
});

app.post('/post/answers/:id/comments', async (req, res) => {
    const { text, commented_by } = req.body;

    try {
        const answer = await Answer.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { text, commented_by, votes: 0 } } },
            { new: true }
        );

        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        res.json(answer.comments);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Server error');
    }
});


app.post('/post/:type/:id/link-comment', async (req, res) => {
    try {
        const { type, id } = req.params;
        const { commentId } = req.body;

        const update = { $push: { comments: commentId } };
        const Model = type === 'answers' ? Answer : Question;

        const updatedDocument = await Model.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//gets comments from db 
app.get('/post/comments', async (req, res) => {

    try {
        const comments = await Comments.find();
        res.json(comments);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})

// get all questions from specific user
app.get('/post/questions/user/:userId', async (req, res) => {
    try {
        const questions = await Question.find({ asked_by: req.params.userId });
        res.json(questions);
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        res.status(500).json({ message: "Error fetching questions" });
    }
});

// get all answers from specific user
app.get('/post/answers/user/:userId', async (req, res) => {
    try {
        const answers = await Answer.find({ ans_by: req.params.userId });
        res.json(answers);
    } catch (error) {
        console.error("Failed to fetch answers:", error);
        res.status(500).json({ message: "Error fetching answers" });
    }
});

// get all tags from specific user
app.get('/post/tags/user/:userId', async (req, res) => {
    try {
        // Fetch all questions by the user and only select the 'tags' field
        const questions = await Question.find({ asked_by: req.params.userId }).select('tags');

        // Extract tag IDs from the questions
        const tagIds = questions.reduce((acc, question) => {
            question.tags.forEach(tag => {
                if (acc.indexOf(tag.toString()) === -1) {
                    acc.push(tag.toString()); // Ensure uniqueness
                }
            });
            return acc;
        }, []);

        // Fetch unique tags using the list of unique IDs
        const uniqueTags = await Tag.find({ '_id': { $in: tagIds } });
        res.json(uniqueTags);
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        res.status(500).json({ message: "Error fetching tags" });
    }
});


app.delete('/post/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        await Question.deleteMany({ asked_by: username });

        const userQuestions = await Question.find({ asked_by: username });

        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

app.delete('/post/questions/:id', async (req, res) => {
    try {
        const questionId = req.params.id;

        // First, find and delete all answers related to the question
        await Answer.deleteMany({ question: questionId });

        // Then, delete the question itself
        await Question.findByIdAndDelete(questionId);

        res.status(200).json({ message: 'Question and associated answers deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Error deleting question', error });
    }
});




app.patch('/post/questions/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        const updatedData = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(questionId, updatedData, { new: true });
        if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
        res.json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.patch('/post/answers/:id', async (req, res) => {
    try {
        const answerId = req.params.id;
        const updatedData = req.body;

        const updatedAnswer = await Answer.findByIdAndUpdate(answerId, updatedData, { new: true });

        if (!updatedAnswer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        res.status(200).json(updatedAnswer);
    } catch (error) {
        console.error('Error updating answer:', error);
        res.status(500).json({ message: 'Error updating answer', error });
    }
});


// comment up vote 
app.post('/post/questions/:commentId/upvotecomment', async (req, res) => {
    const { userId } = req.body;
    const commentId = req.params.commentId;
    console.log('ueser id: ', userId);
    console.log('comment id: ', commentId);

    try {
        const ans = await Comment.findByIdAndUpdate(commentId, { $inc: { votes: 1 } });
        if (!ans) {
            return res.status(404).send('Comment not found');
        }

        // Update the user's reputation
        //const reputationChange = voteType === 'up' ? 5 : -10;
        await User.findByIdAndUpdate(userId, { $inc: { reputation: 5 } });
        if (!ans) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error });
    }
});

// comment down vote 
app.post('/post/questions/:commentId/downvotecomment', async (req, res) => {
    console.log('got here');
    const { userId } = req.body;
    const commentId = req.params.commentId;
    console.log('ueser id: ', userId);
    console.log('comment id: ', commentId);

    try {
        const ans = await Comment.findByIdAndUpdate(commentId, { $inc: { votes: -1 } });
        if (!ans) {
            return res.status(404).send('Comment not found');
        }

        // Update the user's reputation
        //const reputationChange = voteType === 'up' ? 5 : -10;
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -10 } });
        if (!ans) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Downvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error });
    }
});

//
app.delete('/post/tags/:id', async (req, res) => {
    try {
        const tagId = req.params.id;

        console.log("Tag before");
        // Delete the tag if not used by other users
        await Tag.findByIdAndDelete(tagId);
        console.log("Tag deleted");

        res.status(200).json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ message: 'Error deleting tag', error });
    }
});


app.delete('/post/answers/:id', async (req, res) => {
    try {
        const answerId = req.params.id;

        // Delete the answer by its ID
        const deletedAnswer = await Answer.findByIdAndDelete(answerId);

        if (!deletedAnswer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // If you have additional clean-up logic, add it here.
        // For example, if you need to update the related question to remove the deleted answer's reference:
        const questionId = deletedAnswer.question;
        await Question.updateOne({ _id: questionId }, { $pull: { answers: answerId } });

        res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

app.patch('/post/tags/:id', async (req, res) => {
    try {
        const tagId = req.params.id;

        // Destructure the name from the request body
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Tag name is required' });
        }

        // Update the tag with the new name
        const updatedTag = await Tag.findByIdAndUpdate(tagId, { name }, { new: true });

        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({ success: true, message: 'Tag edited successfully', tag: updatedTag });
    } catch (error) {
        console.error('Error editing tag:', error);
        res.status(500).json({ message: 'Error editing tag', error });
    }
});


