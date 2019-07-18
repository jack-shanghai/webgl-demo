import {
  mat4,
  initShaders,
  initTextures,
  initArrayBuffer,
  getMvpMatrix
} from "./utils/index.js";
import {createCubeModel, createPlaneModel, createSphereModel} from './utils/geometry/index.js'

// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  uniform mat4 u_MvpMatrix;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }
`;

// Fragment shader program
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform sampler2D u_Sampler0;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
  }
`;

// Size of off screen
const OFFSCREEN_WIDTH = 256;
const OFFSCREEN_HEIGHT = 256;
const ANGLE_STEP = 0.5; 

let g_modelMatrix = mat4.create();
let g_mvpMatrix = mat4.create();

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById("webgl");
  const gl = canvas.getContext("webgl");
  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  const program = gl.program; // Get program object
  program.a_Position = gl.getAttribLocation(program, "a_Position");
  program.a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
  program.u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");

  // Set the vertex information
  const models = [
    createSphereModel(40),
    createCubeModel(1),
    createPlaneModel(2)
  ]
  const sphere = initVertexBuffers(gl, models[0]);
  const cube = initVertexBuffers(gl, models[1]);
  const plane = initVertexBuffers(gl, models[2]);

  // Set texture
  const url = "https://st-gdx.dancf.com/gaodingx/745312490/design/20190524-134937-1aa3.jpg";
  initTextures(gl, [url]).then(([texture]) => {
    const fbo1 = initFramebufferObject(gl);
    const fbo2 = initFramebufferObject(gl);
    gl.enable(gl.DEPTH_TEST); //  gl.enable(gl.CULL_FACE);

    const projMat = mat4.create();
    const viewMat = mat4.create();
    mat4.perspective(projMat,(30 * Math.PI) / 180, canvas.width / canvas.height,1,100);
    mat4.lookAt(viewMat, [0, 0, 7], [0, 0, 0], [0, 1, 0]);

    const projMatFBO = mat4.create();
    const viewMatFBO = mat4.create();
    mat4.perspective(projMatFBO,(30 * Math.PI) / 180, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT,1,100);
    mat4.lookAt(viewMatFBO, [0, 2, 7], [0, 0, 0], [0, 1, 0]);

    const projMatFBO2 = mat4.create();
    const viewMatFBO2 = mat4.create();
    mat4.perspective(projMatFBO2,(30 * Math.PI) / 180,OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT,1,100);
    mat4.lookAt(viewMatFBO2, [0, 2, 7], [0, 0, 0], [0, 1, 0]);

    // Start drawing
    let currentAngle = 0.0; // Current rotation angle (degrees)
    const tick = function() {
      currentAngle = animate(currentAngle); // Update current rotation angle
      draw( gl,canvas,[fbo1,fbo2],[sphere,cube,plane],currentAngle,texture,getMvpMatrix(projMat, viewMat),getMvpMatrix(projMatFBO, viewMatFBO),getMvpMatrix(projMatFBO2, viewMatFBO2));
      window.requestAnimationFrame(tick);
    };
    tick();
  });
}

main();

function initVertexBuffers(gl, model) {
  const vertices = new Float32Array(model.positions);
  const texCoords = new Float32Array(model.texCoords);
  const indices = new Uint16Array(model.indices); 
  var o = new Object(); // Create the "Object" object to return multiple objects.
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl,indices,gl.UNSIGNED_SHORT);
  o.numIndices = indices.length;
  return o;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.num = num;
  buffer.type = type;
  return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

function initFramebufferObject(gl) {
  var framebuffer, texture, depthBuffer;
  framebuffer = gl.createFramebuffer();
  texture = gl.createTexture(); // Create a texture object

  gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
  gl.texImage2D( gl.TEXTURE_2D,0,gl.RGBA,OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  framebuffer.texture = texture; // Store the texture object

  // Create a renderbuffer object and Set its size and parameters
  depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
  
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
  gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT);

  // Attach the texture and the renderbuffer object to the FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D( gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);

  const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  return framebuffer;
}
function draw(gl, canvas, [fbo1,fbo2], [sphere,cube,plane], angle, texture, viewProjMatrix, viewProjMatrixFBO, viewProjMatrixFBO2) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2); // Change the drawing destination to FBO
  gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT); // Set a viewport for FBO

  gl.clearColor(0.2, 1.0, 0.8, 1.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO

  drawTexture(gl, gl.program, sphere, angle, texture, viewProjMatrixFBO2); // Draw the cube

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1); // Change the drawing destination to FBO
  gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT); // Set a viewport for FBO

  gl.clearColor(0.5, 1.0, 0.5, 1.0); // Set clear color (the color is slightly changed)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO

  drawTexture(gl, gl.program, cube, -angle, fbo2.texture, viewProjMatrixFBO); // Draw the cube

  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Change the drawing destination to color buffer
  gl.viewport(0, 0, canvas.width, canvas.height); // Set the size of viewport back to that of <canvas>

  gl.clearColor(0.8, 1.0, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color buffer

  drawTexture(gl, gl.program, cube, angle, fbo1.texture, viewProjMatrix); // Draw the plane
}

// Coordinate transformation matrix

function drawTexture(gl, program, o, angle, texture, viewProjMatrix) {
  mat4.rotate(g_modelMatrix, mat4.create(), angle, [0, 1, 0]);
  g_mvpMatrix = getMvpMatrix(viewProjMatrix, g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix);
  drawTexturedObject(gl, program, o, texture);
}

function drawTexturedObject(gl, program, o, texture) {
  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer); // Texture coordinates

  // Bind the texture object to the target
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
}

// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now(); // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle;
}
