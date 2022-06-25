import { addEffect } from '@react-three/fiber';

const gardenSlice = (set, get) => ({
  gridSize: 3,
  tiles: [],

  clickedTile: null,
  clickedPosition: { x: 0, y: 0 },
});

const gardenActions = (set, get) => ({
  initGarden: (garden = null) => {
    if (garden) {
      set({ tiles: garden });
    } else {
      let area = get().gridSize * get().gridSize;
      let g = [];

      for (let i = 0; i < area; i++) {
        g.push(get().actions.generateTile('sand'));

        // make center tile a stone
        if (i === Math.floor(area / 2.0)) {
          g[i].type = 'stone';
          g[i].level = 1;
        }

        if (Math.random() < 0.15) {
          // give some tendability to the initial gardens
          g[i].tendable = true;
        }
      }

      set({ tiles: g });
    }

    const calcTendTime = get().actions.calculateNextTendableTime;

    let newTiles = get().tiles.map((tile) => {
      if (tile.tendable) {
        return { ...tile, tendableAt: 0 };
      } else {
        return {
          ...tile,
          tendableAt: calcTendTime(tile.type, performance.now() / 1000),
        };
      }
    });

    set({ tiles: newTiles });

    addEffect(() => {
      let seconds = performance.now() / 1000;

      let changed = false;

      let newTiles = get().tiles.map((tile) => {
        if (!tile.tendable && tile.tendableAt < seconds) {
          changed = true;

          return {
            ...tile,
            tendable: true,
            tendableAt: calcTendTime(tile.type, seconds),
          };
        } else {
          return tile;
        }
      });

      if (changed) {
        set({ tiles: newTiles });
      }
    });
  },
  generateTile: (tileType) => {
    let calcTendAt = get().actions.calculateNextTendableTime;
    return {
      type: tileType,
      level: 0,
      tendable: false,
      tendableAt: calcTendAt(tileType, performance.now() / 1000),
    };
  },
  calculateNextTendableTime: (type, curTime) => {
    switch (type) {
      case 'sand': {
        return curTime + (Math.random() * 2 + 3) * 60; // 3-5 minutes
      }

      case 'stone': {
        return curTime + (Math.random() * 12 + 18) * 60; // 18-30 minutes
      }

      default: {
        return curTime + (Math.random() * 6 + 9) * 60; // 9-15 minutes
      }
    }
  },
  calculateTendYields: (tile, levelOffset = 0) => {
    if (tile.userData.type === 'sand') return 1;

    let yields = tile.userData.type === 'stone' ? 5 : 3;

    for (let i = 0; i < tile.userData.level + levelOffset; i++) {
      yields = Math.pow(yields, 1.25);
    }

    return Math.floor(yields);
  },
  calculateLevelCost: (tile) => {
    const { type, level } = tile.userData;
    if (!['stone', 'tree', 'pond'].includes(type)) {
      console.error('Cannot calculate level cost. Invalid tile type');
      return;
    }

    let baseCost = type === 'stone' ? 10 : 7;

    return Math.pow(baseCost, level + 1);
  },
  calculateExpansionCost: () => {
    let newSize = get().gridSize + 1;

    return Math.floor(10 * newSize * Math.log10(newSize));
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

    set({ tiles: newTiles });
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
  expandGarden: () => {
    let cost = get().actions.calculateExpansionCost();

    if (get().balance < cost) {
      console.error('Not enough money to expand garden');
      return;
    } else {
      set({ balance: get().balance - cost });
    }

    let size = get().gridSize;
    let newSize = get().gridSize + 2;
    let generateTile = get().actions.generateTile;
    let curTiles = get().tiles;

    // get top row of expanded grid
    let topRow = [];

    for (let i = 0; i < newSize; i++) {
      topRow.push(generateTile('sand'));
    }

    // get bottom row of expanded grid
    let bottomRow = [];

    for (let i = 0; i < newSize; i++) {
      bottomRow.push(generateTile('sand'));
    }

    let innerRows = [];

    // add tiles to left and right of existing rows
    curTiles.forEach((tile, index) => {
      if (index % size === 0) {
        innerRows.push(generateTile('sand'));
        innerRows.push(tile);
      } else if (index % size === size - 1) {
        innerRows.push(tile);
        innerRows.push(generateTile('sand'));
      } else {
        innerRows.push(tile);
      }
    });

    // set new garden
    set({ tiles: [...topRow, ...innerRows, ...bottomRow], gridSize: newSize });
  },
});

export { gardenSlice, gardenActions };
