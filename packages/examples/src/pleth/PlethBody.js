import React from 'react';
import { LayerWrapper } from './styles';

export const PlethBody = ({
  width,
  height,
  layers,
  geometries,
  projection,
}) => {
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

    // Adjust projection to the current width and height.
    // Each layer may mutate these, so it's reset before rendering each layer.
    projection.scale((width + height) / 2).translate([width / 2, height / 2]);

    return (
      <LayerWrapper key={Layer.name}>
        <Layer
          width={width}
          height={height}
          geometries={geometries}
          projection={projection}
        />
      </LayerWrapper>
    );
  });
};
