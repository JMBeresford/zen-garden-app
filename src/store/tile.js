const tileSlice = (set, get) => ({});

const tileActions = (set, get) => ({
  generateTile: (tileType) => {
    let calcTendAt = get().actions.calculateNextTendableTime;
    return {
      type: tileType,
      level: 0,
      tendable: false,
      tendableAt: calcTendAt(tileType, performance.now() / 1000),
    };
  },
  tendTile: (tile) => {
    if (!tile.userData.tendable) {
      console.error('Tile is not tendable');
      return;
    }

    let yields = get().actions.calculateTendYields(tile);
    let calcNextYield = get().actions.calculateNextTendableTime;

    set({ balance: get().balance + yields });

    let newTiles = get().tiles.map((oldTile, index) => {
      if (index === tile.userData.index) {
        return {
          ...oldTile,
          tendable: false,
          tendableAt: calcNextYield(
            tile.userData.type,
            performance.now() / 1000
          ),
        };
      } else {
        return oldTile;
      }
    });

    set({ tiles: newTiles });
  },
  levelTile: (tile) => {
    if (tile.userData.type === 'sand') {
      console.error('Cannot level sand tile');
      return;
    }

    if (tile.userData.level >= 3) {
      console.error('Cannot level max level tile');
      return;
    }

    let balance = get().balance;
    let cost = get().actions.calculateLevelCost(tile);

    if (balance < cost) {
      console.error(
        'Cannot level tile. Insufficient balance:',
        balance,
        '<',
        cost
      );
      return;
    } else {
      set({ balance: balance - cost });
    }

    let newTiles = get().tiles.map((oldTile, index) => {
      if (index === tile.userData.index) {
        return { ...oldTile, level: tile.userData.level + 1 };
      } else {
        return oldTile;
      }
    });

    set({ tiles: newTiles, levelingUp: false });
  },
  upgradeTile: (tile, newType) => {
    if (tile.userData.type !== 'sand') {
      console.error('Cannot upgrade non-sand tile');
      return;
    }

    if (!['stone', 'tree', 'pond'].includes(newType)) {
      console.error('Invalid tile type');
      return;
    }

    let balance = get().balance;

    let cost = newType === 'stone' ? 10 : 7;

    if (balance < cost) {
      console.error('Not enough money to upgrade tile');
      return;
    } else {
      set({ balance: balance - cost });
    }

    let newTiles = get().tiles.map((oldTile, index) => {
      if (index === tile.userData.index) {
        return {
          ...oldTile,
          type: newType,
          level: 1,
          tendableAt: get().actions.calculateNextTendableTime(
            tile.userData.type,
            performance.now() / 1000
          ),
        };
      } else {
        return oldTile;
      }
    });

    set({ tiles: newTiles });
  },
});

export { tileSlice, tileActions };
