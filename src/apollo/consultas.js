import { gql } from '@apollo/client';

// Consulta GraphQL optimizada para obtener vuelos y hoteles de un destino específico
export const GET_TRAVEL_DETAILS_BY_DESTINATION = gql`
  query GetTravelDetailsByDestination($destinationId: String!) {
    destinationDetails(destinationId: $destinationId) {
      id
      name
      country
      continent
      tagline
      description
      climate
      latitude
      longitude
      currency
      bestSeason
      rating
      image
      popularActivities
      flights {
        id
        airline
        flightNumber
        origin
        destination
        departureDate
        returnDate
        departureTime
        arrivalTime
        duration
        stops
        cabinClass
        price
        availableSeats
        availability
      }
      hotels {
        id
        name
        stars
        location
        checkInDate
        checkOutDate
        pricePerNight
        roomType
        availableRooms
        availability
        amenities
      }
    }
  }
`;
