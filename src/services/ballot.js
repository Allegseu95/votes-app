import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const ballotService = {
  getAll: () => {
    return http.get('/v1/ballots');
  },
  create: (data) => {
    return http.post('/v1/ballots', { body: data });
  },
  update: (id, data) => {
    return http.put('/v1/ballots/' + id, { body: data });
  },
  delete: (id) => {
    return http.del('/v1/ballots/' + id);
  },
};
