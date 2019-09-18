// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

uniform float time;
uniform sampler2D summerTexture;
uniform sampler2D autumnTexture;
uniform sampler2D rippleNormalMapTexture;


uniform float totalChangingTime;
uniform float changingTime;
uniform int beforeTextureNumber;
uniform int afterTextureNumber;


// vertex에서 받아쓰는 변수
varying vec3 vPosition;
varying vec4 vColor;
varying float vTime;
varying vec2 vUv;

void main()	{
	vec2 uv = vec2(vUv);
	
	if (beforeTextureNumber != afterTextureNumber) {
		// uv에다 rippleNormalMapTexture를 씌운 rgba를 만든다.
		// rippleNormalMapTexture를 uv좌표 기준 살짝 위의 색상을 가져온다.
		vec4 movement = texture2D(rippleNormalMapTexture, uv + vec2(0, time));
		// rippleNormalMapTexture의 색상을 더한다.
		uv.x += (movement.x * 0.05 - 0.025); // 물결 texture(살짝 위)의 normalVector색상을 uv좌표에다 더한다. => 그만큼 각 픽셀마다 꺾인 표현이 가능하다.
		uv.y += (movement.y * 0.05 - 0.025);
	}
	
	vec4 summerColor = texture2D(summerTexture, uv);
	vec4 autumnColor = texture2D(autumnTexture, uv);

	if (beforeTextureNumber == 1 && afterTextureNumber == 2) {
		gl_FragColor = sin(changingTime/totalChangingTime * 0.5 * 3.14) * summerColor
			+ cos(changingTime/totalChangingTime * 0.5 * 3.14) * autumnColor ;
	} 
	else if (beforeTextureNumber == 2 && afterTextureNumber == 1) {
		gl_FragColor = sin(changingTime/totalChangingTime * 0.5 * 3.14) * autumnColor
			+ cos(changingTime/totalChangingTime * 0.5 * 3.14) * summerColor;
	} 
	else if (beforeTextureNumber == 1 && afterTextureNumber == 1) {
		gl_FragColor = summerColor;
	} 
	else if (beforeTextureNumber == 2 && afterTextureNumber == 2) {
		gl_FragColor = autumnColor;
	}

	// gl_FragColor = summerColor;

	// gl_FragColor = summerColor * (currentTextureNumber - 1.0) + autumnColor * (currentTextureNumber - 2.0);
	// gl_FragColor = autumnColor;
	// gl_FragColor = texture2D(summerTexture, vUv);
	
}