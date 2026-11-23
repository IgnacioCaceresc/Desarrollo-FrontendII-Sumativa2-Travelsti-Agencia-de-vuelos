import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configura el Service Worker de MSW con los handlers REST y GraphQL definidos
export const worker = setupWorker(...handlers);

