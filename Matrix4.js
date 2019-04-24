export class Matrix4 {
  constructor (array) {
    this.array = new Float32Array(array)
  }
  rotate () {

  }
  rotateZ (angle) {
    this.array = cross(this.array, getRotateZ(angle))
  }
  rotateY (angle) {
    this.array = cross(this.array, getRotateY(angle))
  }
  rotateX (angle) {
    this.array = cross(this.array, getRotateX(angle))
  }
}
export function cross (array1, array2) {
  return new Float32Array([
    array1[0] * array2[0] + array1[4] * array2[1] + array1[8] * array2[2] + array1[12] * array2[3],
    array1[1] * array2[0] + array1[5] * array2[1] + array1[9] * array2[2] + array1[13] * array2[3],
    array1[2] * array2[0] + array1[6] * array2[1] + array1[10] * array2[2] + array1[14] * array2[3],
    array1[3] * array2[0] + array1[7] * array2[1] + array1[11] * array2[2] + array1[15] * array2[3],
    array1[0] * array2[4] + array1[4] * array2[5] + array1[8] * array2[6] + array1[12] * array2[7],
    array1[1] * array2[4] + array1[5] * array2[5] + array1[9] * array2[6] + array1[13] * array2[7],
    array1[2] * array2[4] + array1[6] * array2[5] + array1[10] * array2[6] + array1[14] * array2[7],
    array1[3] * array2[4] + array1[7] * array2[5] + array1[11] * array2[6] + array1[15] * array2[7],
    array1[0] * array2[8] + array1[4] * array2[9] + array1[8] * array2[10] + array1[12] * array2[11],
    array1[1] * array2[8] + array1[5] * array2[9] + array1[9] * array2[10] + array1[13] * array2[11],
    array1[2] * array2[8] + array1[6] * array2[9] + array1[10] * array2[10] + array1[14] * array2[11],
    array1[3] * array2[8] + array1[7] * array2[9] + array1[11] * array2[10] + array1[15] * array2[11],
    array1[0] * array2[12] + array1[4] * array2[13] + array1[8] * array2[14] + array1[12] * array2[15],
    array1[1] * array2[12] + array1[5] * array2[13] + array1[9] * array2[14] + array1[13] * array2[15],
    array1[2] * array2[12] + array1[6] * array2[13] + array1[10] * array2[14] + array1[14] * array2[15],
    array1[3] * array2[12] + array1[7] * array2[13] + array1[11] * array2[14] + array1[15] * array2[15]
  ])
}
export function getRotateX (angle) {
  return new Float32Array([
    1, 0, 0, 0,
    0, Math.cos(angle), -Math.sin(angle), 0,
    0, Math.sin(angle), Math.cos(angle), 0,
    0, 0, 0, 1
  ])
}
export function getRotateY (angle) {
  return new Float32Array([
    Math.cos(angle), 0, -Math.sin(angle), 0,
    0, 1, 0, 0,
    Math.sin(angle), 0, Math.cos(angle), 0,
    0, 0, 0, 1
  ])
}
export function getRotateZ (angle) {
  return new Float32Array([
    Math.cos(angle), -Math.sin(angle), 0, 0,
    Math.sin(angle), Math.cos(angle), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])
}
