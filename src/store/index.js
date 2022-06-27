import create from 'zustand';
import { gardenSlice, gardenActions } from './garden';
import { bankSlice, bankActions } from './bank';
import { contextMenuSlice, contextMenuActions } from './contextMenu';
import { tileSlice, tileActions } from './tile';

const useStore = create((set, get) => {
  return {
    router: null,
    dom: null,
    debug: false,

    ...gardenSlice(set, get),
    ...bankSlice(set, get),
    ...contextMenuSlice(set, get),
    ...tileSlice(set, get),

    actions: {
      ...gardenActions(set, get),
      ...bankActions(set, get),
      ...contextMenuActions(set, get),
      ...tileActions(set, get),
    },
  };
});

export default useStore;
