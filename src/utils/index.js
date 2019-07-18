import * as mat4 from './mat4.js'
import initShaders from './initShaders.js'
import initTextures from './initTexture.js'


function getMvpMatrix(perspectiveMatrix,viewMatrix, modelMatrix  ){
  let tempMatrix = mat4.create()
  mat4.multiply(tempMatrix, perspectiveMatrix, viewMatrix);
  if(modelMatrix){
    mat4.multiply(tempMatrix,tempMatrix,modelMatrix);
  }
  return tempMatrix;
}
function initArrayBuffer(gl, attribute, data, type, num) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
  return true;
}
function initVertexBuffers(gl, model) {
  const positions = new Float32Array(model.positions);
  const normals = new Float32Array(model.normals);
  const texCoords = new Float32Array(model.texCoords);
  const indices = new Uint16Array(model.indices);
  if (!initArrayBuffer(gl, 'a_Position', positions, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3))  return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', texCoords, gl.FLOAT,2)) return -1;
  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
export {mat4, initShaders, initTextures, getMvpMatrix, initArrayBuffer, initVertexBuffers}