global.math = require('mathjs');

const html = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <input type="text" id="expression" />
  <button id="calculate-btn"></button>
  <div id="result-output"></div>
  <div id="error-message"></div>
  <div class="mode-tab" data-mode="expression"></div>
  <div class="mode-tab" data-mode="vector"></div>
  <div class="mode-tab" data-mode="graph"></div>
  <div class="mode-tab" data-mode="surface"></div>
  <div class="mode-tab" data-mode="visualize"></div>
  <div class="mode-tab" data-mode="matrix"></div>
  <div class="expression-mode"></div>
  <div class="vector-mode">
    <input id="vec-a-x" /><input id="vec-a-y" /><input id="vec-a-z" />
    <input id="vec-b-x" /><input id="vec-b-y" /><input id="vec-b-z" />
    <select id="vector-operation"></select>
  </div>
  <div class="graph-mode">
    <input id="graph-function" />
    <input id="x-min" /><input id="x-max" />
    <button id="graph-btn"></button>
    <canvas id="graph-canvas" width="600" height="400"></canvas>
    <div id="graph-error"></div>
  </div>
  <div class="surface-mode">
    <input id="3d-function" />
    <button id="surface-graph-btn"></button>
    <div id="3d-canvas-container"></div>
    <div id="3d-error-message"></div>
    <button id="rotate-btn"></button>
    <button id="reset-camera-btn"></button>
  </div>
  <div class="visualize-mode">
    <input id="viz-vec-a-x" /><input id="viz-vec-a-y" /><input id="viz-vec-a-z" />
    <input id="viz-vec-b-x" /><input id="viz-vec-b-y" /><input id="viz-vec-b-z" />
    <button id="update-viz-btn"></button>
    <canvas id="viz-canvas" width="600" height="400"></canvas>
  </div>
  <div class="matrix-mode">
    <select id="matrix-size"><option value="2">2x2</option><option value="3">3x3</option></select>
    <select id="matrix-operation"></select>
    <div id="matrix-a-inputs"></div>
    <div id="matrix-b-inputs"></div>
    <div id="scale-input-group"></div>
    <input id="scalar-value" />
  </div>
</body>
</html>
`;

document.documentElement.innerHTML = html;

window.THREE = {
  Scene: class {},
  PerspectiveCamera: class {},
  WebGLRenderer: class { setSize() {} },
  AmbientLight: class {},
  DirectionalLight: class {},
  AxesHelper: class {},
  GridHelper: class {},
  BufferGeometry: class {
    setAttribute() {}
    setIndex() {}
  },
  Float32BufferAttribute: class {},
  MeshPhongMaterial: class {},
  Mesh: class {},
  Color: class {},
  Spherical: class {
    setFromVector3() {}
    setFromSpherical() {}
  }
};