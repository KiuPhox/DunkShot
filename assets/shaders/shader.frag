#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 fragCoord; 

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec4 blendSoftLight(vec4 base, vec4 blend) {
	return vec4(
        blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b), blendSoftLight(base.a, blend.a));
}

void main ()
{
    vec2 uv0 = fragCoord / resolution.xy;
    uv0.y *= -1.0;
    vec2 uv1 = (fragCoord * 2.0 - resolution.xy) / resolution.y * 0.6;
    uv1.y *= -1.0;
    float rotationAngle = radians(10.0);
    float cosAngle = cos(rotationAngle);
    float sinAngle = sin(rotationAngle);
    uv1 = vec2(
        uv1.x * cosAngle - uv1.y * sinAngle,
        uv1.x * sinAngle + uv1.y * cosAngle
    );

    uv1 -= vec2(-1, -2) * time * 0.5;


    vec4 baseColor = texture2D(iChannel0, uv0);
    vec4 texColor = texture2D(iChannel1, fract(uv1));


    gl_FragColor = blendSoftLight(baseColor, texColor);
}