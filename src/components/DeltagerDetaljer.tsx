// DeltagerDetaljer.tsx

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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

  if (loading) {
    return <p>Loading...</p>; // Viser en loading-indikator så længe dataen hentes
  }

  return (
    <div className="deltager-detaljer-container">
      {Object.keys(deltager).length > 0 ? (
        <>
          <h2>{deltager.data.navn}</h2>
          <p>Køn: {deltager.data.koen}</p>
          <p>Alder: {deltager.data.alder}</p>

          <h3>Resultater</h3>
          <table>
            <thead>
              <tr>
                <th>Dato</th>
                <th>Resultat</th>
                <th>Disciplin</th>
              </tr>
            </thead>
            <tbody>
              {resultater.map(resultat => (
                <tr key={resultat.id}>
                  <td>{resultat.dato}</td>
                  <td>{resultat.resultatvaerdi}</td>
                </tr>
              ))}
            </tbody>  
          </table>

          <Link to={`/deltagere/${id}/rediger`}>Rediger deltager</Link>
        </>
      ) : (
        <p>Noget gik galt. Kunne ikke indlæse deltageroplysninger.</p>
      )}
    </div>
  );
};

export default DeltagerDetaljer;
