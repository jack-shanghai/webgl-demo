/**
 * 检测webgl支持情况
 * @param {*} canvas
 */
export default function checkWebGL(canvas) {
    const contexts = ['webgl2', 'webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'], gl;
    for(let i = 0; i < contexts.length; i++) {
        try {
            gl = canvas.getContext(contexts[i]);
        } catch(e) {}

        if(gl) {
            break;
        }
    }
    if(!gl) {
        console.info('WebGL is not supported');
    }
    return gl;
};