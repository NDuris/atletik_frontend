// src/components/DisciplinListe.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApiService from '../services/ApiService';
import '../styles/DisciplinListe.css'; // Importer stylesheet til styling

const DisciplinListe: React.FC = () => {
  const [discipliner, setDiscipliner] = useState<any[]>([]);

  useEffect(() => {
    fetchDiscipliner();
  }, []);

  const fetchDiscipliner = async () => {
    try {
      const response = await ApiService.fetchDiscipliner();
      setDiscipliner(response.data);
    } catch (error) {
      console.error('Error fetching discipliner:', error);
    }
  };

  return (
    <div className="disciplin-list-container">
      <h2 className="list-title">Discipliner</h2>
      <Tabs defaultActiveKey="alle" id="disciplin-tabs" className="mb-3">
        <Tab eventKey="alle" title="Alle">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Navn</th>
                </tr>
              </thead>
              <tbody>
                {discipliner.map((disciplin) => (
                  <tr key={disciplin.id}>
                    <td>
                      <Link to={`/discipliner/${disciplin.id}`} className="disciplin-link">
                        {disciplin.navn}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tab>
        <Tab eventKey="favoritter" title="Favoritter">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Navn</th>
                </tr>
              </thead>
              <tbody>
                {/* Favoritter liste, skal implementeres */}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
      <Link to="/discipliner/ny" className="btn btn-primary">Tilføj Ny Disciplin</Link>
    </div>
  );
};

export default DisciplinListe;
