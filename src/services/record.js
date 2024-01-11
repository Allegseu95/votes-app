import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const recordService = {
  getPendings: () => {
    return http.get('/v1/records/pendings');
  },
  getApproves: () => {
    return http.get('/v1/records/approves');
  },
  update: (id, state) => {
    return http.get('/v1/records/update/' + id + '/' + state);
  },
};
