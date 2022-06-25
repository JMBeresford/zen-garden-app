import create from 'zustand';
import { gardenSlice, gardenActions } from './garden';
import { bankSlice, bankActions } from './bank';
import { contextMenuSlice, contextMenuActions } from './contextMenu';

const useStore = create((set, get) => {
  return {
    router: null,
    dom: null,

    ...gardenSlice(set, get),
    ...bankSlice(set, get),
    ...contextMenuSlice(set, get),

    actions: {
      ...gardenActions(set, get),
      ...bankActions(set, get),
      ...contextMenuActions(set, get),
    },
  };
});

export default useStore;
