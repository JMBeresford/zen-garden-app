import create from 'zustand';
import gardenSlice from './garden';

const useStore = create((set, get) => {
  return {
    router: null,
    dom: null,

    ...gardenSlice(set, get),
  };
});

export default useStore;
