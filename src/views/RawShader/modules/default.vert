// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

// static같은 같은 메모리 영역을 보는것
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional

uniform float sinn;
uniform float time;

// cpu에서 gpu로 넘어오는 변수다.
// addAttribute(attribute, number)인 number마다 가져온다.
// 3개씩 가져온다.
attribute vec3 position;
// 4개씩 가져온다.
attribute vec4 color;

// vertex => fragment로 넘길때 사용하는 변수
varying vec3 vPosition;
varying vec4 vColor;

void main()	{
  vPosition = position;
  vColor = color;

  // 중점을 선언한다
  vec3 center = vec3(0, 0, 0);
  
  // 반지름을 계산한다.
  float radius = length(position);

  // 현재 각도를 계산한다.
  // atan함수가 없기 때문에, 

  vec3 pos = vec3(position);
  pos.z = sin(pos.x * 0.1 + time * 0.05);

  // matrix는 이동, 크기, 회전을 할 수 있도록 한다.
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}