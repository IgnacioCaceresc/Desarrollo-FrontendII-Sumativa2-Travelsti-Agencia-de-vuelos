import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TarjetaDestino from '../components/TarjetaDestino';

function PaginaDestinos({ currency = 'CLP' }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('Todos');

  const fetchDestinations = () => {
    setLoading(true);
    setError(null);

    fetch('/api/destinations')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los destinos disponibles.`);
        }
        return response.json();
      })
      .then((data) => {
        setDestinations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Ocurrió un error al cargar el catálogo de destinos.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const continents = useMemo(() => {
    const unique = new Set(destinations.map((d) => d.continent));
    return ['Todos', ...Array.from(unique)];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesContinent =
        selectedContinent === 'Todos' || dest.continent === selectedContinent;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.popularActivities.some((act) => act.toLowerCase().includes(query));

      return matchesContinent && matchesSearch;
    });
  }, [destinations, selectedContinent, searchTerm]);

  return (
    <div className="page-wrapper">
      <section className="hero-banner">
        <div className="container hero-single">
          <div className="hero-text">
            <div className="hero-badges">
              <span className="pill-tech pill-rest">Temporada 2025 • Cupos Confirmados</span>
              <span className="pill-tech pill-gql">Vuelos + Hoteles a Medida</span>
            </div>
            <h1>Planifica tu Próxima Aventura con Travelsti</h1>
            <p className="hero-description">
              Explora nuestra selección internacional de destinos, descubre sus actividades más
              populares y arma tu viaje ideal combinando las mejores opciones de vuelos y
              alojamiento con tarifas actualizadas.
            </p>
            <div className="hero-quick-links">
              <span>Destinos destacados:</span>
              <Link to="/destinos/paris" className="quick-chip">🇫🇷 París</Link>
              <Link to="/destinos/tokio" className="quick-chip">🇯🇵 Tokio</Link>
              <Link to="/destinos/cusco" className="quick-chip">🇵🇪 Cusco</Link>
              <Link to="/destinos/cancun" className="quick-chip">🇲🇽 Cancún</Link>
              <Link to="/destinos/roma" className="quick-chip">🇮🇹 Roma</Link>
              <Link to="/destinos/bariloche" className="quick-chip">🇦🇷 Bariloche</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container catalog-section">
        <div className="section-header-bar">
          <div>
            <span className="section-eyebrow">Catálogo Internacional</span>
            <h2>Destinos Disponibles</h2>
          </div>

          <div className="filters-toolbar">
            <div className="search-input-group">
              <input
                type="search"
                placeholder="Buscar por destino, país o actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar destinos"
                className="search-input"
              />
            </div>

            <div className="continent-tabs" role="tablist" aria-label="Filtrar por continente">
              {continents.map((continent) => (
                <button
                  key={continent}
                  type="button"
                  onClick={() => setSelectedContinent(continent)}
                  className={`tab-btn ${selectedContinent === continent ? 'active' : ''}`}
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="status-card loading-state" role="status">
            <div className="spinner" aria-hidden="true"></div>
            <h3>Cargando destinos disponibles...</h3>
            <p>Estamos preparando las mejores experiencias y actividades para tu viaje.</p>
          </div>
        )}

        {error && !loading && (
          <div className="status-card error-state" role="alert">
            <h3>⚠️ Error al cargar los destinos</h3>
            <p>{error}</p>
            <button type="button" onClick={fetchDestinations} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filteredDestinations.length === 0 && (
          <div className="status-card empty-state">
            <h3>No encontramos destinos con esos filtros</h3>
            <p>Prueba limpiando la búsqueda o seleccionando otro continente.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedContinent('Todos');
              }}
              className="btn btn-outline"
            >
              Mostrar todos los destinos
            </button>
          </div>
        )}

        {!loading && !error && filteredDestinations.length > 0 && (
          <div className="destinations-grid">
            {filteredDestinations.map((destination) => (
              <TarjetaDestino
                key={destination.id}
                destination={destination}
                currency={currency}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PaginaDestinos;
