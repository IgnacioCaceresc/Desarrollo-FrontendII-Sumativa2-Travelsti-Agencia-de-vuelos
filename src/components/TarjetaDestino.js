import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/moneda';
import { useClimaReal } from '../utils/clima';

function TarjetaDestino({ destination, currency = 'CLP' }) {
  const clima = useClimaReal({
    destinationId: destination.id,
    latitude: destination.latitude,
    longitude: destination.longitude,
    fallbackClimate: destination.climate,
  });

  return (
    <article className="destination-card" data-testid={`destination-card-${destination.id}`}>
      <Link
        to={`/destinos/${destination.id}`}
        className="destination-image-wrapper destination-image-link"
        aria-label={`Explorar vuelos y hoteles en ${destination.name}`}
      >
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          className="destination-image"
          loading="lazy"
        />
        <span className="destination-continent-badge">{destination.continent}</span>
        <span className="destination-rating-badge">★ {destination.rating}</span>
      </Link>

      <div className="destination-card-body">
        <div className="destination-header-row">
          <div>
            <span className="destination-country">📍 {destination.country}</span>
            <h3 className="destination-title">{destination.name}</h3>
          </div>
          <div className="destination-price-tag">
            <span className="price-label">Desde</span>
            <strong className="price-amount">
              {formatCurrency(destination.startingPrice, currency)}
            </strong>
          </div>
        </div>

        <p className="destination-tagline">{destination.tagline}</p>

        <div className="destination-activities-box">
          <h4 className="activities-heading">Actividades Populares:</h4>
          <ul className="activities-list">
            {destination.popularActivities.map((activity, idx) => (
              <li key={idx} className="activity-item">
                <span className="activity-bullet" aria-hidden="true">✓</span>
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="destination-meta-row">
          <span title="Mejor temporada">🗓️ {destination.bestSeason}</span>
          <span
            className="weather-meta-group"
            title={clima.isLive ? 'Clima actual en tiempo real (Open-Meteo API)' : 'Clima estimado'}
          >
            <span className={clima.isLive ? 'live-weather-chip' : ''}>
              {clima.icon} {clima.text}
            </span>
            <small className="weather-api-credit">vía Open-Meteo API</small>
          </span>
        </div>

        <div className="destination-card-footer">
          <Link
            to={`/destinos/${destination.id}`}
            className="btn btn-primary btn-block"
          >
            Ver Vuelos y Hoteles →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default TarjetaDestino;
