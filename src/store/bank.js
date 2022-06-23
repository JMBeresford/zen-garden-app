const bankSlice = (set, get) => ({
  balance: 10,
});

const bankActions = (set, get) => ({
  deposit: (amount) => {
    set({ balance: get().balance + amount });
  },
  withdraw: (amount) => {
    set({ balance: get().balance - amount });
  },
});

export { bankSlice, bankActions };
