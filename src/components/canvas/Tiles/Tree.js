import { RoundedBox } from '@react-three/drei';
import React from 'react';

const Tree = (props) => {
  return (
    <RoundedBox radius={0.05} smoothness={16} {...props}>
      <meshPhongMaterial color='#b0ffbe' />
    </RoundedBox>
  );
};

export default Tree;
