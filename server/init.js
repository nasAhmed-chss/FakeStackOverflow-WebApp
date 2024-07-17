// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.


// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

let adminUsername = userArgs[0];
let adminPassword = userArgs[1];

if (!adminUsername || !adminPassword) {
    console.log('ERROR: Must provide an admin email/username and password.');
    return;
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users');
let Comment = require('./models/comments')


let mongoose = require('mongoose');
// let mongoDB = userArgs[0];
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments, votes) {
    answerdetail = { text: text };
    if (ans_by != false) answerdetail.ans_by = ans_by;
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (comments != false) answerdetail.comments = comments;
    if (votes != false) answerdetail.votes = votes;

    let answer = new Answer(answerdetail);
    return answer.save();
}

function questionCreate(title, summary, text, tags, answers, comments, asked_by, ask_date_time, views, votes) {
    qstndetail = {
        title: title,
        text: text,
        summary: summary,
        tags: tags,
        asked_by: asked_by
    }
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
    if (comments != false) qstndetail.comments = comments;
    if (votes != false) qstndetail.votes = votes;


    let qstn = new Question(qstndetail);
    return qstn.save();
}

function createAdmin(firstName, lastName, username, password) {
    let user = new User({ firstName, lastName, username, password, isAdmin: true });
    return user.save();
}

function createUser(firstName, lastName, username, password, rep) {
    newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password
    }
    if (rep != false) newUser.reputation = rep;
    let user = new User(newUser);
    return user.save();
}

function createComment(text, username) {
    let comment = new Comment({ text: text, commented_by: username });
    return comment.save();
}

const populate = async () => {
    let t1 = await tagCreate('react');
    let t2 = await tagCreate('javascript');
    let t3 = await tagCreate('android-studio');
    let t4 = await tagCreate('shared-preferences');
    let t5 = await tagCreate('test-tag1');
    let t6 = await tagCreate('test-tag2');
    let t7 = await tagCreate('test-tag3');
    let c1 = await createComment('commetns 1', 'tester@test.com');
    let c2 = await createComment('comments 2', 'tester@test.com');
    let c3 = await createComment('comments 3', 'tester@test.com');
    let c4 = await createComment('comments 4', 'tester@test.com');
    let c5 = await createComment('comments 5', 'tester@test.com');
    let c6 = await createComment('comments 6', 'tester@test.com');
    let c7 = await createComment('comments 7', 'tester@test.com');
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'may@may.com', false);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'john@stack.com', false);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'bob@bob.com', false);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'john@stack.com', false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'may@may.com', false);
    let a6 = await answerCreate('tesing answers1', 'tester@test.com', false);
    let a7 = await answerCreate('tesing answers2', 'tester@test.com', false);
    let a8 = await answerCreate('tesing answers3', 'tester@test.com', false);
    let a9 = await answerCreate('tesing answers4', 'tester@test.com', false);
    let a10 = await answerCreate('tesing answers5', 'tester@test.com', false);
    let a11 = await answerCreate('tesing answers6', 'tester@test.com', false);
    await questionCreate('Programmatically navigate using React router', 'example of summary here', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], [], 'john@stack.com', false, false, 10);
    await questionCreate('android studio save string shared preference', 'start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], [], 'bob@bob.com', false, 121, 5);
    await questionCreate('question to overload', 'overloading', 'tesing question', [t1, t2, t3, t4, t5, t6, t7], [a1, a2, a3, a4, a5, a6, a6, a7, a8, a9, a10, a11], [c1, c2, c3, c4, c5, c6, c7], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload1', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload2', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload3', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload4', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload5', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload6', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload7', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload8', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);
    await questionCreate('question to overload9', 'overloading', 'tesing question', [], [], [], 'tester@test.com', false, 121, 5);


    try {
        await createAdmin('Admin', 'Admin', adminUsername, adminPassword);
        console.log('Admin user created successfully');

        await createUser('Tester', 'Tester', 'tester@test.com', 'pass');
        console.log('Tester created successfully');

        await createUser('Joji', 'John', 'john@stack.com', 'password', 45);
        console.log('Joji John created successfully');

        await createUser('Bob', 'Bobby', 'bob@bob.com', 'password', 50);
        console.log('Bob Bobby created successfully');

        await createUser('May', 'Hay', 'may@may.com', 'password', 0);
        console.log('May Hay created successfully');

    } catch (error) {
        console.error('ERROR: Unable to create a user:', error);
    }



    if (db) db.close();
    console.log('done');
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');
