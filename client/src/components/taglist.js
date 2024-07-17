import React from 'react';

const TagList = ({ tagIds, tags }) => {
    // Add null check for tagIds array
    if (!tagIds || !Array.isArray(tagIds)) return null;
    // console.log("these are the tags:", tags);
    // console.log("these are the tag IDs:", tagIds);

    return (
        <div className='question-tags'>
            {tagIds.map(tag => {
                return <span key={tag} className='tag'>{tag.name}</span>;
            })}
        </div>
    );
};

export default TagList;
