import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const jrvService = {
  getAll: () => {
    return http.get('/v1/jrvs');
  },
  create: (data) => {
    return http.post('/v1/jrvs', { body: data });
  },
  update: (id, data) => {
    return http.put('/v1/jrvs/' + id, { body: data });
  },
  delete: (id) => {
    return http.del('/v1/jrvs/' + id);
  },
};
