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
