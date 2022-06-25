import useStore from '@/store';
import React from 'react';
import { useCallback } from 'react';
import shallow from 'zustand/shallow';

const SandUpgrade = () => {
  const { upgradingSand, clickedTile, upgradeTile } = useStore(
    (state) => ({
      upgradingSand: state.upgradingSand,
      clickedTile: state.clickedTile,
      upgradeTile: state.actions.upgradeTile,
    }),
    shallow
  );

  const handleUpgrade = useCallback(
    (e, newType) => {
      upgradeTile(clickedTile, newType);
    },
    [clickedTile, upgradeTile]
  );

  return (
    <div
      id='sandUpgrade'
      className={upgradingSand ? 'modal open' : 'modal'}
      onClick={() =>
        useStore.setState({ upgradingSand: false, clickedTile: null })
      }
    >
      <div>
        <button onClick={(e) => handleUpgrade(e, 'tree')}>
          Upgrade to Tree for 7
        </button>
      </div>
      <div>
        <button onClick={(e) => handleUpgrade(e, 'stone')}>
          Upgrade to Stone for 10
        </button>
      </div>
      <div>
        <button onClick={(e) => handleUpgrade(e, 'pond')}>
          Upgrade to Pond for 7
        </button>
      </div>
    </div>
  );
};

export default SandUpgrade;
