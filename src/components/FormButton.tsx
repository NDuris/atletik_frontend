// src/components/FormButton.tsx
import React from 'react';

interface FormButtonProps {
  label: string;
  onClick: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({ label, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default FormButton;
