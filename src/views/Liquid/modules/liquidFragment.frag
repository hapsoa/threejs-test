// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

uniform float time;
uniform sampler2D summerTexture;
uniform sampler2D autumnTexture;
uniform sampler2D rippleNormalMapTexture;
uniform int changingTime; // 1이면 변화중, 0이면 변화 하지 않는다.
uniform float currentTextureNumber; // 0, 1


// vertex에서 받아쓰는 변수
varying vec3 vPosition;
varying vec4 vColor;
varying float vTime;
varying vec2 vUv;


void main()	{
	vec2 uv = vec2(vUv);
	// uv에다 rippleNormalMapTexture를 씌운 rgba를 만든다.
	// rippleNormalMapTexture를 uv좌표 기준 살짝 위의 색상을 가져온다.
	vec4 movement = texture2D(rippleNormalMapTexture, uv + vec2(0, time));
	// rippleNormalMapTexture의 색상을 더한다.
	uv.x += (movement.x * 0.05 - 0.025) * float(changingTime); // 물결 texture(살짝 위)의 normalVector색상을 uv좌표에다 더한다. => 그만큼 각 픽셀마다 꺾인 표현이 가능하다.
	uv.y += (movement.y * 0.05 - 0.025) * float(changingTime);
	vec4 summerColor = texture2D(summerTexture, uv);
	vec4 autumnColor = texture2D(autumnTexture, uv);

	gl_FragColor = summerColor * (currentTextureNumber - 1.0) + autumnColor * (currentTextureNumber - 2.0);
	// gl_FragColor = autumnColor;
	// gl_FragColor = texture2D(summerTexture, vUv);
	
}