import * as mat4 from './mat4.js'
import initShaders from './initShaders.js'
import initTextures from './initTexture.js'


function getMvpMatrix(mvpMatrix, modelMatrix, viewMatrix, perspectiveMatrix){
  let tempMatrix = mat4.create()
  mat4.multiply(tempMatrix, perspectiveMatrix, viewMatrix)
  mat4.multiply(mvpMatrix,tempMatrix,modelMatrix)
  return mvpMatrix
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
export {mat4, initShaders, initTextures, getMvpMatrix, initArrayBuffer}