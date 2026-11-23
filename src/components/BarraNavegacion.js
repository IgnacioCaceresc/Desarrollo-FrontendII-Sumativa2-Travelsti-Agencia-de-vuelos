import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function BarraNavegacion({ tripPlan, currency = 'CLP', onCurrencyChange }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasSelection = Boolean(tripPlan?.flight || tripPlan?.hotel);

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="brand-logo" aria-label="Travelsti Inicio">
          {!logoFailed ? (
            <img
              src={`${process.env.PUBLIC_URL || ''}/logo.png`}
              alt="Logo Travelsti"
              className="brand-logo-img"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="brand-icon" role="img" aria-hidden="true">
              ✈️
            </span>
          )}
          <div className="brand-text">
            <span className="brand-title">Travelsti</span>
            <span className="brand-subtitle">Agencia de Viajes &amp; Experiencias</span>
          </div>
        </Link>

        <nav className="nav-links" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/destinos"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Explorar Destinos
          </NavLink>
          <NavLink
            to="/destinos/paris"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Vuelos y Hoteles
          </NavLink>
        </nav>

        <div className="navbar-status">
          {/* Selector interactivo de Moneda (CLP por defecto / USD) */}
          <div className="currency-switcher" role="group" aria-label="Selector de moneda">
            <button
              type="button"
              className={`currency-btn ${currency === 'CLP' ? 'active' : ''}`}
              onClick={() => onCurrencyChange && onCurrencyChange('CLP')}
              title="Mostrar precios en Pesos Chilenos (CLP)"
            >
              🇨🇱 CLP ($)
            </button>
            <button
              type="button"
              className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
              onClick={() => onCurrencyChange && onCurrencyChange('USD')}
              title="Mostrar precios en Dólares Estadounidenses (USD)"
            >
              🇺🇸 USD ($)
            </button>
          </div>

          {hasSelection && (
            <Link
              to={`/destinos/${tripPlan.destinationId || 'paris'}`}
              className="itinerary-pill"
              title="Ver tu itinerario en construcción"
            >
              🧳 Mi Itinerario ({tripPlan.destinationName})
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default BarraNavegacion;
