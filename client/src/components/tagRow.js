import React from 'react';
import TagBlock from './tagBlock';

const TagRow = ({ tags, questions, onSelectTag, currentView, handleDeleteTag, setRender, render, isRegistered }) => {
  console.log('questions: ', questions);
  // Check if questions array is null or undefined
  if (!questions) {
    return null; // Return null if questions array is null or undefined
  }

  return (
    <div className='tag-row'>
      {tags.map(tag => {
        // Filter questions that include the current tag id
        //const questionCount = questions.filter(q => q.tagIds && q.tagIds.includes(tag.tid)).length;
        const questionCount = questions.filter(q => q.tags.some(t => t._id === tag._id)).length;
        console.log('count: ', questionCount);

        return (
          <TagBlock
            key={tag._id} // Ensure each TagBlock has a unique key prop
            tag={tag}
            questionCount={questionCount}
            onSelectTag={() => onSelectTag(tag._id)}
            currentView={currentView} z
            handleDeleteTag={handleDeleteTag}
            setRender={setRender}
            render={render}
            isRegistered={isRegistered}
          />
        );
      })}
    </div>
  );
};

export default TagRow;
