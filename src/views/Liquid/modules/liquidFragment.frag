// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

uniform float time;
uniform sampler2D texture1;
uniform sampler2D summerTexture;
uniform sampler2D autumnTexture;

// vertex에서 받아쓰는 변수
varying vec3 vPosition;
varying vec4 vColor;
varying float vTime;
varying vec2 vUv;


void main()	{
	// vec4 color = vec4( vColor );
	// color.r = 0.0;
	// gl_FragColor = color;

	vec2 uv = vec2(vUv);
	vec4 movement = texture2D(summerTexture, uv + vec2(0, time));

	gl_FragColor = movement;
	// gl_FragColor = texture2D(summerTexture, vUv);

}