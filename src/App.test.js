import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from './App';
import { DESTINATIONS_DATA, TRAVEL_DETAILS_BY_DESTINATION } from './mocks/datosViajes';
import { GET_TRAVEL_DETAILS_BY_DESTINATION } from './apollo/consultas';

// Mock global de fetch para verificar la integración REST (/api/destinations)
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (String(url).includes('/api/destinations')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(DESTINATIONS_DATA),
      });
    }
    return Promise.reject(new Error('Endpoint no reconocido'));
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const apolloMocks = [
  {
    request: {
      query: GET_TRAVEL_DETAILS_BY_DESTINATION,
      variables: { destinationId: 'paris' },
    },
    result: {
      data: {
        destinationDetails: {
          ...DESTINATIONS_DATA[0],
          flights: TRAVEL_DETAILS_BY_DESTINATION.paris.flights,
          hotels: TRAVEL_DETAILS_BY_DESTINATION.paris.hotels,
        },
      },
    },
  },
];

describe('Travelsti - Integración Frontend con Backend (REST & GraphQL)', () => {
  test('1. Renderiza el catálogo de destinos desde la API REST con país y actividades populares', async () => {
    window.history.pushState({}, 'Inicio', '/');

    render(
      <MockedProvider mocks={apolloMocks}>
        <App />
      </MockedProvider>
    );

    // Verifica estado de carga inicial
    expect(screen.getByText(/Cargando destinos disponibles/i)).toBeInTheDocument();

    // Espera a que se resuelva la llamada REST y se muestren los destinos, países y actividades
    await waitFor(() => {
      expect(screen.getByTestId('destination-card-paris')).toBeInTheDocument();
    });

    expect(screen.getByText(/Francia/i)).toBeInTheDocument();
    expect(screen.getByText(/Ascenso panorámico a la Torre Eiffel/i)).toBeInTheDocument();
    expect(screen.getByTestId('destination-card-tokio')).toBeInTheDocument();
    expect(screen.getByText(/Japón/i)).toBeInTheDocument();
  });

  test('2. Permite filtrar destinos dinámicamente mediante useState', async () => {
    window.history.pushState({}, 'Destinos', '/destinos');

    render(
      <MockedProvider mocks={apolloMocks}>
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('destination-card-paris')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar por destino, país o actividad/i);
    fireEvent.change(searchInput, { target: { value: 'Machu Picchu' } });

    expect(screen.getByTestId('destination-card-cusco')).toBeInTheDocument();
    expect(screen.queryByTestId('destination-card-paris')).not.toBeInTheDocument();
  });

  test('3. Navega a un destino y consulta vuelos y hoteles mediante GraphQL (Apollo Client)', async () => {
    window.history.pushState({}, 'Detalle París', '/destinos/paris');

    render(
      <MockedProvider mocks={apolloMocks}>
        <App />
      </MockedProvider>
    );

    // Verifica que muestre estado de carga
    expect(screen.getByText(/Buscando vuelos y hoteles disponibles/i)).toBeInTheDocument();

    // Espera a que Apollo Client resuelva la query GetTravelDetailsByDestination
    await waitFor(() => {
      expect(screen.getByText(/Vuelos Disponibles a París/i)).toBeInTheDocument();
    });

    // Verifica vuelos (aerolínea, número, precio por defecto en CLP, fechas y disponibilidad)
    expect(screen.getAllByText(/Air France/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AF-401/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$1\.121\.000 CLP/i).length).toBeGreaterThan(0);

    // Verifica hoteles (nombre, ubicación, precio por noche en CLP y disponibilidad)
    expect(screen.getAllByText(/Hôtel Le Littré Montparnasse/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$199\.500 CLP/i).length).toBeGreaterThan(0);

    // Verifica cambio dinámico de moneda a USD a gusto del usuario
    const usdButton = screen.getByRole('button', { name: /USD/i });
    fireEvent.click(usdButton);
    expect(screen.getAllByText(/\$1\.180 USD|\$1,180 USD/i).length).toBeGreaterThan(0);
  });
});
