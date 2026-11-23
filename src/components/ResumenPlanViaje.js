import React, { useState } from 'react';
import { formatCurrency } from '../utils/moneda';

function ResumenPlanViaje({
  destinationName,
  selectedFlight,
  selectedHotel,
  nightsCount,
  onNightsChange,
  onClearPlan,
  currency = 'CLP',
}) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const flightCost = selectedFlight ? selectedFlight.price : 0;
  const hotelCost = selectedHotel ? selectedHotel.pricePerNight * nightsCount : 0;
  const totalEstimated = flightCost + hotelCost;

  const handleConfirm = () => {
    setBookingConfirmed(true);
  };

  const handleReset = () => {
    setBookingConfirmed(false);
    onClearPlan();
  };

  return (
    <aside className="planner-summary-card" aria-label="Resumen de planificación de viaje">
      <div className="planner-summary-header">
        <div>
          <span className="planner-badge">Planificador Interactivo</span>
          <h3>Tu Viaje a {destinationName}</h3>
        </div>
        {(selectedFlight || selectedHotel) && (
          <button type="button" onClick={handleReset} className="btn-link-clear">
            Reiniciar selección
          </button>
        )}
      </div>

      <div className="planner-items-grid">
        <div className={`planner-slot ${selectedFlight ? 'slot-filled' : ''}`}>
          <div className="slot-header">
            <span>✈️ Vuelo Seleccionado</span>
            {selectedFlight && <strong>{formatCurrency(selectedFlight.price, currency)}</strong>}
          </div>
          {selectedFlight ? (
            <div className="slot-body">
              <p className="slot-title">
                {selectedFlight.airline} ({selectedFlight.flightNumber})
              </p>
              <p className="slot-meta">
                {selectedFlight.departureDate} → {selectedFlight.returnDate} • {selectedFlight.cabinClass}
              </p>
            </div>
          ) : (
            <p className="slot-empty">Selecciona un vuelo de la lista inferior para cotizar.</p>
          )}
        </div>

        <div className={`planner-slot ${selectedHotel ? 'slot-filled' : ''}`}>
          <div className="slot-header">
            <span>🏨 Alojamiento Seleccionado</span>
            {selectedHotel && (
              <strong>
                {formatCurrency(selectedHotel.pricePerNight, currency)} x {nightsCount} noches ={' '}
                {formatCurrency(hotelCost, currency)}
              </strong>
            )}
          </div>
          {selectedHotel ? (
            <div className="slot-body">
              <p className="slot-title">{selectedHotel.name}</p>
              <p className="slot-meta">
                {selectedHotel.roomType} • Check-in: {selectedHotel.checkInDate}
              </p>
              <div className="nights-selector">
                <label htmlFor="nights-range">Estadía ({nightsCount} noches):</label>
                <input
                  id="nights-range"
                  type="range"
                  min="1"
                  max="14"
                  value={nightsCount}
                  onChange={(e) => {
                    setBookingConfirmed(false);
                    onNightsChange(Number(e.target.value));
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="slot-empty">Selecciona un hotel de la lista inferior para cotizar.</p>
          )}
        </div>
      </div>

      <div className="planner-total-bar">
        <div>
          <span className="total-label">Presupuesto Total Estimado ({currency}):</span>
          <strong className="total-amount">{formatCurrency(totalEstimated, currency)}</strong>
        </div>

        <button
          type="button"
          className="btn btn-accent"
          disabled={!selectedFlight && !selectedHotel}
          onClick={handleConfirm}
        >
          {bookingConfirmed ? '🎉 ¡Cotización Guardada!' : 'Confirmar Plan de Viaje'}
        </button>
      </div>

      {bookingConfirmed && (
        <div className="booking-confirmation-alert" role="status">
          <strong>¡Planificación lista para {destinationName}!</strong> Tu cotización de vuelo y
          alojamiento ha sido registrada con éxito. Un asesor de Travelsti te contactará con los
          detalles de tu reserva.
        </div>
      )}
    </aside>
  );
}

export default ResumenPlanViaje;
