import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApiService from '../services/ApiService';
import '../styles/DisciplinDetaljer.css';

const DisciplinDetaljer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [disciplin, setDisciplin] = useState<any>({});
  const [deltagere, setDeltagere] = useState<any[]>([]);
  const [resultater, setResultater] = useState<any[]>([]);
  const [selectedResultat, setSelectedResultat] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: '',
    direction: 'ascending'
  });
  const [loading, setLoading] = useState(true); // State til at styre indlæsningstilstand

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (id) {
      try {
        const [disciplinResponse, deltagereResponse, resultaterResponse] = await Promise.all([
          ApiService.getDisciplin(parseInt(id)),
          ApiService.fetchDeltagereForDisciplin(parseInt(id)),
          ApiService.fetchResultaterForDisciplin(parseInt(id))
        ]);

        setDisciplin(disciplinResponse);
        setDeltagere(deltagereResponse);
        setResultater(resultaterResponse);
        setLoading(false); // Angiv loading til false når data er blevet hentet
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Hvis der opstår en fejl, skal loading også sættes til false
      }
    }
  };

  const handleEditClick = (resultat: any) => {
    setSelectedResultat(resultat);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedResultat) return;

      const editedResultat = {
        id: selectedResultat.resultatId,
        dato: selectedResultat.dato,
        resultatType: selectedResultat.resultatType,
        resultatvaerdi: selectedResultat.resultatvaerdi,
        deltagerId: selectedResultat.deltager.deltagerId,
        disciplinId: selectedResultat.disciplin.disciplinId
      };

      await ApiService.updateResultat(editedResultat.id, editedResultat);

      setResultater(prevResultater =>
        prevResultater.map(resultat =>
          resultat.id === selectedResultat.id ? editedResultat : resultat
        )
      );

    } catch (error) {
      console.error('Fejl ved opdatering af resultat:', error);
    }
  };

  const handleDeleteClick = (resultatId: number) => {
    
    const selected = resultater.find(resultat => resultat.resultatId === resultatId);
    setSelectedResultat(selected || null);
    setShowDeleteModal(true);
  };
  

  const handleConfirmDelete = async () => {
    try {
      if (!selectedResultat) return;

      console.log(selectedResultat);
      console.log(selectedResultat.resultatId);

      await ApiService.deleteResultat(selectedResultat.resultatId);

      setResultater(prevResultater =>
        prevResultater.filter(resultat => resultat.id !== selectedResultat.id)
      );

      setShowDeleteModal(false);
    } catch (error) {
      console.error('Fejl ved sletning af resultat:', error);
    }
  };


  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const sortBy = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    setResultater(prevResultater => {
      const sortedResultater = [...prevResultater].sort((a, b) => {
        if (key === 'dato') {
          return direction === 'ascending' ? (a.dato > b.dato ? 1 : -1) : (a.dato < b.dato ? 1 : -1);
        }
        if (key === 'resultatvaerdi') {
          return direction === 'ascending' ? (a.resultatvaerdi > b.resultatvaerdi ? 1 : -1) : (a.resultatvaerdi < b.resultatvaerdi ? 1 : -1);
        }
        if (key === 'koen') {
          return direction === 'ascending' ? (a.deltager.koen > b.deltager.koen ? 1 : -1) : (a.deltager.koen < b.deltager.koen ? 1 : -1);
        }
        if (key === 'alder') {
          return direction === 'ascending' ? (a.deltager.alder > b.deltager.alder ? 1 : -1) : (a.deltager.alder < b.deltager.alder ? 1 : -1);
        }
        return 0;
      });
      return sortedResultater;
    });
  };

  if (loading) {
    return <p>Loading...</p>; // Viser en loading-indikator så længe dataen hentes
  }

  return (
    <div className="disciplin-detaljer-container">
      <h2>{disciplin.data.navn}</h2>
      <p>Bedømmes på: {disciplin.data.resultatType}</p>

      <div className="data-table">
        <h3>Deltagere</h3>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
            </tr>
          </thead>
          <tbody>
            {deltagere.map(deltager => (
              <tr key={deltager.deltagerId}>
                <td><Link to={`/deltagere/${deltager.deltagerId}`}>{deltager.navn}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-table">
        <h3>Resultater</h3>
        <table>
          <thead>
            <tr>
              <th onClick={() => sortBy('dato')}>Dato</th>
              <th onClick={() => sortBy('resultatvaerdi')}>Resultat</th>
              <th>Navn</th>
              <th onClick={() => sortBy('koen')}>Køn</th>
              <th onClick={() => sortBy('alder')}>Alder</th>
              <th>Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {resultater.map(resultat => (
              <tr key={resultat.resultatId}>
                <td>{resultat.dato}</td>
                <td>{resultat.resultatvaerdi}</td>
                <td>{resultat.deltager.navn}</td>
                <td>{resultat.deltager.koen}</td>
                <td>{resultat.deltager.alder}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(resultat)}>Rediger</button>
                    <button onClick={() => handleDeleteClick(resultat.resultatId)}>Slet</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="modal-content">
            <h3>Er du sikker på, at du vil slette dette resultat?</h3>
            <p>Dato: {selectedResultat?.dato}</p>
            <p>Resultatværdi: {selectedResultat?.resultatvaerdi}</p>
            <p>Deltager: {selectedResultat?.deltager.navn}</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Ja, slet</button>
              <button onClick={handleCloseModal}>Annuller</button>
            </div>
          </div>
        </div>
      )}

      {selectedResultat && (
        <div className="edit-form">
          <h3>Rediger Resultat</h3>
          <form onSubmit={handleSaveEdit}>
            <label>Dato:</label>
            <input type="text" value={selectedResultat.dato} readOnly />
            <label>Resultatværdi:</label>
            <input
              type="text"
              value={selectedResultat.resultatvaerdi}
              onChange={(e) => setSelectedResultat({ ...selectedResultat, resultatvaerdi: e.target.value })}
            />
            <label>Deltager:</label>
            <input type="text" value={selectedResultat.deltager.navn} readOnly />
            <button type="submit">Gem Ændringer</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DisciplinDetaljer;
