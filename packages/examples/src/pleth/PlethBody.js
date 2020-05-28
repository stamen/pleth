import React from 'react';
import { LayerWrapper } from './styles';

export const PlethBody = ({ width, height, layers }) => {
  const layerNamesSeen = {};
  return layers.map((Layer) => {
    if (!Layer.name) {
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
      throw new Error('Each layer entry must have a name field.');
    }
    if (layerNamesSeen[Layer.name]) {
      throw new Error(
        'The name field must be unique for layers. Multiple layers found with the same name "' +
          Layer.name +
          '".'
      );
    }
    layerNamesSeen[Layer.name] = true;
    if (typeof Layer !== 'function') {
      throw new Error('Each layer entry must be a function.');
    }
    return (
      <LayerWrapper key={Layer.name}>
        <Layer width={width} height={height} />
      </LayerWrapper>
    );
  });
};
