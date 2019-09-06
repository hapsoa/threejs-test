// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

uniform float time;
uniform float sinn;

// vertex에서 받아쓰는 변수
varying vec3 vPosition;
varying vec4 vColor;

void main()	{
	// 예제 코드
	// vec4 color = vec4( vColor );
	// color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
	// gl_FragColor = color;


	vec4 color = vec4( vColor );
	gl_FragColor = color;

	// 픽셀 수만큼 도는것
	// gl_FragColor = vec4(1, 1, 1, 1);
}