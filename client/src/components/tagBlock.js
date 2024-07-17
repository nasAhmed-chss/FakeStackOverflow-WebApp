import React, { useState } from 'react';
import axios from 'axios';

const TagBlock = ({ tag, questionCount, onSelectTag, currentView, handleDeleteTag, handleEditTag, setRender, render, isRegistered }) => {

    const handleEdit = async () => {
        if (questionCount > 1) {
            alert("You cannot edit this tag. Other users are using is.");
            return;
        }
        const tagName = tag.name; // Current tag name
        const newName = window.prompt("Edit Tag", tagName); // Prompt user for new tag name

        // If the prompt was canceled or the new name is empty/whitespace, do nothing
        if (!newName || newName.trim() === "") {
            return;
        }

        const trimmedName = newName.trim(); // Clean up the input

        if (trimmedName === tagName) {
            // If the new name is the same as the old one, do nothing
            return;
        }

        try {
            // Send PATCH request to update the tag name
            const response = await axios.patch(
                `http://localhost:8000/post/tags/${tag._id}`,
                { name: trimmedName }
            );

            if (response.data.success) {
                console.log("Tag updated:", response.data);
                if (handleEditTag) {
                    handleEditTag(tag._id, trimmedName); // Call a function to update parent state
                }
            } else {
                window.alert("Tag could not be updated. Try again later.");
                console.error("Tag update failed:", response.data);
            }
            setRender(!render);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    window.alert("Invalid tag name. Try again.");
                } else if (status === 404) {
                    window.alert("Tag not found.");
                } else {
                    window.alert("An error occurred. Try again later.");
                }

                console.error("Error updating tag:", data.message);
            } else {
                window.alert("Connection error. Check your network.");
                console.error("Network error:", error.message);
            }
        }
    };




    return (
        <div className='tag-block'>
            <button className='tag-name' onClick={() => onSelectTag(tag._id)}>
                {tag.name}
            </button>
            <div className='question-count'>{questionCount} questions</div>
            {currentView === 'profile' && isRegistered && (
                <>
                    <button className='btn' onClick={handleEdit}>Edit</button>
                    <button className='btn' onClick={() => handleDeleteTag(tag._id, questionCount)}>Delete</button>
                </>
            )}
        </div>
    );
};

export default TagBlock;
