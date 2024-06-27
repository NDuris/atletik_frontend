// DeltagerDetaljer.tsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import '../styles/DeltagerDetaljer.css';

interface DeltagerDetaljerProps {
  // Definér eventuelle props, hvis nødvendigt
}

const DeltagerDetaljer: React.FC<DeltagerDetaljerProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const [deltager, setDeltager] = useState<any>({});
  const [resultater, setResultater] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // State til at styre indlæsningstilstand
  const navigate = useNavigate(); // Brug useNavigate til at navigere


  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (id) {
      try {
        const [deltagerResponse, resultaterResponse] = await Promise.all([
          ApiService.getDeltager(parseInt(id)),
          ApiService.fetchResultaterForDeltager(parseInt(id)) // Bruger den nye fetch-metode
        ]);

        setDeltager(deltagerResponse);
        setResultater(resultaterResponse);
        console.log(resultaterResponse);
        setLoading(false); // Angiv loading til false når data er blevet hentet
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Hvis der opstår en fejl, skal loading også sættes til false
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await ApiService.deleteDeltager(parseInt(id));
        navigate('/deltagere'); // Naviger til deltageroversigten efter sletning
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Display a loading indicator while data is being fetched
  }

  return (
    <div className="deltager-detaljer-container">
      {Object.keys(deltager).length > 0 ? (
        <>
          <div className="deltager-info">
            <h2>{deltager.data.navn}</h2>
            <p>Køn: {deltager.data.koen}</p>
            <p>Alder: {deltager.data.alder}</p>
          </div>

          <h3>Resultater</h3>
          <div className="resultater-liste">
            {resultater.map(resultat => (
              <div className="resultat-item" key={resultat.id}>
              <p className="label">Dato: <span className="dato">{resultat.dato}</span></p>
              <p className="label">Disciplin: <span className="disciplin">{resultat.disciplinNavn}</span></p>
              <p className="label">Resultat: <span className="resultatvaerdi">{resultat.resultatvaerdi}</span></p>
            </div>
            ))}
          </div>

          <div className="action-buttons">
            <Link to={`/deltagere/${id}/rediger`}>Rediger deltager</Link>
            <button onClick={handleDelete}>Slet deltager</button> {/* Tilføj slet-knap */}
          </div>
        </>
      ) : (
        <p>Noget gik galt. Kunne ikke indlæse deltageroplysninger.</p>
      )}
    </div>
  );
};

export default DeltagerDetaljer;
