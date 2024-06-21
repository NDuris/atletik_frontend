import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ApiService from '../services/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResultatListe: React.FC = () => {
  const [resultater, setResultater] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: '',
    direction: 'ascending'
  });
  const [deltagere, setDeltagere] = useState<any[]>([]);
  const [discipliner, setDiscipliner] = useState<any[]>([]);
  const [editingResultatId, setEditingResultatId] = useState<number | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  const [selectedDeltager, setSelectedDeltager] = useState<string>('');
  const [selectedDisciplin, setSelectedDisciplin] = useState<string>('');
  const [eventResults, setEventResults] = useState<{ deltagerId: string; resultatvaerdi: string }[]>([]);

  useEffect(() => {
    fetchResultater();
    fetchDeltagere();
    fetchDiscipliner();
  }, []);

  const fetchDeltagere = async () => {
    try {
      const response = await ApiService.fetchDeltagere();
      setDeltagere(response.data);
    } catch (error) {
      console.error('Fejl ved hentning af deltagere:', error);
    }
  };

  const fetchDiscipliner = async () => {
    try {
      const response = await ApiService.fetchDiscipliner();
      setDiscipliner(response.data);
    } catch (error) {
      console.error('Fejl ved hentning af discipliner:', error);
    }
  };

  const fetchResultater = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.fetchResultater();
      setResultater(response.data);
    } catch (error) {
      console.error('Fejl ved hentning af resultater:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    setResultater((prevResultater) => {
      const sortedResultater = [...prevResultater].sort((a, b) => {
        if (key === 'disciplinNavn') {
          return direction === 'ascending'
            ? a.disciplinNavn.localeCompare(b.disciplinNavn)
            : b.disciplinNavn.localeCompare(a.disciplinNavn);
        }
        if (key === 'resultatvaerdi') {
          return direction === 'ascending'
            ? parseFloat(a.resultatvaerdi) - parseFloat(b.resultatvaerdi)
            : parseFloat(b.resultatvaerdi) - parseFloat(a.resultatvaerdi);
        }
        if (key === 'deltagerNavn') {
          return direction === 'ascending'
            ? a.deltagerNavn.localeCompare(b.deltagerNavn)
            : b.deltagerNavn.localeCompare(a.deltagerNavn);
        }
        if (key === 'deltagerKoen') {
          return direction === 'ascending'
            ? a.deltagerKoen.localeCompare(b.deltagerKoen)
            : b.deltagerKoen.localeCompare(a.deltagerKoen);
        }
        if (key === 'deltagerAlder') {
          return direction === 'ascending'
            ? a.deltagerAlder - b.deltagerAlder
            : b.deltagerAlder - a.deltagerAlder;
        }
        if (key === 'dato') {
          return direction === 'ascending'
            ? new Date(a.dato).getTime() - new Date(b.dato).getTime()
            : new Date(b.dato).getTime() - new Date(a.dato).getTime();
        }
        return 0;
      });
      return sortedResultater;
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredResultater = resultater.filter(
    (resultat) =>
      (resultat.deltagerNavn && resultat.deltagerNavn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resultat.disciplinNavn && resultat.disciplinNavn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (resultatId: number) => {
    const resultatToEdit = resultater.find((r) => r.resultatId === resultatId);
    if (resultatToEdit) {
      setEditingResultatId(resultatId);
      setEditingValue(resultatToEdit.resultatvaerdi);
    }
  };

  const handleCancelEdit = () => {
    setEditingResultatId(null);
    setEditingValue('');
  };

  const handleSubmitEdit = async (resultatId: number, newValue: string) => {
    try {
      const updatedResultat = await ApiService.updateResultat(resultatId, { resultatvaerdi: newValue });
      setResultater((prevResultater) =>
        prevResultater.map((resultat) =>
          resultat.resultatId === resultatId ? { ...resultat, resultatvaerdi: updatedResultat.data.resultatvaerdi } : resultat
        )
      );
      setEditingResultatId(null);
      setEditingValue('');
    } catch (error) {
      console.error('Fejl ved opdatering af resultat:', error);
    }
  };

  const handleDeleteConfirmation = (resultatId: number) => {
    setDeleteConfirmationId(resultatId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  const handleDelete = async (resultatId: number) => {
    try {
      await ApiService.deleteResultat(resultatId);
      setResultater((prevResultater) => prevResultater.filter((resultat) => resultat.resultatId !== resultatId));
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Fejl ved sletning af resultat:', error);
    }
  };

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddEventModalOpen = () => {
    setShowAddEventModal(true);
  };

  const handleAddEventModalClose = () => {
    setShowAddEventModal(false);
    setEventResults([]); // Nulstil eventuelle resultater
    setSelectedDeltager('');
    setSelectedDisciplin('');
  };

  const handleAddResultat = async () => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      const newResultat = await ApiService.addResultat({
        deltagerId: selectedDeltager,
        disciplinId: selectedDisciplin,
        resultatvaerdi: editingValue,
        dato: formattedDate
      });

      setResultater((prevResultater) => [...prevResultater, newResultat.data]);
      setShowAddModal(false);
      fetchResultater();
    } catch (error) {
      console.error('Fejl ved tilføjelse af resultat:', error);
    }
  };

  const handleAddEventResultat = async () => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      // Loop gennem eventResults og tilføj hvert resultat
      for (const eventResult of eventResults) {
        await ApiService.addResultat({
          deltagerId: eventResult.deltagerId,
          disciplinId: selectedDisciplin,
          resultatvaerdi: eventResult.resultatvaerdi,
          dato: formattedDate
        });
      }

      setShowAddEventModal(false);
      fetchResultater();
    } catch (error) {
      console.error('Fejl ved tilføjelse af event:', error);
    }
  };

  const handleAddEventResult = (index: number, field: 'deltagerId' | 'resultatvaerdi', value: string) => {
    const updatedResults = [...eventResults];
    updatedResults[index][field] = value;
    setEventResults(updatedResults);
  };

  const handleAddEventRow = () => {
    setEventResults((prevResults) => [...prevResults, { deltagerId: '', resultatvaerdi: '' }]);
  };

  return (
    <div className="resultat-list-container">
      <h2 className="list-title">Resultater</h2>
      <div className="button-container">
        <Button variant="success" onClick={handleAddModalOpen}>
          Tilføj resultat
        </Button>
        <Button variant="info" onClick={handleAddEventModalOpen}>
          Tilføj event
        </Button>
      </div>
      <div className="search-bar mb-3">
        <input
          type="text"
          placeholder="Søg efter navn eller disciplin..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th onClick={() => handleSort('disciplinNavn')}>Disciplin</th>
            <th onClick={() => handleSort('resultatvaerdi')}>Resultat</th>
            <th onClick={() => handleSort('deltagerNavn')}>Navn</th>
            <th onClick={() => handleSort('deltagerKoen')}>Køn</th>
            <th onClick={() => handleSort('deltagerAlder')}>Alder</th>
            <th onClick={() => handleSort('dato')}>Dato</th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {filteredResultater.map((resultat) => (
            <tr key={resultat.resultatId}>
              <td>{resultat.disciplinNavn}</td>
              <td>{resultat.resultatvaerdi}</td>
              <td>{resultat.deltagerNavn}</td>
              <td>{resultat.deltagerKoen}</td>
              <td>{resultat.deltagerAlder}</td>
              <td>{resultat.dato}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEdit(resultat.resultatId)}>
                  Rediger
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteConfirmation(resultat.resultatId)}>
                  Slet
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Redigeringsmodal */}
      <Modal show={editingResultatId !== null} onHide={handleCancelEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Rediger resultat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Resultatværdi</Form.Label>
            <Form.Control type="text" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Annuller
          </Button>
          <Button variant="primary" onClick={() => handleSubmitEdit(editingResultatId!, editingValue)}>
            Gem ændringer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bekræftelse af sletning modal */}
      <Modal show={deleteConfirmationId !== null} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Bekræft sletning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Er du sikker på, at du vil slette dette resultat?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Annuller
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirmationId!)}>
            Slet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tilføj resultat modal */}
      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tilføj resultat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Vælg deltager</Form.Label>
            <Form.Control as="select" value={selectedDeltager} onChange={(e) => setSelectedDeltager(e.target.value)}>
              <option value="">Vælg deltager...</option>
              {deltagere.map((deltager) => (
                <option key={deltager.id} value={deltager.id}>
                  {deltager.navn}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Vælg disciplin</Form.Label>
            <Form.Control as="select" value={selectedDisciplin} onChange={(e) => setSelectedDisciplin(e.target.value)}>
              <option value="">Vælg disciplin...</option>
              {discipliner.map((disciplin) => (
                <option key={disciplin.id} value={disciplin.id}>
                  {disciplin.navn}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Resultatværdi</Form.Label>
            <Form.Control type="text" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Annuller
          </Button>
          <Button variant="primary" onClick={handleAddResultat}>
            Tilføj resultat
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tilføj event modal */}
      <Modal show={showAddEventModal} onHide={handleAddEventModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tilføj event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Vælg disciplin</Form.Label>
            <Form.Control as="select" value={selectedDisciplin} onChange={(e) => setSelectedDisciplin(e.target.value)}>
              <option value="">Vælg disciplin...</option>
              {discipliner.map((disciplin) => (
                <option key={disciplin.id} value={disciplin.id}>
                  {disciplin.navn}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {eventResults.map((result, index) => (
            <Row key={index}>
              <Col>
                <Form.Group>
                  <Form.Label>Vælg deltager</Form.Label>
                  <Form.Control
                    as="select"
                    value={result.deltagerId}
                    onChange={(e) => handleAddEventResult(index, 'deltagerId', e.target.value)}
                  >
                    <option value="">Vælg deltager...</option>
                    {deltagere.map((deltager) => (
                      <option key={deltager.id} value={deltager.id}>
                        {deltager.navn}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Resultatværdi</Form.Label>
                  <Form.Control
                    type="text"
                    value={result.resultatvaerdi}
                    onChange={(e) => handleAddEventResult(index, 'resultatvaerdi', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={handleAddEventRow} className="mb-3">
            Tilføj række
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddEventModalClose}>
            Annuller
          </Button>
          <Button variant="primary" onClick={handleAddEventResultat}>
            Tilføj event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResultatListe;
