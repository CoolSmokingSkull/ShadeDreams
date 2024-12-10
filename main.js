// main.js

// Initialize WebGL Context
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL not supported in your browser.');
}

// Resize Canvas to Fit Window
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Shader Sources
const vertexShaderSource = `
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// Adjustable Parameters
uniform float u_param1;
uniform float u_param2;
uniform float u_param3;
uniform float u_param4;
uniform float u_param5;
uniform float u_param6;
uniform float u_param7;
uniform float u_param8;
uniform float u_param9;
uniform float u_param10;
uniform float u_param11;
uniform float u_param12;
uniform float u_param13;
uniform float u_param14;
uniform float u_param15;
uniform float u_param16;
uniform float u_param17;
uniform float u_param18;
uniform float u_param19;
uniform float u_param20;
uniform float u_param21;
uniform float u_param22;
uniform float u_param23;
uniform float u_param24;
uniform float u_param25;

// Function to create noise
float noise(vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) *
                 43758.5453123);
}

// Function to create smooth noise
float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Mix 4 corners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  
  // Normalize coordinates
  vec2 pos = (st - 0.5) * 2.0;

  // Time varying pixel color
  float t = u_time * u_param1;

  // Layer 1: Base Gradient
  vec3 color = vec3(0.0);
  color += vec3(st.x * u_param2, st.y * u_param3, (1.0 - st.x) * u_param4);

  // Layer 2: Moving Waves
  float wave = sin((st.x * u_param5 + t) * u_param6) * u_param7;
  color += vec3(wave * u_param8, wave * u_param9, wave * u_param10);

  // Layer 3: Circular Ripples
  float dist = distance(st, vec2(0.5));
  float ripple = sin((dist - t * u_param11) * u_param12) * u_param13;
  color += vec3(ripple * u_param14, ripple * u_param15, ripple * u_param16);

  // Layer 4: Noise Overlay
  float n = smoothNoise(st * u_param17) * u_param18;
  color += vec3(n * u_param19, n * u_param20, n * u_param21);

  // Layer 5: Dynamic Lighting
  vec3 light = vec3(0.5 + 0.5 * sin(t * u_param22), 0.5 + 0.5 * cos(t * u_param23), 0.5);
  color *= light;

  // Final Adjustments
  color = pow(color, vec3(u_param24)); // Gamma Correction
  color += vec3(u_param25); // Brightness

  gl_FragColor = vec4(color, 1.0);
}
`;

