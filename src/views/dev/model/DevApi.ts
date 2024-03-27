import { defineStore } from 'pinia';
import { AxiosClient } from '@/views/dev/util/AxiosClient';

export const DevApi = defineStore({
  id: 'DevApi',
  state: () => ({
    _api: new AxiosClient(),
  }),

  actions: {
    isResultEmpty(result: any) {
      if (result === "") {
        return true;
      }
      else {
        return false;
      }
    },

    // emulator
    getTaskList() {
      return this._api.get(`/api/dev/get/task/list`);
    },
    getTaskData(id: string) {
      return this._api.post(`/api/dev/get/task`, { id });
    },
    getNodeData() {
      return this._api.post(`/api/dev/get/node`);
    },
    setTaskData(action: number, data: any) {
      const tasks = JSON.stringify(data);
      return this._api.post(`/api/dev/set/node/task`, { action, tasks });
    },
  },
});
