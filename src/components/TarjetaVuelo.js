import React from 'react';
import { formatCurrency } from '../utils/moneda';

function TarjetaVuelo({ flight, isSelected, onSelect, currency = 'CLP' }) {
  const isLowSeats = flight.availableSeats <= 4;

  return (
    <article
      className={`option-card flight-card ${isSelected ? 'selected-card' : ''}`}
      data-testid={`flight-card-${flight.id}`}
    >
      <div className="option-card-header">
        <div className="airline-info">
          <span className="option-icon" aria-hidden="true">🛫</span>
          <div>
            <h4 className="option-title">{flight.airline}</h4>
            <span className="option-code">
              Vuelo <strong>{flight.flightNumber}</strong> • Clase {flight.cabinClass}
            </span>
          </div>
        </div>
        <span className={`availability-badge ${isLowSeats ? 'badge-warning' : 'badge-success'}`}>
          {flight.availability} ({flight.availableSeats} asientos)
        </span>
      </div>

      <div className="flight-route-timeline">
        <div className="route-point">
          <span className="route-time">{flight.departureTime}</span>
          <span className="route-city">{flight.origin}</span>
        </div>
        <div className="route-connector">
          <span className="route-duration">{flight.duration}</span>
          <div className="route-line">
            <span className="route-plane">✈</span>
          </div>
          <span className="route-stops">{flight.stops}</span>
        </div>
        <div className="route-point route-point-end">
          <span className="route-time">{flight.arrivalTime}</span>
          <span className="route-city">{flight.destination}</span>
        </div>
      </div>

      <div className="option-details-grid">
        <div className="detail-chip">
          <span className="detail-label">📅 Salida:</span>
          <strong>{flight.departureDate}</strong>
        </div>
        <div className="detail-chip">
          <span className="detail-label">📅 Regreso:</span>
          <strong>{flight.returnDate}</strong>
        </div>
      </div>

      <div className="option-card-footer">
        <div className="option-price-box">
          <span className="price-caption">Tarifa ida y vuelta</span>
          <span className="price-value">{formatCurrency(flight.price, currency)}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(flight)}
          className={`btn ${isSelected ? 'btn-selected' : 'btn-outline'}`}
        >
          {isSelected ? '✓ Vuelo Seleccionado' : 'Seleccionar Vuelo'}
        </button>
      </div>
    </article>
  );
}

export default TarjetaVuelo;
