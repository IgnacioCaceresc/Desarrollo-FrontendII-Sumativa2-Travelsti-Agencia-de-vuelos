import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TRAVEL_DETAILS_BY_DESTINATION } from '../apollo/consultas';
import TarjetaVuelo from '../components/TarjetaVuelo';
import TarjetaHotel from '../components/TarjetaHotel';
import ResumenPlanViaje from '../components/ResumenPlanViaje';
import { formatCurrency } from '../utils/moneda';
import { useClimaReal } from '../utils/clima';

function PaginaDetalleDestino({ tripPlan, onUpdateTripPlan, currency = 'CLP' }) {
  const { destinationId } = useParams();

  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'flights' | 'hotels'
  const [maxFlightPrice, setMaxFlightPrice] = useState(3500);
  const [minHotelStars, setMinHotelStars] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [nightsCount, setNightsCount] = useState(7);

  const { loading, error, data, refetch } = useQuery(GET_TRAVEL_DETAILS_BY_DESTINATION, {
    variables: { destinationId },
    fetchPolicy: 'cache-first',
  });

  const details = data?.destinationDetails;

  const clima = useClimaReal({
    destinationId: details?.id || destinationId,
    latitude: details?.latitude,
    longitude: details?.longitude,
    fallbackClimate: details?.climate,
  });

  useEffect(() => {
    if (details) {
      if (tripPlan?.destinationId === details.id) {
        setSelectedFlight(tripPlan.flight || details.flights?.[0] || null);
        setSelectedHotel(tripPlan.hotel || details.hotels?.[0] || null);
      } else {
        const defaultFlight = details.flights?.[0] || null;
        const defaultHotel = details.hotels?.[0] || null;
        setSelectedFlight(defaultFlight);
        setSelectedHotel(defaultHotel);
        if (onUpdateTripPlan) {
          onUpdateTripPlan({
            destinationId: details.id,
            destinationName: details.name,
            flight: defaultFlight,
            hotel: defaultHotel,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details?.id]);

  const handleSelectFlight = (flight) => {
    const nextFlight = selectedFlight?.id === flight.id ? null : flight;
    setSelectedFlight(nextFlight);
    if (onUpdateTripPlan && details) {
      onUpdateTripPlan({
        destinationId: details.id,
        destinationName: details.name,
        flight: nextFlight,
        hotel: selectedHotel,
      });
    }
  };

  const handleSelectHotel = (hotel) => {
    const nextHotel = selectedHotel?.id === hotel.id ? null : hotel;
    setSelectedHotel(nextHotel);
    if (onUpdateTripPlan && details) {
      onUpdateTripPlan({
        destinationId: details.id,
        destinationName: details.name,
        flight: selectedFlight,
        hotel: nextHotel,
      });
    }
  };

  const handleClearPlan = () => {
    setSelectedFlight(null);
    setSelectedHotel(null);
    if (onUpdateTripPlan && details) {
      onUpdateTripPlan({
        destinationId: details.id,
        destinationName: details.name,
        flight: null,
        hotel: null,
      });
    }
  };

  const filteredFlights = useMemo(() => {
    if (!details?.flights) return [];
    return details.flights.filter((flight) => flight.price <= maxFlightPrice);
  }, [details, maxFlightPrice]);

  const filteredHotels = useMemo(() => {
    if (!details?.hotels) return [];
    return details.hotels.filter((hotel) => hotel.stars >= minHotelStars);
  }, [details, minHotelStars]);

  if (loading) {
    return (
      <div className="container detail-page-container">
        <div className="status-card loading-state" role="status">
          <div className="spinner" aria-hidden="true"></div>
          <h3>Buscando vuelos y hoteles disponibles...</h3>
          <p>Consultando tarifas, fechas y disponibilidad actualizada para tu viaje.</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="container detail-page-container">
        <div className="status-card error-state" role="alert">
          <h2>⚠️ No se pudo obtener la información del destino</h2>
          <p>{error ? error.message : `El destino "${destinationId}" no se encuentra disponible.`}</p>
          <div className="error-actions">
            <button type="button" onClick={() => refetch()} className="btn btn-outline">
              Reintentar búsqueda
            </button>
            <Link to="/destinos" className="btn btn-primary">
              ← Volver al catálogo de destinos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <section
        className="destination-detail-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 58, 138, 0.78)), url(${details.image})`,
        }}
      >
        <div className="container">
          <div className="breadcrumb-row">
            <Link to="/destinos" className="back-link">
              ← Volver a Destinos
            </Link>
            <span className="pill-tech pill-rest">
              Tarifas y Disponibilidad Confirmada
            </span>
          </div>

          <div className="detail-hero-content">
            <div>
              <span className="detail-country-badge">
                🌍 {details.country} • {details.continent}
              </span>
              <h1>{details.name}</h1>
              <p className="detail-description">{details.description}</p>

              <div className="detail-QuickFacts">
                <span>
                  {clima.icon} Clima actual: <strong>{clima.text}</strong>{' '}
                  <small className="weather-api-credit-light">(Datos: Open-Meteo API)</small>
                </span>
                <span>💱 Moneda local: <strong>{details.currency}</strong></span>
                <span>🗓️ Mejor época: <strong>{details.bestSeason}</strong></span>
                <span>⭐ Valoración: <strong>{details.rating} / 5.0</strong></span>
              </div>
            </div>

            <div className="detail-activities-card">
              <h3>🎯 Actividades Populares en {details.name}</h3>
              <ul>
                {details.popularActivities.map((act, index) => (
                  <li key={index}>✓ {act}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container detail-main-content">
        <ResumenPlanViaje
          destinationName={details.name}
          selectedFlight={selectedFlight}
          selectedHotel={selectedHotel}
          nightsCount={nightsCount}
          onNightsChange={setNightsCount}
          onClearPlan={handleClearPlan}
          currency={currency}
        />

        <div className="options-controls-bar">
          <div className="view-mode-tabs" role="tablist">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'both' ? 'active' : ''}`}
              onClick={() => setActiveTab('both')}
            >
              Vuelos + Hoteles ({filteredFlights.length + filteredHotels.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
              onClick={() => setActiveTab('flights')}
            >
              ✈️ Solo Vuelos ({filteredFlights.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotels')}
            >
              🏨 Solo Hoteles ({filteredHotels.length})
            </button>
          </div>

          <div className="filter-controls-group">
            <div className="filter-control">
              <label htmlFor="flight-price-filter">
                Tarifa máx. vuelo: <strong>{formatCurrency(maxFlightPrice, currency)}</strong>
              </label>
              <input
                id="flight-price-filter"
                type="range"
                min="250"
                max="3500"
                step="50"
                value={maxFlightPrice}
                onChange={(e) => setMaxFlightPrice(Number(e.target.value))}
              />
            </div>

            <div className="filter-control">
              <label htmlFor="hotel-stars-filter">Categoría hotel:</label>
              <select
                id="hotel-stars-filter"
                value={minHotelStars}
                onChange={(e) => setMinHotelStars(Number(e.target.value))}
                className="select-input"
              >
                <option value={0}>Todas las estrellas</option>
                <option value={3}>3★ o superior</option>
                <option value={4}>4★ o superior</option>
                <option value={5}>Solo 5★ Lujo</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className={`travel-options-layout ${
            activeTab === 'both' ? 'two-columns' : 'single-column'
          }`}
        >
          {(activeTab === 'both' || activeTab === 'flights') && (
            <section className="options-column" aria-labelledby="flights-heading">
              <div className="column-header">
                <h2 id="flights-heading">✈️ Vuelos Disponibles a {details.name}</h2>
                <span className="column-subtitle">
                  Tarifas ida y vuelta, fechas de salida/regreso y cupos disponibles
                </span>
              </div>

              {filteredFlights.length > 0 ? (
                <div className="cards-stack">
                  {filteredFlights.map((flight) => (
                    <TarjetaVuelo
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedFlight?.id === flight.id}
                      onSelect={handleSelectFlight}
                      currency={currency}
                    />
                  ))}
                </div>
              ) : (
                <div className="status-card empty-state">
                  <p>No hay vuelos por debajo de {formatCurrency(maxFlightPrice, currency)}.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setMaxFlightPrice(3500)}
                  >
                    Restablecer filtro de precio
                  </button>
                </div>
              )}
            </section>
          )}

          {(activeTab === 'both' || activeTab === 'hotels') && (
            <section className="options-column" aria-labelledby="hotels-heading">
              <div className="column-header">
                <h2 id="hotels-heading">🏨 Hoteles Disponibles en {details.name}</h2>
                <span className="column-subtitle">
                  Tarifas por noche, fechas de check-in/out y habitaciones disponibles
                </span>
              </div>

              {filteredHotels.length > 0 ? (
                <div className="cards-stack">
                  {filteredHotels.map((hotel) => (
                    <TarjetaHotel
                      key={hotel.id}
                      hotel={hotel}
                      isSelected={selectedHotel?.id === hotel.id}
                      onSelect={handleSelectHotel}
                      currency={currency}
                    />
                  ))}
                </div>
              ) : (
                <div className="status-card empty-state">
                  <p>No hay hoteles con {minHotelStars} o más estrellas para este filtro.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setMinHotelStars(0)}
                  >
                    Ver todas las categorías
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaginaDetalleDestino;
