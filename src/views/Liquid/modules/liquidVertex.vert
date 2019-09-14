// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

// static같은 같은 메모리 영역을 보는것
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional
uniform float time;

// cpu에서 gpu로 넘어오는 변수다.
// addAttribute(attribute, number)인 number마다 가져온다.
// 3개씩 가져온다.
attribute vec3 position;
attribute vec4 color;
attribute vec2 uv; // 텍스처를 맵핑하는 좌표 위치이다.

// vertex => fragment로 넘길때 사용하는 변수
varying vec3 vPosition;
varying vec4 vColor;
varying float vTime;
varying vec2 vUv;


void main()	{
  vPosition = position;
  vColor = color;
  vTime = time;
  vUv = uv;
  

  // matrix는 이동, 크기, 회전을 할 수 있도록 한다.
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}