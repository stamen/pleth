import React from 'react';
import { LayerWrapper } from './styles';

export const PlethBody = ({
  width,
  height,
  layers,
  geometries,
  projection,
  urlDispatch,
}) => {
  return layers.map((Layer) => {
    // Adjust projection to the current width and height.
    // Each layer may mutate these, so it's reset before rendering each layer.
    //projection.scale((width + height) / 2).translate([width / 2, height / 2]);
    if (projection.fitExtent) {
      projection.fitExtent(
        [
          [0, 0],
          [width, height],
        ],
        geometries
      );
    }

    return (
      <LayerWrapper key={Layer.name}>
        <Layer
          width={width}
          height={height}
          geometries={geometries}
          projection={projection}
          urlDispatch={urlDispatch}
        />
      </LayerWrapper>
    );
  });
};
