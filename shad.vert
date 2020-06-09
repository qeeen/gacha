precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;

void main(){
	vec4 pos = vec4(aPosition, 1.0);
	gl_Position = uProjectionMatrix * ((uModelViewMatrix*pos)*(vec4(1, 1, 0.2, 1) + vec4(0, 0, 1, 0)));
}
