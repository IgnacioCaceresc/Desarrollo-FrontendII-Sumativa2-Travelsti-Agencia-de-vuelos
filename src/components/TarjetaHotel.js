import React from 'react';
import { formatCurrency } from '../utils/moneda';

function TarjetaHotel({ hotel, isSelected, onSelect, currency = 'CLP' }) {
  const isLowRooms = hotel.availableRooms <= 3;
  const starsString = '★'.repeat(hotel.stars) + '☆'.repeat(Math.max(0, 5 - hotel.stars));

  return (
    <article
      className={`option-card hotel-card ${isSelected ? 'selected-card' : ''}`}
      data-testid={`hotel-card-${hotel.id}`}
    >
      <div className="option-card-header">
        <div>
          <div className="hotel-stars" aria-label={`${hotel.stars} estrellas`}>
            {starsString} <span>({hotel.stars} Estrellas)</span>
          </div>
          <h4 className="option-title">🏨 {hotel.name}</h4>
          <span className="option-location">📍 {hotel.location}</span>
        </div>
        <span className={`availability-badge ${isLowRooms ? 'badge-warning' : 'badge-success'}`}>
          {hotel.availability} ({hotel.availableRooms} hab.)
        </span>
      </div>

      <div className="hotel-room-banner">
        <strong>Tipo de Habitación:</strong> {hotel.roomType}
      </div>

      <div className="option-details-grid">
        <div className="detail-chip">
          <span className="detail-label">🔑 Check-in:</span>
          <strong>{hotel.checkInDate}</strong>
        </div>
        <div className="detail-chip">
          <span className="detail-label">🚪 Check-out:</span>
          <strong>{hotel.checkOutDate}</strong>
        </div>
      </div>

      <div className="hotel-amenities">
        {hotel.amenities.map((amenity, idx) => (
          <span key={idx} className="amenity-tag">
            ✨ {amenity}
          </span>
        ))}
      </div>

      <div className="option-card-footer">
        <div className="option-price-box">
          <span className="price-caption">Precio por noche</span>
          <span className="price-value">{formatCurrency(hotel.pricePerNight, currency)}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(hotel)}
          className={`btn ${isSelected ? 'btn-selected' : 'btn-outline'}`}
        >
          {isSelected ? '✓ Hotel Seleccionado' : 'Seleccionar Hotel'}
        </button>
      </div>
    </article>
  );
}

export default TarjetaHotel;
