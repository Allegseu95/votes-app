import { handlerHttp } from '@/utils/handlerHttp';

const http = handlerHttp();

export const jrvBallotService = {
  getAll: () => {
    return http.get('/v1/jrvsballots');
  },
};
