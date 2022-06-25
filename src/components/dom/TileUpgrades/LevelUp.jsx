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

  const typeRef = useRef();
  const levelRef = useRef();

  const level = useMemo(() => {
    if (clickedTile) {
      return clickedTile.userData.level;
    } else {
      return levelRef.current;
    }
  }, [clickedTile]);

  const type = useMemo(() => {
    if (clickedTile) {
      return clickedTile.userData.type;
    } else {
      return typeRef.current;
    }
  }, [clickedTile]);

  const yields = useMemo(() => {
    let y = { now: 0, next: 0 };

    if (clickedTile) {
      y.now = calculateTendYields(clickedTile);

      y.next = calculateTendYields(clickedTile, clickedTile.userData.level + 1);
    }

    return y;
  }, [clickedTile, calculateTendYields]);

  useEffect(() => {
    if (clickedTile) {
      typeRef.current = clickedTile.userData.type;
      levelRef.current = clickedTile.userData.level;
    }
  }, [clickedTile]);

  return (
    <div
      id='levelUpModal'
      className={levelingUp ? 'modal open' : 'modal'}
      onClick={() => {
        useStore.setState({ levelingUp: false, clickedTile: null });
      }}
    >
      <div className='bounds'>
        <div className='head'>
          <h1>
            {type} level: {level} → {level + 1}
          </h1>
          <hr />
        </div>
        <p>
          Yields: {yields.now} → {yields.next}
        </p>
        <p className='cost'>
          Costs: {clickedTile && calculateLevelCost(clickedTile)}
        </p>
        <button onClick={() => levelTile(clickedTile)}>Level Up</button>
      </div>
    </div>
  );
};

export default LevelUp;
