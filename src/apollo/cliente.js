import { ApolloClient, InMemoryCache } from '@apollo/client';

// Configuración centralizada de Apollo Client apuntando al endpoint interceptado por MSW
export const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          destinationDetails: {
            keyArgs: ['destinationId'],
          },
        },
      },
    },
  }),
});
