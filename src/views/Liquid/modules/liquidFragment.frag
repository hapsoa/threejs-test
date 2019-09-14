// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

uniform float time;
uniform sampler2D summerTexture;
uniform sampler2D autumnTexture;
uniform sampler2D rippleTexture;

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
	// uv에다 rippleTexture를 씌운 rgba를 만든다.
	vec4 movement = texture2D(rippleTexture, uv + vec2(0, time));
	// 색상을 uv x좌표 y좌표에다 넣는다.
	uv.x += movement.x * 0.1;
	uv.y += movement.z * 0.1;
	vec4 summerColor = texture2D(summerTexture, uv);

	gl_FragColor = summerColor;
	// gl_FragColor = texture2D(summerTexture, vUv);

}