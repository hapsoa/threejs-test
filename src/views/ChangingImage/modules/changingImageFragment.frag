// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

uniform float time;
uniform sampler2D summerTexture;
uniform sampler2D autumnTexture;
uniform sampler2D rippleNormalMapTexture;
uniform sampler2D heightMapTexture;

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
	vec4 summerColor = texture2D(summerTexture, vUv);
	vec4 autumnColor = texture2D(autumnTexture, vUv);
	
	if (beforeTextureNumber != afterTextureNumber) {
		vec2 filterChannelUv = vec2(vUv);

		vec4 movement = texture2D(rippleNormalMapTexture, filterChannelUv + vec2(0.0, time));
		filterChannelUv.x += (movement.x * 0.1 - 0.05); 
		filterChannelUv.y += (movement.y * 0.1 - 0.05);

		// heightMap은 가만히 있는다.
		vec4 heightMapColor = texture2D(heightMapTexture, filterChannelUv);

		// 0 ~ 1 사이 변화비율
		// float changingRatio = max(min(heightMapColor.r * 2.0 - 1.0, 1.0), 0.0);
		float changingRatio = max(min((heightMapColor.r + heightMapColor.r + heightMapColor.r) * 0.3333 * 2.0 - 1.0
			+ (0.5 - changingTime/totalChangingTime) * 3.0, 1.0), 0.0);
		if (beforeTextureNumber == 1 && afterTextureNumber == 2) {
			gl_FragColor = summerColor * (1.0 - changingRatio) + autumnColor * changingRatio;
			// gl_FragColor = vec4(changingRatio, changingRatio, changingRatio, 1.0);
		} 
		else if (beforeTextureNumber == 2 && afterTextureNumber == 1) {
			gl_FragColor = autumnColor * (1.0 - changingRatio) + summerColor * changingRatio;
			// gl_FragColor = vec4(changingRatio, changingRatio, changingRatio, 1.0);
		} 
	}
	else if (beforeTextureNumber == 1 && afterTextureNumber == 1) {
		gl_FragColor = summerColor;
	} 
	else if (beforeTextureNumber == 2 && afterTextureNumber == 2) {
		gl_FragColor = autumnColor;
	}
}