// Compile Shader
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.error('Shader compile failed with:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// Create Shader Program
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.error('Program failed to link:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// Compile and Link Shaders
const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

if (!program) {
  alert('Failed to initialize shaders.');
}

// Look Up Attribute and Uniform Locations
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

// Initialize Adjustable Parameters
const params = {
  u_param1: 1.0,  // Time Speed
  u_param2: 1.0,  // Base Gradient X
  u_param3: 1.0,  // Base Gradient Y
  u_param4: 1.0,  // Base Gradient Z
  u_param5: 10.0, // Wave Frequency
  u_param6: 2.0,  // Wave Speed
  u_param7: 0.5,  // Wave Amplitude R
  u_param8: 0.5,  // Wave Amplitude G
  u_param9: 0.5,  // Wave Amplitude B
  u_param10: 0.0, // Wave Offset
  u_param11: 5.0, // Ripple Frequency
  u_param12: 2.0, // Ripple Speed
  u_param13: 0.3, // Ripple Amplitude
  u_param14: 0.3, // Ripple Color R
  u_param15: 0.3, // Ripple Color G
  u_param16: 0.3, // Ripple Color B
  u_param17: 5.0, // Noise Scale
  u_param18: 0.5, // Noise Intensity
  u_param19: 0.1, // Noise Color R
  u_param20: 0.1, // Noise Color G
  u_param21: 0.1, // Noise Color B
  u_param22: 1.0, // Light Flicker Speed
  u_param23: 1.0, // Light Flicker Intensity
  u_param24: 2.2, // Gamma Correction
  u_param25: 0.0, // Brightness Adjustment
};

// Create Buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Fullscreen Quad
const positions = [
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Enable Attribute
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(
  positionAttributeLocation,
  2,          // size (components per iteration)
  gl.FLOAT,   // type
  false,      // normalize
  0,          // stride
  0           // offset
);

// Use Program
gl.useProgram(program);

// Set Resolution Uniform
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

// Animation Loop
let startTime = Date.now();
function render() {
  const currentTime = Date.now();
  const elapsedTime = (currentTime - startTime) / 1000.0;

  gl.uniform1f(timeUniformLocation, elapsedTime);

  // Update All Parameter Uniforms
  for (let key in params) {
    const location = gl.getUniformLocation(program, key);
    if (location !== -1) {
      gl.uniform1f(location, params[key]);
    }
  }

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Handle Fullscreen Toggle
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.getElementById('preview').requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Generate UI Controls
const parametersContainer = document.getElementById('parameters');

// Parameter Definitions
const parameterDefinitions = [
  { name: 'u_param1', type: 'range', label: 'Time Speed', min: 0.1, max: 5.0, step: 0.1 },
  { name: 'u_param2', type: 'range', label: 'Base Gradient X', min: 0.0, max: 2.0, step: 0.1 },
  { name: 'u_param3', type: 'range', label: 'Base Gradient Y', min: 0.0, max: 2.0, step: 0.1 },
  { name: 'u_param4', type: 'range', label: 'Base Gradient Z', min: 0.0, max: 2.0, step: 0.1 },
  { name: 'u_param5', type: 'range', label: 'Wave Frequency', min: 1.0, max: 20.0, step: 0.5 },
  { name: 'u_param6', type: 'range', label: 'Wave Speed', min: 0.5, max: 5.0, step: 0.1 },
  { name: 'u_param7', type: 'range', label: 'Wave Amplitude R', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param8', type: 'range', label: 'Wave Amplitude G', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param9', type: 'range', label: 'Wave Amplitude B', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param10', type: 'range', label: 'Wave Offset', min: -1.0, max: 1.0, step: 0.05 },
  { name: 'u_param11', type: 'range', label: 'Ripple Frequency', min: 1.0, max: 20.0, step: 0.5 },
  { name: 'u_param12', type: 'range', label: 'Ripple Speed', min: 0.5, max: 5.0, step: 0.1 },
  { name: 'u_param13', type: 'range', label: 'Ripple Amplitude', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param14', type: 'color', label: 'Ripple Color R' },
  { name: 'u_param15', type: 'color', label: 'Ripple Color G' },
  { name: 'u_param16', type: 'color', label: 'Ripple Color B' },
  { name: 'u_param17', type: 'range', label: 'Noise Scale', min: 1.0, max: 20.0, step: 0.5 },
  { name: 'u_param18', type: 'range', label: 'Noise Intensity', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param19', type: 'range', label: 'Noise Color R', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param20', type: 'range', label: 'Noise Color G', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param21', type: 'range', label: 'Noise Color B', min: 0.0, max: 1.0, step: 0.05 },
  { name: 'u_param22', type: 'range', label: 'Light Flicker Speed', min: 0.5, max: 5.0, step: 0.1 },
  { name: 'u_param23', type: 'range', label: 'Light Flicker Intensity', min: 0.0, max: 2.0, step: 0.1 },
  { name: 'u_param24', type: 'range', label: 'Gamma Correction', min: 1.0, max: 3.0, step: 0.1 },
  { name: 'u_param25', type: 'range', label: 'Brightness Adjustment', min: -1.0, max: 1.0, step: 0.05 },
];

// Helper Functions for Color Parameters
function getColorFromParams(paramName) {
  switch (paramName) {
    case 'u_param14':
      return { r: params.u_param14, g: 0, b: 0 };
    case 'u_param15':
      return { r: 0, g: params.u_param15, b: 0 };
    case 'u_param16':
      return { r: 0, g: 0, b: params.u_param16 };
    default:
      return { r: 0, g: 0, b: 0 };
  }
}

function setColorParams(paramName, rgb) {
  switch (paramName) {
    case 'u_param14':
      params.u_param14 = rgb.r;
      break;
    case 'u_param15':
      params.u_param15 = rgb.g;
      break;
    case 'u_param16':
      params.u_param16 = rgb.b;
      break;
    default:
      break;
  }
}

function hexToRgb(hex) {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  let bigint = parseInt(hex, 16);
  let r = ((bigint >> 16) & 255) / 255;
  let g = ((bigint >> 8) & 255) / 255;
  let b = (bigint & 255) / 255;

  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Helper Function to Count Decimal Places
function getDecimalPlaces(value) {
  if (Math.floor(value) === value) return 0;
  const valueStr = value.toString();
  if (valueStr.includes('.')) {
    return valueStr.split('.')[1].length;
  }
  return 0;
}

// Format Parameter Value Based on Type
function formatParamValue(param) {
  if (param.type === 'range') {
    return params[param.name].toFixed(getDecimalPlaces(param.step));
  } else if (param.type === 'color') {
    const rgb = getColorFromParams(param.name);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }
  return '';
}

// Function to create parameter controls
function createParameterControl(param) {
  const group = document.createElement('div');
  group.className = 'parameter-group';

  const label = document.createElement('label');
  label.htmlFor = param.name;
  label.textContent = `${param.label}: ${formatParamValue(param)}`;

  let input;
  if (param.type === 'range') {
    input = document.createElement('input');
    input.type = 'range';
    input.id = param.name;
    input.min = param.min;
    input.max = param.max;
    input.step = param.step;
    input.value = params[param.name];
    input.addEventListener('input', (e) => {
      params[param.name] = parseFloat(e.target.value);
      label.textContent = `${param.label}: ${params[param.name].toFixed(getDecimalPlaces(param.step))}`;
    });
  } else if (param.type === 'color') {
    input = document.createElement('input');
    input.type = 'color';
    input.id = param.name;
    // Initialize color based on RGB parameters
    const rgb = getColorFromParams(param.name);
    input.value = rgbToHex(rgb.r, rgb.g, rgb.b);
    input.addEventListener('input', (e) => {
      const hex = e.target.value;
      const rgb = hexToRgb(hex);
      setColorParams(param.name, rgb);
      label.textContent = `${param.label}: ${hex}`;
    });
  }

  group.appendChild(label);
  group.appendChild(input);
  return group;
}

// Generate and Append All Parameter Controls
parameterDefinitions.forEach(param => {
  const control = createParameterControl(param);
  parametersContainer.appendChild(control);
});

// Initialize with Intricate Shader Parameters
function initializeDefaultParameters() {
  parameterDefinitions.forEach(param => {
    if (param.type === 'range') {
      const slider = document.getElementById(param.name);
      slider.value = params[param.name];
      const label = slider.previousSibling;
      label.textContent = `${param.label}: ${params[param.name].toFixed(getDecimalPlaces(param.step))}`;
    } else if (param.type === 'color') {
      const colorInput = document.getElementById(param.name);
      const rgb = getColorFromParams(param.name);
      colorInput.value = rgbToHex(rgb.r, rgb.g, rgb.b);
      const label = colorInput.previousSibling;
      label.textContent = `${param.label}: ${colorInput.value}`;
    }
  });
}
initializeDefaultParameters();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => {
        console.log('Service Worker registered.', reg);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}
