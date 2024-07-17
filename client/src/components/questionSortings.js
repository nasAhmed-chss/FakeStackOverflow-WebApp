
export function sortQuestionsNewest(questions) {
    return [...questions].sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));

}

export function sortQuestionsActive(questions) {
    return [...questions].sort((a, b) => {
        const lastAnswerDateA = new Date(a.answers.reduce((latest, current) => new Date(latest.ans_date_time) > new Date(current.ans_date_time) ? latest : current, { ans_date_time: 0 }).ans_date_time);
        const lastAnswerDateB = new Date(b.answers.reduce((latest, current) => new Date(latest.ans_date_time) > new Date(current.ans_date_time) ? latest : current, { ans_date_time: 0 }).ans_date_time);
        return lastAnswerDateB - lastAnswerDateA;
    });
}


// Filter questions to only show those without answers
export function filterQuestionsUnanswered(questions) {
    return questions.filter((question) => question.answers.length === 0);
}
