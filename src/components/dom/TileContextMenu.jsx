import useStore from '@/store';
import React, { useMemo } from 'react';
import shallow from 'zustand/shallow';

const TileContextMenu = () => {
  const { clickedTile, clickedPosition, showContextMenu } = useStore();

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
    useStore.setState({ showContextMenu: false });
  };

  return (
    <div
      id='tileContextMenu'
      className={showContextMenu ? 'open' : ''}
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
            useStore.setState({ upgradingSand: true, showContextMenu: false })
          }
        >
          Upgrade
        </button>
      ) : (
        <button
          onClick={() =>
            useStore.setState({ levelingUp: true, showContextMenu: false })
          }
          disabled={clickedTile && clickedTile.userData.level >= 3}
        >
          Level
        </button>
      )}
      <hr />
      <button onClick={() => useStore.setState({ showContextMenu: false })}>
        Cancel
      </button>
    </div>
  );
};

export default TileContextMenu;
