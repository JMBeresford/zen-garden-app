import useStore from '@/store';
import { useMemo, useRef } from 'react';
import Tile from './Tile';
import shallow from 'zustand/shallow';

const Garden = ({ ...props }) => {
  const ref = useRef();

  const { tiles, gridSize } = useStore(
    (state) => ({ tiles: state.tiles, gridSize: state.gridSize }),
    shallow
  );

  // position each tile in the grid
  const garden = useMemo(() => {
    let mid = Math.floor(gridSize / 2);

    return tiles.map((tile, index) => {
      let x = -mid + (index % gridSize);
      let z = -mid + Math.floor(index / gridSize);

      return { position: [x, 0, z], ...tile };
    });
  }, [gridSize, tiles]);

  return (
    <group
      ref={ref}
      {...props}
      onPointerMissed={() => useStore.setState({ clickedTile: null })}
    >
      {garden.map((tile, index) => (
        <Tile
          key={index}
          index={index}
          tileType={tile.type}
          position={tile.position}
        />
      ))}
    </group>
  );
};

export default Garden;
