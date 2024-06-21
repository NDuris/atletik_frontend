// src/components/FormSelect.tsx
import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, options, value, onChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      onChange(selectedValue);
    };

    return (
        <div>
          <label>{label}</label>
          <select value={value} onChange={handleChange}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    };

export default FormSelect;
