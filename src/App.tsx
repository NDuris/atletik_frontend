// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DisciplinListe from './components/DisciplinListe.tsx';
import DeltagerListe from './components/DeltagerListe.tsx';
import ResultatListe from './components/ResultatListe.tsx';
import DisciplinDetaljer from './components/DisciplinDetaljer.tsx';
import DeltagerDetaljer from './components/DeltagerDetaljer.tsx';
import './styles/App.css'; // Importer CSS-filen

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <header className="title-banner">
          <h1>Athletics Event App</h1>
        </header>
        <div className="content">
          <div className="sidebar">
            <nav>
              <ul>
                <li>
                  <Link to="/discipliner">Discipliner</Link>
                </li>
                <li>
                  <Link to="/deltagere">Deltagere</Link>
                </li>
                <li>
                  <Link to="/resultater">Resultater</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="main-view">
            <Routes>
              <Route path="/" element={<DisciplinListe />} />
              <Route path="/discipliner" element={<DisciplinListe />} />
              <Route path="/discipliner/:id" element={<DisciplinDetaljer />} />
              <Route path="/deltagere" element={<DeltagerListe />} />
              <Route path="/deltagere/:id" element={<DeltagerDetaljer />} />
              <Route path="/resultater" element={<ResultatListe />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
