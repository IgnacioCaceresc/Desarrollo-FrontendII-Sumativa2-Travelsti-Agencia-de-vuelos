import { graphql, HttpResponse, http, delay } from 'msw';
import { DESTINATIONS_DATA, TRAVEL_DETAILS_BY_DESTINATION } from './datosViajes';

export { DESTINATIONS_DATA, TRAVEL_DETAILS_BY_DESTINATION };

export const handlers = [
  // 1. REST Handler: Listar los destinos disponibles con país y actividades populares
  http.get('/api/destinations', async () => {
    await delay(350);
    return HttpResponse.json(DESTINATIONS_DATA);
  }),

  // REST Handler opcional por ID para consulta individual si se requiere
  http.get('/api/destinations/:id', async ({ params }) => {
    await delay(200);
    const { id } = params;
    const destination = DESTINATIONS_DATA.find(
      (item) => item.id.toLowerCase() === String(id).toLowerCase()
    );

    if (!destination) {
      return HttpResponse.json(
        { message: `No se encontró el destino "${id}" en nuestro catálogo.` },
        { status: 404 }
      );
    }

    return HttpResponse.json(destination);
  }),

  // 2. GraphQL Handler: Consultar vuelos y hoteles disponibles en cada destino
  graphql.query('GetTravelDetailsByDestination', async ({ variables }) => {
    const { destinationId } = variables;
    await delay(450);

    const normalizedKey = String(destinationId || '').toLowerCase();
    const destinationMeta = DESTINATIONS_DATA.find((d) => d.id === normalizedKey);
    const details = TRAVEL_DETAILS_BY_DESTINATION[normalizedKey];

    if (!destinationMeta || !details) {
      return HttpResponse.json({
        errors: [
          {
            message: `No se encontraron vuelos ni hoteles disponibles para el destino "${destinationId}". Verifica el destino seleccionado.`,
          },
        ],
      });
    }

    return HttpResponse.json({
      data: {
        destinationDetails: {
          id: destinationMeta.id,
          name: destinationMeta.name,
          country: destinationMeta.country,
          continent: destinationMeta.continent,
          tagline: destinationMeta.tagline,
          description: destinationMeta.description,
          climate: destinationMeta.climate,
          latitude: destinationMeta.latitude,
          longitude: destinationMeta.longitude,
          currency: destinationMeta.currency,
          bestSeason: destinationMeta.bestSeason,
          rating: destinationMeta.rating,
          image: destinationMeta.image,
          popularActivities: destinationMeta.popularActivities,
          flights: details.flights,
          hotels: details.hotels,
        },
      },
    });
  }),
];
