import {mat4, initShaders, initArrayBuffer, getMvpMatrix} from './utils/index.js'

const VSHADER_SOURCE =`
  attribute vec4 a_Position; 
  attribute vec4 a_Normal; 
  uniform mat4 u_MvpMatrix; 
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color; 
  varying vec3 v_Normal; 
  varying vec3 v_Position; 
  void main() { 
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    gl_Position = u_MvpMatrix * a_Position; 
    v_Position = vec3(u_ModelMatrix * a_Position); 
    v_Normal = normalize(vec3(u_ModelMatrix * a_Normal)); 
    v_Color = color;  
  }
`
  
const FSHADER_SOURCE =`
  precision mediump float; 
  uniform vec3 u_LightColor;
  uniform vec3 u_LightPosition;
  uniform vec3 u_EyePosition;
  uniform vec3 u_AmbientLight;
  varying vec3 v_Normal; 
  varying vec3 v_Position; 
  varying vec4 v_Color; 
  void main() { 
    vec3 normal = normalize(v_Normal); 
    vec3 lightDirection = normalize(v_Position - u_LightPosition);
    vec3 ambient = u_AmbientLight * v_Color.rgb; 
    
    vec3 reflectDirection = reflect(lightDirection, normal);
    vec3 viewDirection = normalize(u_EyePosition - v_Position);
    float angle = acos(dot(viewDirection, reflectDirection));

    float nDotL = max(exp(-angle*angle) , 0.0); 
    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;

    gl_FragColor = vec4(diffuse,v_Color.a);
    return;
  }
`
  
const canvas = document.getElementById('webgl');
const gl = canvas.getContext('webgl');

initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
const n = initVertexBuffers(gl);

gl.clearColor(0.0, 0.0, 0.5, 1.0);
gl.enable(gl.DEPTH_TEST);

const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
const u_EyePosition = gl.getUniformLocation(gl.program,'u_EyePosition');
const eyePosition = [0,0,4]

gl.uniform3f(u_LightColor, 0.8, 0.8, 0.8);
gl.uniform3f(u_LightPosition, 0, 0, 5);
gl.uniform3f(u_AmbientLight, 0.1, 0.2, 0.3);


const modelMatrix = mat4.create();  // Model matrix
const mvpMatrix = mat4.create();    // Model view projection matrix
const normalMatrix = mat4.create(); // Transformation matrix for normals
const viewMatrix = mat4.create();
const perspectiveMatrix = mat4.create();

mat4.perspective(perspectiveMatrix,0.2*Math.PI,canvas.width/canvas.height,0.1,1000)

mat4.lookAt(viewMatrix,eyePosition,[0,0,0],[0,1,0]);
mat4.multiply(mvpMatrix,perspectiveMatrix,viewMatrix);

gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);

draw()
  
function draw(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // mat4.rotate(modelMatrix,modelMatrix,Math.PI/180,[1,1,0]);
  moveEye(eyePosition,Math.PI/180);
  gl.uniform3fv(u_EyePosition,eyePosition);
  gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, getMvpMatrix(mvpMatrix,modelMatrix,viewMatrix,perspectiveMatrix));
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(draw);
}
function moveEye(eye,angle){
  let x  = eye[0];
  let y  = eye[1];
  let z  = eye[2];

  eye[0] = x*Math.cos(angle)+z*Math.sin(angle);
  eye[1] = eye[1];
  eye[2] = -x*Math.sin(angle)+z*Math.cos(angle);
}


function initVertexBuffers(gl) {
  const SPHERE_DIV = 100;

  let i, ai, si, ci;
  let j, aj, sj, cj;
  let p1, p2;

  const positions = [];
  const indices = [];

  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = i * 2 * Math.PI / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj);  // X
      positions.push(cj);       // Y
      positions.push(ci * sj);  // Z
    }
  }

  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV+1) + i;
      p2 = p1 + (SPHERE_DIV+1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }

  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;
  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return indices.length;
}

