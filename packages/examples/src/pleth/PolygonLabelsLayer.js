import React from 'react';
import polylabel from 'polylabel';

export const PolygonLabelsLayer = ({
  width,
  height,
  geometries,
  projection,
}) => {
  // Wait for geometries to load.
  if (!geometries) return null;

  // TODO memoize this
  // TODO move all this to preprocessing
  const labels = [];
  geometries.features.forEach((feature) => {
    if (feature.geometry.type === 'Polygon') {
      labels.push({
        name: feature.properties.name,
        coordinates: polylabel(feature.geometry.coordinates),
      });
    } else if (feature.geometry.type === 'MultiPolygon') {
      console.log('TODO handle MultiPolygon');
    }
  });

  return (
    <svg width={width} height={height}>
      {labels.map(({ name, coordinates }) => {
        const [x, y] = projection(coordinates);
        return (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            alignmentBaseline="middle"
            // TODO use styled components
            style={{ pointerEvents: 'none', userSelect: 'none', fontSize: '10px' }}
          >
            {name}
          </text>
        );
      })}
    </svg>
  );
};
