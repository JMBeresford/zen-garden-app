import useStore from '@/store';
import React from 'react';

const Header = () => {
  const balance = useStore((state) => state.balance);
  const calculateExpansionCost = useStore(
    (state) => state.actions.calculateExpansionCost
  );
  const expandGarden = useStore((state) => state.actions.expandGarden);

  return (
    <header id='header'>
      <h3>Currency: {balance}</h3>
      <button id='expandBtn' onClick={expandGarden}>
        Expand for {calculateExpansionCost()}
      </button>
    </header>
  );
};

export default Header;
