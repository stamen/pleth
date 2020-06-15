import React, { Fragment } from 'react';
import polylabel from '@datavis-tech/polylabel';
import { maxIndex } from 'd3-array';

export const PolygonLabelsLayer = ({
  width,
  height,
  geometries,
  projection,
  path,
}) => {
  // Wait for geometries to load.
  if (!geometries) return null;

  const labels = [];
  geometries.features.forEach((feature) => {
    const id = feature.id;
    const name = feature.properties.name;
    if (feature.geometry.type === 'Polygon') {
      const coordinates = polylabel([
        feature.geometry.coordinates[0].map(projection),
      ]);
      labels.push({ id, name, coordinates });
    } else if (feature.geometry.type === 'MultiPolygon') {
      const polylabels = feature.geometry.coordinates
        .map((polygon) => polygon[0].map(projection))
        .filter((projectedPolygon) => !projectedPolygon.some((d) => d === null))
        .map((projectedPolygon) => polylabel([projectedPolygon]));
      if (polylabels.length > 0) {
        const coordinates = polylabels[maxIndex(polylabels, (d) => d.distance)];
        labels.push({ id, name, coordinates });
      }
    }
  });

  return (
    <svg width={width} height={height}>
      {labels.map(({ id, name, coordinates }) => {
        const [x, y] = coordinates;
        return (
          <Fragment key={id}>
            <circle cx={x} cy={y} r={2} />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              // TODO use styled components
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                fontSize: '10px',
              }}
            >
              {name}
            </text>
          </Fragment>
        );
      })}
    </svg>
  );
};
