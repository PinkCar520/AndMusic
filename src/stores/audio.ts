import { defineStore } from "pinia";
interface UseAudioStore {
  volume: number;
}
export const useAudioStore = defineStore("audio", {
  state: (): UseAudioStore => {
    return {
      volume: 1,
    };
  },
  getters: {},
  actions: {
    volumeChange(val: number) {
      this.volume = val;
    },
  },
  persist: true,
});
