import fs from 'node:fs';

const input = 'docs/design/screens/2026-08-15/non-wikiwhy-bookends/mapguess-data/sf-analysis-neighborhoods.geojson';
const output = 'docs/design/screens/2026-08-15/non-wikiwhy-bookends/mapguess-san-francisco-base-v2.svg';
const collection = JSON.parse(fs.readFileSync(input, 'utf8'));
const features = collection.features.filter((feature) => !['Treasure Island'].includes(feature.properties.nhood));

const width = 620;
const height = 526;
const pad = 22;
const allPoints = features.flatMap((feature) => feature.geometry.coordinates.flat(2));
const minLon = Math.min(...allPoints.map(([lon]) => lon));
const maxLon = Math.max(...allPoints.map(([lon]) => lon));
const minLat = Math.min(...allPoints.map(([, lat]) => lat));
const maxLat = Math.max(...allPoints.map(([, lat]) => lat));
const lonScale = (width - pad * 2) / (maxLon - minLon);
const latScale = (height - pad * 2) / (maxLat - minLat);
const scale = Math.min(lonScale, latScale);
const usedW = (maxLon - minLon) * scale;
const usedH = (maxLat - minLat) * scale;
const offsetX = (width - usedW) / 2;
const offsetY = (height - usedH) / 2;

function project([lon, lat]) {
  return [offsetX + (lon - minLon) * scale, height - offsetY - (lat - minLat) * scale];
}

function distanceToSegment(point, start, end) {
  const [x, y] = point;
  const [x1, y1] = start;
  const [x2, y2] = end;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function simplify(points, epsilon = 1.1) {
  if (points.length < 3) return points;
  let maxDistance = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = distanceToSegment(points[i], points[0], points.at(-1));
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  if (maxDistance <= epsilon) return [points[0], points.at(-1)];
  return [...simplify(points.slice(0, index + 1), epsilon).slice(0, -1), ...simplify(points.slice(index), epsilon)];
}

function rings(feature) {
  const polygons = feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates : [feature.geometry.coordinates];
  return polygons.map((polygon) => polygon[0]);
}

function pathForRing(ring) {
  const points = simplify(ring.map(project));
  return `M ${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
}

const fills = ['#f5e6b8', '#f0dfaa', '#f7e9c1', '#ead8a3'];
const neighborhoodPaths = features.map((feature, index) => rings(feature).map((ring) =>
  `<path d="${pathForRing(ring)}" fill="${fills[index % fills.length]}" stroke="#b8a777" stroke-width="1.1"/>`,
).join('\n')).join('\n');

function line(points, attrs = '') {
  return `<polyline points="${points.map((point) => project(point).map((value) => value.toFixed(1)).join(',')).join(' ')}" ${attrs}/>`;
}

const roads = [
  line([[-122.493, 37.781], [-122.466, 37.78], [-122.445, 37.779], [-122.423, 37.778], [-122.404, 37.789]], 'fill="none" stroke="#fff" stroke-width="4"'),
  line([[-122.477, 37.807], [-122.453, 37.797], [-122.432, 37.789], [-122.405, 37.785]], 'fill="none" stroke="#d5c189" stroke-width="4"'),
  line([[-122.466, 37.805], [-122.464, 37.782], [-122.463, 37.754], [-122.462, 37.726]], 'fill="none" stroke="#d5c189" stroke-width="4"'),
  line([[-122.424, 37.805], [-122.423, 37.785], [-122.422, 37.763], [-122.421, 37.739]], 'fill="none" stroke="#fff" stroke-width="4"'),
  line([[-122.435, 37.806], [-122.433, 37.785], [-122.43, 37.764], [-122.428, 37.744]], 'fill="none" stroke="#d5c189" stroke-width="4"'),
  line([[-122.447, 37.772], [-122.426, 37.77], [-122.405, 37.769]], 'fill="none" stroke="#fff" stroke-width="3"'),
];

const labels = [
  ['SAN FRANCISCO', -122.447, 37.792, 'label city'],
  ['GOLDEN GATE PARK', -122.486, 37.769, 'label park'],
  ['PRESIDIO', -122.468, 37.799, 'label'],
  ["FISHERMAN'S WHARF", -122.414, 37.808, 'label'],
  ['DOWNTOWN', -122.407, 37.790, 'label'],
  ['MISSION', -122.419, 37.759, 'label'],
  ['NOE VALLEY', -122.433, 37.750, 'label'],
  ['SUNSET', -122.495, 37.756, 'label'],
  ['RICHMOND', -122.485, 37.782, 'label'],
].map(([text, lon, lat, className]) => {
  const [x, y] = project([lon, lat]);
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="${className}">${text}</text>`;
}).join('\n');

const parkTopLeft = project([-122.511, 37.773]);
const parkBottomRight = project([-122.454, 37.766]);
const parkX = Math.min(parkTopLeft[0], parkBottomRight[0]);
const parkY = Math.min(parkTopLeft[1], parkBottomRight[1]);
const parkW = Math.abs(parkBottomRight[0] - parkTopLeft[0]);
const parkH = Math.abs(parkBottomRight[1] - parkTopLeft[1]);

const bridgeA = project([-122.4785, 37.8198]);
const bridgeB = project([-122.476, 37.8078]);

const namedPoints = Object.fromEntries(Object.entries({
  home: [-122.432, 37.7485],
  library: [-122.435, 37.7513],
  snackPalace: [-122.414, 37.808],
  downtown: [-122.407, 37.79],
  park: [-122.486, 37.769],
}).map(([name, coordinates]) => [name, project(coordinates).map((value) => Number(value.toFixed(1)))]));

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>.label{font:700 11px "Chalkboard SE","Comic Sans MS",sans-serif;fill:#5b604f;paint-order:stroke;stroke:#f7edcf;stroke-width:3px}.city{font-size:15px;fill:#283c42}.park{fill:#3f744a;font-size:10px}</style>
  <rect width="${width}" height="${height}" fill="#91cee0"/>
  ${neighborhoodPaths}
  <rect x="${parkX.toFixed(1)}" y="${parkY.toFixed(1)}" width="${parkW.toFixed(1)}" height="${parkH.toFixed(1)}" rx="8" fill="#8fbd68" stroke="#709e52"/>
  ${roads.join('\n')}
  <line x1="${bridgeA[0].toFixed(1)}" y1="${bridgeA[1].toFixed(1)}" x2="${bridgeB[0].toFixed(1)}" y2="${bridgeB[1].toFixed(1)}" stroke="#c85f3a" stroke-width="8"/>
  <line x1="${bridgeA[0].toFixed(1)}" y1="${bridgeA[1].toFixed(1)}" x2="${bridgeB[0].toFixed(1)}" y2="${bridgeB[1].toFixed(1)}" stroke="#f2d7b3" stroke-width="2"/>
  ${labels}
</svg>`;

fs.writeFileSync(output, svg);
fs.writeFileSync('docs/design/screens/2026-08-15/non-wikiwhy-bookends/mapguess-data/sf-map-points-v2.json', `${JSON.stringify(namedPoints, null, 2)}\n`);
console.log(JSON.stringify({ output, bounds: { minLon, maxLon, minLat, maxLat }, points: namedPoints }, null, 2));
