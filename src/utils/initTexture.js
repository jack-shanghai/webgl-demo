import loadImage from './loadImage.js'
export default function initTextures (gl, urls) {
  const numberOfTexture = urls.length
  const promises = []
  for(let i = 0;i < numberOfTexture;i++){
    const texture = gl.createTexture()
    const samplerLoc = gl.getUniformLocation(gl.program, `uSampler${i}`)
    const promise = loadImage(urls[i]).then(
      (img) => {
        console.info(`img${i} loaded`);
        gl.activeTexture(gl[`TEXTURE${i}`]);
        loadTexture(gl, texture, samplerLoc, img, i);
        return texture;
      }
    )
    promises.push(promise)
  }
  return Promise.all(promises)
}
function loadTexture (gl, texture, uSampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.uniform1i(uSampler, texUnit)
  console.info(`textture ${texUnit} loaded`)
}