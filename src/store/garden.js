const gardenSlice = (set, get) => ({
  gridSize: 3,
  tiles: [
    { type: 'sand' },
    { type: 'sand' },
    { type: 'sand' },
    { type: 'sand' },
    { type: 'stone' },
    { type: 'sand' },
    { type: 'sand' },
    { type: 'sand' },
    { type: 'sand' },
  ],

  clickedTile: null,
  clickedPosition: { x: 0, y: 0 },
});

export default gardenSlice;
