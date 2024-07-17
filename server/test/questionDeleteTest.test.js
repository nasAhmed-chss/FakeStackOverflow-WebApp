const mongoose = require('mongoose');
const Question = require('../models/questions');

describe('Testing Question Deletion', () => {
    beforeAll(async () => {
        const mongoUrl = 'mongodb://127.0.0.1:27017/fake_so';
        await mongoose.connect(mongoUrl);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should remove a question and reduce count by 1', async () => {
        const initialCount = await Question.countDocuments();
        const question = new Question({ title: 'Test Question', summary: 'Testing...', text: 'Details here' });
        await question.save();

        await Question.findByIdAndDelete(question._id);
        const finalCount = await Question.countDocuments();
        expect(finalCount).toBe(initialCount);
    });
});
