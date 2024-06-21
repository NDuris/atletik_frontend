import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, Modal, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApiService from '../services/ApiService';
import '../styles/DeltagerListe.css'; // Importer stylesheet til styling

const DeltagerListe: React.FC = () => {
  const [deltagere, setDeltagere] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: '',
    direction: 'ascending'
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [nyDeltager, setNyDeltager] = useState<{ navn: string; koen: string; alder: number; klub: string }>({
    navn: '',
    koen: '',
    alder: 0,
    klub: ''
  });

  useEffect(() => {
    fetchDeltagere();
  }, []);

  const fetchDeltagere = async () => {
    try {
      const response = await ApiService.fetchDeltagere();
      setDeltagere(response.data);
    } catch (error) {
      console.error('Fejl ved hentning af deltagere:', error);
    }
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    setDeltagere((prevDeltagere) => {
      const sortedDeltagere = [...prevDeltagere].sort((a, b) => {
        if (key === 'navn') {
          return direction === 'ascending' ? a.navn.localeCompare(b.navn) : b.navn.localeCompare(a.navn);
        }
        if (key === 'koen') {
          return direction === 'ascending' ? a.koen.localeCompare(b.koen) : b.koen.localeCompare(a.koen);
        }
        if (key === 'alder') {
          return direction === 'ascending' ? a.alder - b.alder : b.alder - a.alder;
        }
        return 0;
      });
      return sortedDeltagere;
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDeltagere = deltagere.filter((deltager) =>
    deltager.navn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNyDeltager((prevDeltager) => ({
      ...prevDeltager,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (nyDeltager.koen === 'Kvinde') {
        nyDeltager.koen = 'F';
      } else nyDeltager.koen = 'M';
      await ApiService.addDeltager(nyDeltager); // Juster denne metode efter din API-service
      setShowModal(false);
      fetchDeltagere(); // Opdater listerne med den nye deltager
    } catch (error) {
      console.error('Fejl ved tilføjelse af deltager:', error);
    }
  };

  return (
    <div className="deltager-list-container">
      <h2 className="list-title">Deltagere</h2>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Tilføj Ny Deltager
      </Button>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Søg efter navn..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      <Tabs defaultActiveKey="alle" id="deltager-tabs" className="mb-3">
        <Tab eventKey="alle" title="Alle">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th onClick={() => handleSort('navn')}>Navn</th>
                <th onClick={() => handleSort('koen')}>Køn</th>
                <th onClick={() => handleSort('alder')}>Alder</th>
                <th>Klub</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeltagere.map((deltager) => (
                <tr key={deltager.id}>
                  <td>
                    <Link to={`/deltagere/${deltager.id}`} className="deltager-link">
                      {deltager.navn}
                    </Link>
                  </td>
                  <td>{deltager.koen}</td>
                  <td>{deltager.alder}</td>
                  <td>{deltager.klub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tab>
        <Tab eventKey="favoritter" title="Favoritter">
          <ul className="list-group">
            {/* Favoritter liste, skal implementeres */}
          </ul>
        </Tab>
      </Tabs>

      {/* Modal til at tilføje ny deltager */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tilføj Ny Deltager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNavn">
              <Form.Label>Navn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Indtast navn"
                name="navn"
                value={nyDeltager.navn}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formKoen">
              <Form.Label>Køn</Form.Label>
              <Form.Control
                as="select"
                name="koen"
                value={nyDeltager.koen}
                onChange={handleInputChange}
                required
              >
                <option value="Mand">Mand</option>
                <option value="Kvinde">Kvinde</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAlder">
              <Form.Label>Alder</Form.Label>
              <Form.Control
                type="number"
                placeholder="Indtast alder"
                name="alder"
                value={nyDeltager.alder}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formKlub">
              <Form.Label>Klub</Form.Label>
              <Form.Control
                type="text"
                placeholder="Indtast klub"
                name="klub"
                value={nyDeltager.klub}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Tilføj Deltager
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DeltagerListe;
