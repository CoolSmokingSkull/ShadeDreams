// main.js

// Initialize WebGL Context
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL not supported in your browser.');
}

// Resize Canvas to Fit Window
function resizeCanvas() {
  const preview = document.getElementById('preview');
  const rect = preview.getBoundingClientRect();
  
  canvas.width = rect.width;
  canvas.height = rect.height;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Shader Sources
const shaders = {
  intricate: {
    vertex: `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `,
    fragment: `
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
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) *
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
    `
  },
  fire: {
    vertex: `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `,
    fragment: `
      precision mediump float;

      uniform float u_time;
      uniform vec2 u_resolution;

      uniform float u_param1_fire;  // Time Speed
      uniform float u_param2_fire;  // Base Temperature
      uniform float u_param3_fire;  // Flame Height
      uniform float u_param4_fire;  // Flicker Intensity
      uniform float u_param5_fire;  // Flame Width
      uniform float u_param6_fire;  // Noise Scale
      uniform float u_param7_fire;  // Noise Intensity
      uniform float u_param8_fire;  // Color Shift Speed
      uniform float u_param9_fire;  // Brightness
      uniform float u_param10_fire; // Gamma Correction
      uniform float u_param11_fire;  // Base Red
      uniform float u_param12_fire;  // Base Green
      uniform float u_param13_fire;  // Base Blue
      uniform float u_param14_fire;  // Flicker Red
      uniform float u_param15_fire;  // Flicker Green
      uniform float u_param16_fire;  // Flicker Blue

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        float t = u_time * u_param1_fire;
        
        // Base shape
        float y = 1.0 - st.y;
        float flameShape = pow(y * u_param3_fire, 1.5) * u_param2_fire;
        
        // Add horizontal variation
        float xOffset = (st.x - 0.5) * u_param5_fire;
        flameShape *= exp(-xOffset * xOffset * 8.0);
        
        // Enhanced noise and movement
        vec2 noisePos = st * u_param6_fire;
        noisePos.y -= t * 0.5;
        float n = noise(noisePos) * u_param7_fire;
        
        // Add flicker
        float flicker = sin(t * 5.0) * u_param4_fire * 0.5 + 0.5;
        
        // Combine effects
        float intensity = flameShape + n * flicker;
        
        // Color gradient with new parameters
        vec3 baseColor = vec3(u_param11_fire, u_param12_fire, u_param13_fire);
        vec3 flickerColor = vec3(u_param14_fire, u_param15_fire, u_param16_fire);
        vec3 color = mix(baseColor, flickerColor, intensity);
        
        // Dynamic color shift
        float shift = sin(t * u_param8_fire) * 0.1;
        color.r = min(1.0, color.r + shift);
        
        // Apply gamma and brightness
        color = pow(color * intensity, vec3(1.0 / u_param10_fire));
        color *= 1.0 + u_param9_fire;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  water: {
    vertex: `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `,
    fragment: `
      precision mediump float;

      uniform float u_time;
      uniform vec2 u_resolution;

      // Adjustable Parameters
      uniform float u_param1_water; // Time Speed
      uniform float u_param2_water; // Ripple Frequency
      uniform float u_param3_water; // Ripple Amplitude
      uniform float u_param4_water; // Color Intensity
      uniform float u_param5_water; // Wave Speed
      uniform float u_param6_water; // Wave Frequency
      uniform float u_param7_water; // Wave Amplitude
      uniform float u_param8_water; // Noise Scale
      uniform float u_param9_water; // Noise Intensity
      uniform float u_param10_water; // Gamma Correction

      // Function to create noise
      float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 pos = (st - 0.5) * 2.0;

        float t = u_time * u_param1_water;

        // Base water color
        vec3 color = vec3(0.0, 0.3, 0.5);

        // Add ripples
        float ripple = sin(distance(st, vec2(0.5)) * u_param2_water - t * u_param3_water);
        ripple *= u_param4_water;
        color += vec3(0.0, ripple, ripple);

        // Add waves
        float wave = sin(st.x * u_param6_water + t * u_param5_water) * u_param7_water;
        color += vec3(wave, wave, 0.0);

        // Add noise for water texture
        float n = noise(st * u_param8_water + t) * u_param9_water;
        color += vec3(n, n, n);

        // Final Adjustments
        color = pow(color, vec3(u_param10_water)); // Gamma Correction

        gl_FragColor = vec4(color, 1.0);
      }
    `
  }
};

// Current Shader Selection
let currentShader = 'intricate';

// Shader Program Variable
let program = null;

// Parameter Definitions
const parameterDefinitions = [
  // Intricate Shader Parameters
  { name: 'u_param1', type: 'range', label: 'Time Speed', min: 0.1, max: 5.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param2', type: 'range', label: 'Base Gradient X', min: 0.0, max: 2.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param3', type: 'range', label: 'Base Gradient Y', min: 0.0, max: 2.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param4', type: 'range', label: 'Base Gradient Z', min: 0.0, max: 2.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param5', type: 'range', label: 'Wave Frequency', min: 1.0, max: 20.0, step: 0.5, shader: 'intricate' },
  { name: 'u_param6', type: 'range', label: 'Wave Speed', min: 0.5, max: 5.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param7', type: 'range', label: 'Wave Amplitude R', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param8', type: 'range', label: 'Wave Amplitude G', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param9', type: 'range', label: 'Wave Amplitude B', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param10', type: 'range', label: 'Wave Offset', min: -1.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param11', type: 'range', label: 'Ripple Frequency', min: 1.0, max: 20.0, step: 0.5, shader: 'intricate' },
  { name: 'u_param12', type: 'range', label: 'Ripple Speed', min: 0.5, max: 5.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param13', type: 'range', label: 'Ripple Amplitude', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param14', type: 'range', label: 'Ripple Color R', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param15', type: 'range', label: 'Ripple Color G', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param16', type: 'range', label: 'Ripple Color B', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param17', type: 'range', label: 'Noise Scale', min: 1.0, max: 20.0, step: 0.5, shader: 'intricate' },
  { name: 'u_param18', type: 'range', label: 'Noise Intensity', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param19', type: 'range', label: 'Noise Color R', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param20', type: 'range', label: 'Noise Color G', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param21', type: 'range', label: 'Noise Color B', min: 0.0, max: 1.0, step: 0.05, shader: 'intricate' },
  { name: 'u_param22', type: 'range', label: 'Light Flicker Speed', min: 0.5, max: 5.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param23', type: 'range', label: 'Light Flicker Intensity', min: 0.0, max: 2.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param24', type: 'range', label: 'Gamma Correction', min: 1.0, max: 3.0, step: 0.1, shader: 'intricate' },
  { name: 'u_param25', type: 'range', label: 'Brightness Adjustment', min: -1.0, max: 1.0, step: 0.05, shader: 'intricate' },

  // Fire Shader Parameters
  { name: 'u_param1_fire', type: 'range', label: 'Time Speed', min: 0.1, max: 5.0, step: 0.1, shader: 'fire' },
  { name: 'u_param2_fire', type: 'range', label: 'Base Temperature', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param3_fire', type: 'range', label: 'Flame Height', min: 0.0, max: 2.0, step: 0.1, shader: 'fire' },
  { name: 'u_param4_fire', type: 'range', label: 'Flicker Intensity', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param5_fire', type: 'range', label: 'Flame Width', min: 0.0, max: 2.0, step: 0.1, shader: 'fire' },
  { name: 'u_param6_fire', type: 'range', label: 'Noise Scale', min: 1.0, max: 20.0, step: 0.5, shader: 'fire' },
  { name: 'u_param7_fire', type: 'range', label: 'Noise Intensity', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param8_fire', type: 'range', label: 'Color Shift Speed', min: 0.0, max: 5.0, step: 0.1, shader: 'fire' },
  { name: 'u_param9_fire', type: 'range', label: 'Brightness Adjustment', min: -1.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param10_fire', type: 'range', label: 'Gamma Correction', min: 1.0, max: 3.0, step: 0.1, shader: 'fire' },
  { name: 'u_param11_fire', type: 'range', label: 'Base Red', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param12_fire', type: 'range', label: 'Base Green', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param13_fire', type: 'range', label: 'Base Blue', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param14_fire', type: 'range', label: 'Flicker Red', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param15_fire', type: 'range', label: 'Flicker Green', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },
  { name: 'u_param16_fire', type: 'range', label: 'Flicker Blue', min: 0.0, max: 1.0, step: 0.05, shader: 'fire' },

  // Water Shader Parameters
  { name: 'u_param1_water', type: 'range', label: 'Time Speed', min: 0.1, max: 5.0, step: 0.1, shader: 'water' },
  { name: 'u_param2_water', type: 'range', label: 'Ripple Frequency', min: 1.0, max: 20.0, step: 0.5, shader: 'water' },
  { name: 'u_param3_water', type: 'range', label: 'Ripple Amplitude', min: 0.0, max: 1.0, step: 0.05, shader: 'water' },
  { name: 'u_param4_water', type: 'range', label: 'Color Intensity', min: 0.0, max: 1.0, step: 0.05, shader: 'water' },
  { name: 'u_param5_water', type: 'range', label: 'Wave Speed', min: 0.0, max: 5.0, step: 0.1, shader: 'water' },
  { name: 'u_param6_water', type: 'range', label: 'Wave Frequency', min: 0.0, max: 10.0, step: 0.1, shader: 'water' },
  { name: 'u_param7_water', type: 'range', label: 'Wave Amplitude', min: 0.0, max: 1.0, step: 0.05, shader: 'water' },
  { name: 'u_param8_water', type: 'range', label: 'Noise Scale', min: 1.0, max: 20.0, step: 0.5, shader: 'water' },
  { name: 'u_param9_water', type: 'range', label: 'Noise Intensity', min: 0.0, max: 1.0, step: 0.05, shader: 'water' },
  { name: 'u_param10_water', type: 'range', label: 'Gamma Correction', min: 1.0, max: 3.0, step: 0.1, shader: 'water' }
];

// Initialize Adjustable Parameters
let params = {
  // Intricate Shader Parameters
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

  // Fire Shader Parameters
  u_param1_fire: 1.0,    // Time Speed
  u_param2_fire: 0.8,    // Base Temperature
  u_param3_fire: 1.2,    // Flame Height
  u_param4_fire: 0.3,    // Flicker Intensity
  u_param5_fire: 1.5,    // Flame Width
  u_param6_fire: 8.0,    // Noise Scale
  u_param7_fire: 0.7,    // Noise Intensity
  u_param8_fire: 2.0,    // Color Shift Speed
  u_param9_fire: 0.2,    // Brightness
  u_param10_fire: 1.8,   // Gamma Correction
  u_param11_fire: 1.0,    // Base Red
  u_param12_fire: 0.2,    // Base Green
  u_param13_fire: 0.0,    // Base Blue
  u_param14_fire: 1.0,    // Flicker Red
  u_param15_fire: 0.7,    // Flicker Green
  u_param16_fire: 0.0,    // Flicker Blue

  // Water Shader Parameters
  u_param1_water: 1.0,  // Time Speed
  u_param2_water: 10.0, // Ripple Frequency
  u_param3_water: 0.5,  // Ripple Amplitude
  u_param4_water: 0.5,  // Color Intensity
  u_param5_water: 2.0,  // Wave Speed
  u_param6_water: 5.0,  // Wave Frequency
  u_param7_water: 0.5,  // Wave Amplitude
  u_param8_water: 5.0,  // Noise Scale
  u_param9_water: 0.5,  // Noise Intensity
  u_param10_water: 2.2, // Gamma Correction
};

// Uniform Locations Object
let uniformLocations = {};

// Function to compile shader
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

// Function to create shader program
function createProgram(gl, vertexShader, fragmentShader) {
  if (!vertexShader || !fragmentShader) return null;
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

// Function to initialize shader program
function initShaderProgram(shaderKey) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, shaders[shaderKey].vertex);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, shaders[shaderKey].fragment);
  program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) {
    alert('Failed to initialize shaders.');
    return;
  }

  gl.useProgram(program);
  getUniformLocations();
  setUniforms();
  setupAttributes();
}

// Function to get uniform locations
function getUniformLocations() {
  uniformLocations = {};
  uniformLocations['a_position'] = gl.getAttribLocation(program, 'a_position');
  uniformLocations['u_time'] = gl.getUniformLocation(program, 'u_time');
  uniformLocations['u_resolution'] = gl.getUniformLocation(program, 'u_resolution');

  // Loop through all adjustable parameters to get their uniform locations
  parameterDefinitions.forEach(param => {
    if (param.shader === currentShader) {
      const location = gl.getUniformLocation(program, param.name);
      if (location === null) {
        console.warn(`Uniform ${param.name} not found in shader ${currentShader}.`);
      }
      uniformLocations[param.name] = location;
    }
  });
}

// Function to set uniforms
function setUniforms() {
  gl.useProgram(program);
  gl.uniform2f(uniformLocations['u_resolution'], gl.canvas.width, gl.canvas.height);
}

// Create Buffer and Positions Array (Declared Once)
const positionBufferObj = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferObj);
// Fullscreen Quad
const positionsArray = [
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsArray), gl.STATIC_DRAW);

// Enable Attribute (Declared Once)
function setupAttributes() {
  gl.enableVertexAttribArray(uniformLocations['a_position']);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferObj);
  gl.vertexAttribPointer(
    uniformLocations['a_position'],
    2,          // size (components per iteration)
    gl.FLOAT,   // type
    false,      // normalize
    0,          // stride
    0           // offset
  );
}

// Initialize Shader Uniforms and Attributes
initShaderProgram(currentShader);

// Animation Loop
let startTime = Date.now();
function render() {
  const currentTime = Date.now();
  const elapsedTime = (currentTime - startTime) / 1000.0;

  gl.useProgram(program);
  gl.uniform1f(uniformLocations['u_time'], elapsedTime);

  // Update All Parameter Uniforms
  parameterDefinitions.forEach(param => {
    if (param.shader === currentShader && uniformLocations[param.name] !== null) {
      if (param.type === 'range') {
        gl.uniform1f(uniformLocations[param.name], params[param.name]);
      }
      // If you have color parameters as separate floats, handle them here
      // For example:
      // if (param.type === 'color') {
      //   gl.uniform1f(uniformLocations[param.name], params[param.name]);
      // }
    }
  });

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Handle Fullscreen Toggle
const fullscreenBtn = document.getElementById('fullscreen-btn');
const previewSection = document.getElementById('preview');

// Enhanced fullscreen handling
function toggleFullScreen() {
  const preview = document.getElementById('preview');
  const canvas = document.getElementById('glcanvas');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  if (!document.fullscreenElement) {
    // Enter fullscreen
    preview.classList.add('fullscreen-mode');
    fullscreenBtn.classList.add('in-fullscreen');
    
    try {
      // Try all possible fullscreen methods
      if (preview.requestFullscreen) {
        preview.requestFullscreen();
      } else if (preview.webkitRequestFullscreen) {
        preview.webkitRequestFullscreen();
      } else if (preview.mozRequestFullScreen) {
        preview.mozRequestFullScreen();
      } else if (preview.msRequestFullscreen) {
        preview.msRequestFullscreen();
      }
      
      // Move button to preview section
      preview.appendChild(fullscreenBtn);
      
      // Ensure proper canvas size
      setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }, 100);
      
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
  } else {
    // Exit fullscreen
    preview.classList.remove('fullscreen-mode');
    fullscreenBtn.classList.remove('in-fullscreen');
    
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      // Move button back to toolbar
      const toolbar = document.querySelector('.toolbar');
      toolbar.appendChild(fullscreenBtn);
      
      // Reset canvas size
      resizeCanvas();
      
    } catch (err) {
      console.error('Exit fullscreen failed:', err);
    }
  }
}

// Add fullscreen change event listener
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
  const preview = document.getElementById('preview');
  if (!document.fullscreenElement) {
    preview.classList.remove('fullscreen-mode');
    const toolbar = document.querySelector('.toolbar');
    toolbar.appendChild(fullscreenBtn);
    resizeCanvas();
  }
}

// Add orientation change handler for mobile
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCanvas, 300); // Delay to ensure proper resize after orientation change
});

// Prevent bounce scrolling on iOS
document.body.addEventListener('touchmove', (e) => {
  if (e.target.closest('#controls')) return;
  e.preventDefault();
}, { passive: false });

// Generate UI Controls
const parametersContainer = document.getElementById('parameters');

// Helper Functions
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
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
    // Assuming color is represented as separate floats, display as hex
    const rgb = { r: params[param.name], g: params[param.name], b: params[param.name] };
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
    
    // Add value percent for gradient
    const updateSliderBackground = (value) => {
      const percent = ((value - param.min) / (param.max - param.min)) * 100;
      input.style.setProperty('--value-percent', `${percent}%`);
    };
    
    updateSliderBackground(input.value);
    
    input.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      params[param.name] = value;
      label.textContent = `${param.label}: ${value.toFixed(getDecimalPlaces(param.step))}`;
      updateSliderBackground(value);
    });
  } else if (param.type === 'color') {
    input = document.createElement('input');
    input.type = 'color';
    input.id = param.name;
    // Initialize color based on the parameter value
    const hex = rgbToHex(params[param.name], params[param.name], params[param.name]);
    input.value = hex;
    input.addEventListener('input', (e) => {
      const hex = e.target.value;
      const rgb = hexToRgb(hex);
      // Assuming color parameters are separate, set each accordingly
      if (param.name === 'u_param14') params.u_param14 = rgb.r;
      if (param.name === 'u_param15') params.u_param15 = rgb.g;
      if (param.name === 'u_param16') params.u_param16 = rgb.b;
      label.textContent = `${param.label}: ${hex}`;
    });
  }

  group.appendChild(label);
  group.appendChild(input);
  return group;
}

// Determine if a parameter is relevant for the current shader
function isParamRelevant(paramName) {
  const param = parameterDefinitions.find(p => p.name === paramName);
  if (!param) return false;
  return param.shader === currentShader;
}

// Generate and Append All Parameter Controls
function generateParameterControls() {
  // Clear existing controls
  parametersContainer.innerHTML = '';
  parameterDefinitions.forEach(param => {
    if (isParamRelevant(param.name)) {
      const control = createParameterControl(param);
      parametersContainer.appendChild(control);
    }
  });
}

// Initialize Parameters with Current Shader's Defaults
function initializeDefaultParameters() {
  parameterDefinitions.forEach(param => {
    if (isParamRelevant(param.name)) {
      if (param.type === 'range') {
        const slider = document.getElementById(param.name);
        if (slider) {
          slider.value = params[param.name];
          const label = slider.previousSibling;
          label.textContent = `${param.label}: ${params[param.name].toFixed(getDecimalPlaces(param.step))}`;
        }
      } else if (param.type === 'color') {
        const colorInput = document.getElementById(param.name);
        if (colorInput) {
          const rgb = { r: params[param.name], g: params[param.name], b: params[param.name] };
          colorInput.value = rgbToHex(rgb.r, rgb.g, rgb.b);
          const label = colorInput.previousSibling;
          label.textContent = `${param.label}: ${colorInput.value}`;
        }
      }
    }
  });
}

// Handle Shader Selection
const shaderSelect = document.getElementById('shader-select');
shaderSelect.addEventListener('change', (e) => {
  currentShader = e.target.value;
  initShaderProgram(currentShader);
  generateParameterControls();
  initializeDefaultParameters();
});

// Initial Setup
generateParameterControls();
initializeDefaultParameters();

// Export Functionality
const exportBtn = document.getElementById('export-btn');
const exportModal = document.getElementById('export-modal');
const closeButton = document.querySelector('.close-button');
const startExportBtn = document.getElementById('start-export-btn');

exportBtn.addEventListener('click', () => {
  exportModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  exportModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == exportModal) {
    exportModal.style.display = 'none';
  }
});

startExportBtn.addEventListener('click', () => {
  const duration = parseInt(document.getElementById('export-duration').value, 10);
  if (isNaN(duration) || duration <= 0) {
    alert('Please enter a valid duration.');
    return;
  }
  exportGIF(duration);
  exportModal.style.display = 'none';
});

// Export as GIF using gif.js
function exportGIF(duration) {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: 'js/gif.worker.js' // Ensure this path is correct
  });

  const fps = 30;
  const totalFrames = duration * fps;
  let frame = 0;

  const captureFrame = () => {
    if (frame >= totalFrames) {
      gif.render();
      return;
    }
    gif.addFrame(canvas, { copy: true, delay: 1000 / fps });
    frame++;
    requestAnimationFrame(captureFrame);
  };

  gif.on('finished', function(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `dreamshader_export_${Date.now()}.gif`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });

  captureFrame();
}

// Donation Button Functionality
const donateBtn = document.getElementById('donate-btn');
donateBtn.addEventListener('click', () => {
  window.open('https://ko-fi.com/justinmunsell', '_blank'); // Replace with your actual donation link
});

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

// Remove fullscreen button code and add UI toggle
const toggleUIBtn = document.getElementById('toggle-ui');
toggleUIBtn.addEventListener('click', () => {
  document.body.classList.toggle('hide-ui');
});

// Update export functionality to only use GIF
startExportBtn.addEventListener('click', () => {
  const duration = parseInt(document.getElementById('export-duration').value, 10);
  if (isNaN(duration) || duration <= 0) {
    alert('Please enter a valid duration.');
    return;
  }
  exportGIF(duration);
  exportModal.style.display = 'none';
});
