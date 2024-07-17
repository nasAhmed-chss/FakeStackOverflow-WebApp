import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditTag({ tagId, setCurrentView }) {
    const [tagData, setTagData] = useState(null);
    const [tagName, setTagName] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Fetch tag data by ID
    useEffect(() => {
        const fetchTag = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/tags/${tagId}`);
                const tag = response.data;

                setTagData(tag);
                setTagName(tag.name); // Set the name to edit
            } catch (error) {
                console.error("Error fetching tag:", error);
            }
        };

        fetchTag();
    }, [tagId]);

    // Validate the form
    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (tagName.trim() === '') {
            errors.nameError = 'Tag name cannot be empty';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const updateData = {
                name: tagName,
            };

            const response = await axios.patch(`http://localhost:8000/tags/${tagId}`, updateData);

            if (response.status === 200) {
                console.log("Tag updated:", response.data);
                setCurrentView('tagList'); // Navigate to the tag list or another desired view
            }
        } catch (error) {
            console.error("Error updating tag:", error);
        }
    };

    return (
        <div className="edit-tag-form-container">
            <div className="tag-edit">
                <h2>Edit Tag</h2>

                <div className="form-group">
                    <label htmlFor="tagName">Tag Name*</label>
                    <input
                        type="text"
                        id="tagName"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="Edit the tag name"
                    />
                    {formErrors.nameError && (
                        <span className="error-message">{formErrors.nameError}</span>
                    )}
                </div>

                <div className="form-group">
                    <button className="btn" onClick={handleSubmit}>
                        Update Tag
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditTag;
