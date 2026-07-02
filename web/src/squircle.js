const BASE_SIZE = 40;

const BASE_POINTS = {
  startTopLeft: [0.000882187, 19.9501],
  startTopRight: [20.0499, 0.00088058],
  endTopLeft: [19.9501, 0.00088058],
  rightMidTop: [39.9991, 19.9501],
  rightMidBottom: [39.9991, 20.0499],
  leftBottomStart: [19.9501, 39.9991],
  rightBottomStart: [20.0499, 39.9991],
  leftMidBottom: [0.000882187, 20.0499],
};

const CURVES = {
  topLeft: [
    [-0.00681524, 16.6176, 0.024933, 13.3244, 0.546368, 10.521],
    [1.0678, 7.71756, 2.07892, 5.40381, 3.74136, 3.74137],
    [5.40379, 2.07894, 7.71754, 1.06781, 10.521, 0.546369],
    [13.3244, 0.0249323, 16.6175, -0.00680805, 19.9501, 0.00088058],
  ],
  topRight: [
    [23.3824, -0.00680805, 26.6756, 0.0249323, 29.479, 0.546369],
    [32.2824, 1.06781, 34.5962, 2.07894, 36.2586, 3.74137],
    [37.9211, 5.40381, 38.9322, 7.71756, 39.4536, 10.521],
    [39.9751, 13.3244, 40.0068, 16.6176, 39.9991, 19.9501],
  ],
  bottomRight: [
    [40.0068, 23.3824, 39.9751, 26.6756, 39.4536, 29.479],
    [38.9322, 32.2825, 37.9211, 34.5962, 36.2586, 36.2586],
    [34.5962, 37.9211, 32.2824, 38.9322, 29.479, 39.4536],
    [26.6756, 39.9751, 23.3824, 40.0068, 20.0499, 39.9991],
  ],
  bottomLeft: [
    [16.6175, 40.0068, 13.3244, 39.9751, 10.521, 39.4536],
    [7.71754, 38.9322, 5.40379, 37.9211, 3.74136, 36.2586],
    [2.07892, 34.5962, 1.0678, 32.2825, 0.546368, 29.479],
    [0.024933, 26.6756, -0.00681524, 23.3824, 0.000882187, 20.0499],
  ],
};

function round(value) {
  return Number(value.toFixed(4));
}

function mapX(value, scale, extraWidth) {
  const scaled = value * scale;
  return value > BASE_SIZE / 2 ? scaled + extraWidth : scaled;
}

function mapY(value, scale, extraHeight) {
  const scaled = value * scale;
  return value > BASE_SIZE / 2 ? scaled + extraHeight : scaled;
}

function pointToString(x, y) {
  return `${round(x)} ${round(y)}`;
}

function curveToString(curve, scale, extraWidth, extraHeight) {
  const [x1, y1, x2, y2, x3, y3] = curve;

  return [
    round(mapX(x1, scale, extraWidth)),
    round(mapY(y1, scale, extraHeight)),
    round(mapX(x2, scale, extraWidth)),
    round(mapY(y2, scale, extraHeight)),
    round(mapX(x3, scale, extraWidth)),
    round(mapY(y3, scale, extraHeight)),
  ].join(" ");
}

export function createScalableSquirclePath(width, height, cornerSize) {
  const effectiveCorner = cornerSize != null ? Math.max(8, cornerSize) : Math.max(8, Math.min(width, height));
  const scale = effectiveCorner / BASE_SIZE;
  const minimumDim = BASE_SIZE * scale;
  const extraWidth = Math.max(0, width - minimumDim);
  const extraHeight = Math.max(0, height - minimumDim);

  const commands = [
    `M ${pointToString(mapX(BASE_POINTS.startTopLeft[0], scale, extraWidth), mapY(BASE_POINTS.startTopLeft[1], scale, extraHeight))}`,
    ...CURVES.topLeft.map((curve) => `C ${curveToString(curve, scale, extraWidth, extraHeight)}`),
    `L ${pointToString(mapX(BASE_POINTS.startTopRight[0], scale, extraWidth), mapY(BASE_POINTS.startTopRight[1], scale, extraHeight))}`,
    ...CURVES.topRight.map((curve) => `C ${curveToString(curve, scale, extraWidth, extraHeight)}`),
    `L ${pointToString(mapX(BASE_POINTS.rightMidBottom[0], scale, extraWidth), mapY(BASE_POINTS.rightMidBottom[1], scale, extraHeight))}`,
    ...CURVES.bottomRight.map((curve) => `C ${curveToString(curve, scale, extraWidth, extraHeight)}`),
    `L ${pointToString(mapX(BASE_POINTS.leftBottomStart[0], scale, extraWidth), mapY(BASE_POINTS.leftBottomStart[1], scale, extraHeight))}`,
    ...CURVES.bottomLeft.map((curve) => `C ${curveToString(curve, scale, extraWidth, extraHeight)}`),
    "Z",
  ];

  return commands.join(" ");
}
