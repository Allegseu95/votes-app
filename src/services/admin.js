import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const adminService = {
  login: (data) => {
    return http.post('/v1/admin/login', { body: data });
  },
};
