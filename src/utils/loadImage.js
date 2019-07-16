/* eslint-env browser */
export default function loadImage (url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      resolve(img)
    }
    img.onerror = function () {
      const msg = 'Image load error: ' + url
      reject(new Error(msg))
    }
    img.src = url
    return img
  })
}
