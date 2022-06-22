import useStore from '@/store';
import React, { useMemo } from 'react';
import shallow from 'zustand/shallow';

const TileContextMenu = () => {
  const { clickedTile, clickedPosition } = useStore(
    (state) => ({
      clickedTile: state.clickedTile,
      clickedPosition: state.clickedPosition,
    }),
    shallow
  );

  const positionStyles = useMemo(() => {
    let styles = {};

    if (clickedPosition.y <= 0.5) {
      styles.top = `${clickedPosition.y * 100}%`;
    } else {
      styles.bottom = `${(1 - clickedPosition.y) * 100}%`;
    }

    if (clickedPosition.x <= 0.5) {
      styles.left = `${clickedPosition.x * 100}%`;
    } else {
      styles.right = `${(1 - clickedPosition.x) * 100}%`;
    }

    return styles;
  }, [clickedPosition]);

  return (
    <div
      id='tileContextMenu'
      className={clickedTile !== null ? 'open' : ''}
      style={{ ...positionStyles }}
    >
      <button>Tend</button>
      <button>Upgrade</button>
      <hr />
      <button>Cancel</button>
    </div>
  );
};

export default TileContextMenu;
