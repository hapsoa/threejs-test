// float와 int의 메모리를 한정시킨다.(ex. float를 메모리를 더 작게 만든다던지)
precision mediump float;
precision mediump int;

// static같은 같은 메모리 영역을 보는것
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional

uniform float time;
uniform float segmentWidth;

// cpu에서 gpu로 넘어오는 변수다.
// addAttribute(attribute, number)인 number마다 가져온다.
// 3개씩 가져온다.
attribute vec3 position;
// 4개씩 가져온다.
attribute vec4 color;
// (vertexOrder, radius, radian)
attribute vec4 radianPosition;

// vertex => fragment로 넘길때 사용하는 변수
varying vec3 vPosition;
varying vec4 vColor;

void main()	{
  int vertexOrder = int(radianPosition.x);
  float radius = radianPosition.y;
  float radian = radianPosition.z;
  float zPositionTheta= radianPosition.w;

  // a % b
  // a - (b * floor(a/b))

  // TODO if => #if #endif 로 바꿔야 한다.
  // TODO '%'나 '/' r기호를 없애야 한다.
  float modulused = float(vertexOrder) - (3.0 * floor(float(vertexOrder) * 0.3333333333));
  float tick = time * 0.01;
  float accelerateVelocity = (sin(tick * 0.4 + radian * radius * zPositionTheta) + 1.0) * 2.0 + 1.0; // 0.01 ~ 0.1 사이였음 한다.
  // 가속도를 만들어야 한다.
  float newRadian = (radian + tick)+ accelerateVelocity * radius * 0.1 ;
  float zPososition = sin((zPositionTheta * radius * radian) * 0.01 + tick) * 30.0;
  // float zPososition = 0.0;

  if (modulused < 0.9) {
    // 속도가 빨라졌다 느려졌다 하려면 마찬가지로 sin을 돌리는게 좋지 않을까 한데
    vPosition = vec3(radius * cos(newRadian), radius * sin(newRadian), zPososition);
  } 
  else if (modulused < 1.9) {
    vPosition = vec3(radius * cos(newRadian) + segmentWidth, radius * sin(newRadian), zPososition);
  } else {
    vPosition = vec3(radius * cos(newRadian), radius * sin(newRadian) + segmentWidth, zPososition);
  }
  // vPosition = position;
  vColor = color;

  vec3 pos = vec3(vPosition);
  // pos.z = sin(pos.x * 0.1 + tanValue * 0.05);

  // matrix는 이동, 크기, 회전을 할 수 있도록 한다.
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}