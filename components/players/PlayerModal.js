import React, { useState } from 'react';
import Modal from 'react-modal';

player, isOpen, onClose, onSubmit
const PlayerModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [formData, setFormData] = useState(player);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Player Form">
      <h2>{initialData ? 'Edit Player' : 'Create Player'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default PlayerModal;