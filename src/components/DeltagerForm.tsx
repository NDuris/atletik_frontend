// src/components/DeltagerForm.tsx
import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormButton from './FormButton';

const DeltagerForm: React.FC = () => {
  const [navn, setNavn] = useState('');
  const [koen, setKoen] = useState<string | number>(''); // Initialisering af koen state
  const [alder, setAlder] = useState('');
  const [klub, setKlub] = useState('');

  const handleSave = () => {
    // Gem data eller send til backend
    console.log('Gem data:', { navn, koen, alder, klub });
    // Eksempel: opdatering til backend ville ske her
  };

  return (
    <div>
      <h2>Opret Deltager</h2>
      <FormInput label="Navn" type="text" value={navn} onChange={setNavn} />
      <FormSelect
        label="Køn"
        options={[
          { value: 'mand', label: 'Mand' },
          { value: 'kvinde', label: 'Kvinde' },
        ]}
        value={koen}
        onChange={(value) => setKoen(value)}
      />
      <FormInput label="Alder" type="text" value={alder} onChange={setAlder} />
      <FormInput label="Klub" type="text" value={klub} onChange={setKlub} />
      <FormButton label="Gem" onClick={handleSave} />
    </div>
  );
};

export default DeltagerForm;
