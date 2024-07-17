// test/questionModel.test.js
const Question = require('../models/questions');

describe('Question Model', () => {
    it('should be valid with required fields', async () => {
        const validQuestion = new Question({
            title: 'Valid Question Title',
            summary: 'A brief summary',
            text: 'This is the body of the question',
        });

        const validationError = validQuestion.validateSync();
        expect(validationError).toBeUndefined();
    });

    it('should fail validation when title is missing', async () => {
        const invalidQuestion = new Question({
            summary: 'A brief summary',
            text: 'This is the body of the question',
        });

        const validationError = invalidQuestion.validateSync();
        expect(validationError.errors['title']).toBeDefined();
    });
});
