import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarraNavegacion from './components/BarraNavegacion';
import PaginaDestinos from './pages/PaginaDestinos';
import PaginaDetalleDestino from './pages/PaginaDetalleDestino';
import './App.css';

function App() {
  // Moneda por defecto: CLP (Pesos Chilenos), cambiable a USD a gusto del usuario
  const [currency, setCurrency] = useState('CLP');

  const [tripPlan, setTripPlan] = useState({
    destinationId: 'paris',
    destinationName: 'París',
    flight: null,
    hotel: null,
  });

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-shell">
        <BarraNavegacion
          tripPlan={tripPlan}
          currency={currency}
          onCurrencyChange={setCurrency}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<PaginaDestinos currency={currency} />} />
            <Route path="/destinos" element={<PaginaDestinos currency={currency} />} />
            <Route
              path="/destinos/:destinationId"
              element={
                <PaginaDetalleDestino
                  tripPlan={tripPlan}
                  onUpdateTripPlan={setTripPlan}
                  currency={currency}
                />
              }
            />
            <Route
              path="*"
              element={
                <div className="container not-found-box">
                  <h2>Página no encontrada (404)</h2>
                  <p>La página que buscas no existe o fue movida.</p>
                  <Link to="/destinos" className="btn btn-primary">
                    Volver al listado de destinos
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container footer-content">
            <div>
              <strong>Travelsti • Agencia de Viajes &amp; Turismo Internacional</strong>
              <p>
                © {new Date().getFullYear()} Travelsti. Todos los derechos reservados. Explora el
                mundo con vuelos y alojamientos seleccionados a tu medida.
              </p>
            </div>
            <div className="footer-links">
              <Link to="/">Inicio</Link>
              <Link to="/destinos">Destinos</Link>
              <Link to="/destinos/paris">París</Link>
              <Link to="/destinos/tokio">Tokio</Link>
              <Link to="/destinos/cusco">Cusco</Link>
              <Link to="/destinos/cancun">Cancún</Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
