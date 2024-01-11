import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const requestService = {
  getAll: () => {
    return http.get('/v1/requests');
  },
  approve: (id, data) => {
    return http.put('/v1/requests/' + id, { body: data });
  },
  delete: (id) => {
    return http.del('/v1/requests/' + id);
  },
};
