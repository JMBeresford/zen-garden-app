import useStore from '@/store';
import React, { useMemo, useRef } from 'react';
import shallow from 'zustand/shallow';

const Tile = ({ tileType = 'sand', index, ...props }) => {
  const ref = useRef();

  const clickedTile = useStore((state) => state.clickedTile);

  const tileColor = useMemo(() => {
    switch (tileType) {
      case 'sand':
        return 'brown';
      case 'stone':
        return 'grey';
      case 'tree':
        return 'green';
      case 'pond':
        return 'blue';
    }
  }, [tileType]);

  const handleClick = (e, tile) => {
    if (clickedTile === null) {
      let x = e.x / window.innerWidth;
      let y = e.y / window.innerHeight;

      useStore.setState({ clickedPosition: { x, y }, clickedTile: tile });
    } else {
      useStore.setState({ clickedTile: null });
    }
  };

  return (
    <mesh
      ref={ref}
      {...props}
      rotation-x={-Math.PI / 2}
      scale={[0.95, 0.95, 0.95]} // TEMPORARY FOR DEBUGGING
      onClick={(e) => handleClick(e, ref.current)}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={tileColor} />
    </mesh>
  );
};

export default Tile;
