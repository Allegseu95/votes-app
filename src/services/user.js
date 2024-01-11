import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const userService = {
  getAll: () => {
    return http.get('/v1/users');
  },
  update: (data, id) => {
    return http.put('/v1/users/' + id, { body: data });
  },
};
