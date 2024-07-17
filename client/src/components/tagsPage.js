import React from 'react';
import TagRow from './tagRow';

const TagsPage = ({ tags, questions, onSelectTag, onAskQuestion, isRegistered }) => {
    // Group tags in groups of 3
    const groupedTags = tags.reduce((group, tag, index) => {
        const groupIndex = Math.floor(index / 3);
        group[groupIndex] = [...(group[groupIndex] || []), tag];
        return group;
    }, []);

    return (
        <div className='tags-section'>
            <div className="tags-header">
                <h2 className="total-tags">{tags.length} Tags</h2>
                <h2 className="all-tags">All Tags</h2>
                {isRegistered && <button className='btn tags-ask-question' onClick={onAskQuestion}>Ask Question</button>}
            </div>
            {groupedTags.map((group, index) => (
                <TagRow key={index} tags={group} questions={questions} onSelectTag={onSelectTag} isRegistered={isRegistered} />
            ))}
        </div>
    );
};

export default TagsPage;
