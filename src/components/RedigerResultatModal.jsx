import React, { useState } from 'react';
import Modal from 'react-modal';

const EditResultModal = ({ isOpen, onRequestClose, onSave, initialData }) => {
  const [resultatvaerdi, setResultatvaerdi] = useState(initialData.resultatvaerdi);

  const handleSave = () => {
    onSave({ ...initialData, resultatvaerdi });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Rediger resultat"
      appElement={document.getElementById('root')}
    >
      <h2>Rediger resultat</h2>
      <form onSubmit={handleSave}>
        <label>
          Resultatværdi:
          <input
            type="text"
            value={resultatvaerdi}
            onChange={(e) => setResultatvaerdi(e.target.value)}
            required
          />
        </label>
        <button type="submit">Gem ændringer</button>
      </form>
    </Modal>
  );
};

export default EditResultModal;
