import useStore from '@/store';
import React, { useMemo } from 'react';
import shallow from 'zustand/shallow';

const TileContextMenu = () => {
  const { clickedTile, clickedPosition, hideContextMenu } = useStore();

  const actions = useStore((state) => state.actions);

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

  const handleTend = (e) => {
    e.stopPropagation();

    actions.tendTile(clickedTile);
    useStore.setState({ clickedTile: null });
  };

  return (
    <div
      id='tileContextMenu'
      className={clickedTile !== null && !hideContextMenu ? 'open' : ''}
      style={{ ...positionStyles }}
    >
      <button
        onClick={(e) => handleTend(e)}
        disabled={clickedTile && !clickedTile.userData.tendable}
      >
        Tend
      </button>
      {clickedTile && clickedTile.userData.type === 'sand' ? (
        <button
          onClick={() =>
            useStore.setState({ upgradingSand: true, hideContextMenu: true })
          }
        >
          Upgrade
        </button>
      ) : (
        <button
          onClick={() =>
            useStore.setState({ levelingUp: true, hideContextMenu: true })
          }
          disabled={clickedTile && clickedTile.userData.level >= 3}
        >
          Level
        </button>
      )}
      <hr />
      <button onClick={() => useStore.setState({ clickedTile: null })}>
        Cancel
      </button>
    </div>
  );
};

export default TileContextMenu;
