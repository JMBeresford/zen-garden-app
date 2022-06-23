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

  const handleLevel = (e) => {
    e.stopPropagation();

    actions.levelTile(clickedTile);
    useStore.setState({ clickedTile: null });
  };

  const handleUpgrade = (e) => {
    e.stopPropagation();

    actions.upgradeTile(clickedTile, 'pond');
    useStore.setState({ clickedTile: null });
  };

  const handleTend = (e) => {
    e.stopPropagation();

    actions.tendTile(clickedTile);
    useStore.setState({ clickedTile: null });
  };

  return (
    <div
      id='tileContextMenu'
      className={clickedTile !== null ? 'open' : ''}
      style={{ ...positionStyles }}
    >
      <button
        onClick={(e) => handleTend(e)}
        disabled={clickedTile && !clickedTile.userData.tendable}
      >
        Tend
      </button>
      {clickedTile && clickedTile.userData.type === 'sand' ? (
        <button onClick={handleUpgrade}>Upgrade</button>
      ) : (
        <button
          onClick={handleLevel}
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
