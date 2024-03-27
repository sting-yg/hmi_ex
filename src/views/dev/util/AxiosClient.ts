import type { AxiosInstance } from 'axios';
import axios from 'axios';

type MethodType = 'get' | 'put' | 'post' | 'delete' | 'patch';
export const METHOD_TYPE = {
  GET: 'get',
  PUT: 'put',
  POST: 'post',
  DELETE: 'delete',
  PATCH: 'patch',
} as const;

export class AxiosClient {
  axios: AxiosInstance;
  methods: Record<MethodType, any>;
  constructor() {
    this.axios = axios.create({
      baseURL: '/',
    });

    this.methods = {
      get: this.axios.get,
      put: this.axios.put,
      delete: this.axios.delete,
      patch: this.axios.patch,
      post: this.axios.post,
    };
  }

  request(method: MethodType, api: string, param?: any) {
    if (method === 'delete') {
      param = { data: param };
    }

    console.log(`[${method}] ${api} called with`, param);
    return this.methods[method](api, param)
      .then((response:any) => {
        //console.log(`${api} response: `, response);
        return response;
      })
      .catch((error:any) => {
        return Promise.reject(error);
      });
  }

  get(api: string, param?: any) {
    if (param == null)
      return this.request(METHOD_TYPE.GET, api);
    else
      return this.request(METHOD_TYPE.GET, api, param);
  }
  put(api: string, param?: any) {
    return this.request(METHOD_TYPE.PUT, api, param);
  }
  post(api: string, param?: any) {
    return this.request(METHOD_TYPE.POST, api, param);
  }
  delete(api: string, param?: any) {
    return this.request(METHOD_TYPE.DELETE, api, param);
  }
  patch(api: string, param?: any) {
    return this.request(METHOD_TYPE.PATCH, api, param);
  }
}
