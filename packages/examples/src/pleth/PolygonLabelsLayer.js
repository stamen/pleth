import React from 'react';
import styled from 'styled-components';
import polylabel from '@datavis-tech/polylabel';
import { maxIndex } from 'd3-array';

const centroidWeight = 0.01;
const precision = 1;

const Text = styled.text`
  pointer-events: none;
  user-select: none;
  font-size: 10px;
  text-anchor: middle;
  alignment-baseline: middle;
  stroke-linejoin: round;
`;

const TextStroke = styled(Text)`
  opacity: 0.8;
  stroke: white;
  stroke-width: 2px;
`;

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
      const coordinates = polylabel(
        [feature.geometry.coordinates[0].map(projection)],
        precision,
        false,
        centroidWeight
      );
      labels.push({ id, name, coordinates });
    } else if (feature.geometry.type === 'MultiPolygon') {
      const polylabels = feature.geometry.coordinates
        .map((polygon) => polygon[0].map(projection))
        .filter((projectedPolygon) => !projectedPolygon.some((d) => d === null))
        .map((projectedPolygon) =>
          polylabel([projectedPolygon], precision, false, centroidWeight)
        );
      if (polylabels.length > 0) {
        const coordinates = polylabels[maxIndex(polylabels, (d) => d.distance)];
        labels.push({ id, name, coordinates });
      }
    }
  });

  return (
    <svg width={width} height={height}>
      {labels.map(({ id, name, coordinates }) => {
        return (
          <g key={id} transform={`translate(${coordinates})`}>
            <TextStroke> {name} </TextStroke>
            <Text> {name} </Text>
          </g>
        );
      })}
    </svg>
  );
};
