import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const candidateService = {
  getAll: () => {
    return http.get('/v1/candidates');
  },
  create: (data) => {
    return http.post('/v1/candidates', { body: data });
  },
  update: (id, data) => {
    return http.put('/v1/candidates/' + id, { body: data });
  },
  delete: (id) => {
    return http.del('/v1/candidates/' + id);
  },
};
