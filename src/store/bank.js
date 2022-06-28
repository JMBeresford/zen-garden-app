const bankSlice = (set, get) => ({
  balance: 20,

  baseCosts: {
    stone: 10,
    tree: 7,
    pond: 7,
  },

  baseYields: {
    sand: 1,
    stone: 5,
    tree: 3,
    pond: 3,
  },
});

const bankActions = (set, get) => ({
  calculateTendYields: (tile, levelOffset = 0) => {
    let baseYields = get().baseYields;
    let { type, level } = tile.userData;

    if (tile.userData.type === 'sand') return baseYields.sand;

    let yields = baseYields[type];

    for (let i = 1; i < level + levelOffset; i++) {
      yields = Math.pow(yields, 1.25);
    }

    return Math.ceil(yields);
  },
  calculateLevelCost: (tile) => {
    let baseCosts = get().baseCosts;
    const { type, level } = tile.userData;
    if (!['stone', 'tree', 'pond'].includes(type)) {
      console.error('Cannot calculate level cost. Invalid tile type');
      return;
    }

    let baseCost = baseCosts[type];

    return Math.pow(baseCost, level + 1);
  },
  calculateExpansionCost: () => {
    let newSize = get().gridSize + 2;

    return Math.floor(10 * newSize * Math.log10(newSize));
  },
});

export { bankSlice, bankActions };
