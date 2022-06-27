import useStore from '@/store';
import React from 'react';
import { useEffect } from 'react';
import { useMemo, useRef } from 'react';
import shallow from 'zustand/shallow';

const LevelUp = () => {
  const {
    clickedTile,
    levelingUp,
    levelTile,
    calculateTendYields,
    calculateLevelCost,
  } = useStore(
    (state) => ({
      clickedTile: state.clickedTile,
      levelingUp: state.levelingUp,
      levelTile: state.actions.levelTile,
      calculateTendYields: state.actions.calculateTendYields,
      calculateLevelCost: state.actions.calculateLevelCost,
    }),
    shallow
  );

  const level = useMemo(() => {
    if (clickedTile) {
      return clickedTile.userData.level;
    } else {
      return '';
    }
  }, [clickedTile]);

  const type = useMemo(() => {
    if (clickedTile) {
      return clickedTile.userData.type;
    } else {
      return 'Tile';
    }
  }, [clickedTile]);

  const cost = useMemo(() => {
    if (clickedTile && clickedTile.userData.type !== 'sand') {
      return calculateLevelCost(clickedTile);
    } else {
      return 0;
    }
  }, [clickedTile, calculateLevelCost]);

  const yields = useMemo(() => {
    let y = { now: 0, next: 0 };

    if (clickedTile) {
      y.now = calculateTendYields(clickedTile);

      y.next = calculateTendYields(clickedTile, 1);
    }

    return y;
  }, [clickedTile, calculateTendYields]);

  return (
    <div
      id='levelUpModal'
      className={levelingUp ? 'modal open' : 'modal'}
      onClick={() => {
        useStore.setState({ levelingUp: false });
      }}
    >
      <div className='bounds' onClick={(e) => e.stopPropagation()}>
        <div className='head'>
          <h1>
            {type} level: {level} → {level + 1}
          </h1>
          <hr />
        </div>
        <p>
          Yields: {yields.now} → {yields.next}
        </p>
        <p className='cost'>Costs: {cost}</p>
        <button onClick={() => levelTile(clickedTile)}>Level Up</button>
      </div>
    </div>
  );
};

export default LevelUp;
