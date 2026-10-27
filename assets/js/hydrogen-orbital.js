(function () {
  "use strict";

  var PARTICLE_COUNT = 40000;
  var ROTATION_SPEED = 1.76 * Math.PI / 180;
  var SPECTROSCOPIC = ["s", "p", "d", "f", "g", "h", "i", "k"];
  var PALETTE = [
    [0.12, 0.43, 1.0],
    [1.0, 0.13, 0.27],
    [0.0, 0.72, 0.38],
    [0.58, 0.24, 0.98],
    [1.0, 0.34, 0.06]
  ];

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function factorial(value) {
    var result = 1n;

    for (var index = 2; index <= value; index += 1) {
      result *= BigInt(index);
    }

    return result;
  }

  function greatestCommonDivisor(first, second) {
    first = first < 0n ? -first : first;
    second = second < 0n ? -second : second;

    while (second) {
      var remainder = first % second;
      first = second;
      second = remainder;
    }

    return first || 1n;
  }

  function reduceFraction(numerator, denominator) {
    var divisor = greatestCommonDivisor(numerator, denominator);
    return [numerator / divisor, denominator / divisor];
  }

  function binomial(n, k) {
    if (k < 0 || k > n) {
      return 0n;
    }

    k = Math.min(k, n - k);
    var result = 1n;

    for (var index = 1; index <= k; index += 1) {
      result = result * BigInt(n - k + index) / BigInt(index);
    }

    return result;
  }

  function powerOfTwo(exponent) {
    return 1n << BigInt(exponent);
  }

  function variablePower(variable, exponent) {
    if (!exponent) {
      return "";
    }

    if (variable === "cos") {
      return exponent === 1 ? "\\cos\\theta" : "\\cos^{" + exponent + "}\\theta";
    }

    return exponent === 1 ? "\\rho" : "\\rho^{" + exponent + "}";
  }

  function polynomialTex(terms, variable) {
    var output = "";

    terms.forEach(function (term, index) {
      var numerator = term.numerator;
      var denominator = term.denominator;
      var negative = numerator < 0n;
      var absoluteNumerator = negative ? -numerator : numerator;
      var reduced = reduceFraction(absoluteNumerator, denominator);
      absoluteNumerator = reduced[0];
      denominator = reduced[1];
      var power = variablePower(variable, term.exponent);
      var omitCoefficient = term.exponent > 0 && absoluteNumerator === 1n && denominator === 1n;
      var coefficient = "";

      if (!omitCoefficient) {
        coefficient = denominator === 1n ? String(absoluteNumerator) : "\\frac{" + absoluteNumerator + "}{" + denominator + "}";
      }

      var sign = negative ? "-" : index === 0 ? "" : "+";

      if (!negative && index > 0) {
        sign = "+";
      }

      output += sign + coefficient + power;
    });

    return terms.length > 1 || output.charAt(0) === "-" ? "\\left(" + output + "\\right)" : output;
  }

  function radialPolynomialTex(n, l) {
    var order = n - l - 1;
    var alpha = 2 * l + 1;
    var terms = [];

    for (var exponent = order; exponent >= 0; exponent -= 1) {
      var numerator = binomial(order + alpha, order - exponent);

      if (exponent % 2) {
        numerator = -numerator;
      }

      terms.push({
        numerator: numerator,
        denominator: factorial(exponent),
        exponent: exponent
      });
    }

    return polynomialTex(terms, "rho");
  }

  function angularPolynomialTex(l, absoluteM) {
    var terms = [];
    var maximumIndex = Math.floor((l - absoluteM) / 2);

    for (var index = 0; index <= maximumIndex; index += 1) {
      var exponent = l - absoluteM - 2 * index;
      var numerator = factorial(2 * l - 2 * index);
      var denominator = powerOfTwo(l) * factorial(index) * factorial(l - index) * factorial(exponent);

      if ((absoluteM + index) % 2) {
        numerator = -numerator;
      }

      terms.push({
        numerator: numerator,
        denominator: denominator,
        exponent: exponent
      });
    }

    return polynomialTex(terms, "cos");
  }

  function wavefunctionTex(n, l, m) {
    var absoluteM = Math.abs(m);
    var radialOrder = n - l - 1;
    var numerator = factorial(radialOrder) * BigInt(2 * l + 1);
    var denominator = factorial(n + l);

    if (absoluteM) {
      numerator *= 2n * factorial(l - absoluteM);
      denominator *= factorial(l + absoluteM);
    }

    var reduced = reduceFraction(numerator, denominator);
    var radical = reduced[1] === 1n
      ? "\\sqrt{\\frac{" + reduced[0] + "}{\\pi}}"
      : "\\sqrt{\\frac{" + reduced[0] + "}{" + reduced[1] + "\\pi}}";
    var normalisationDenominator = (n * n === 1 ? "" : n * n) + "a_0^{3/2}";
    var normalisation = "\\frac{1}{" + normalisationDenominator + "}" + radical;
    var radialPower = variablePower("rho", l);
    var radialPolynomial = radialPolynomialTex(n, l);
    var angularPower = absoluteM === 0 ? "" : absoluteM === 1 ? "\\sin\\theta" : "\\sin^{" + absoluteM + "}\\theta";
    var angularPolynomial = angularPolynomialTex(l, absoluteM);
    var azimuthal = m > 0 ? "\\cos(" + absoluteM + "\\phi)" : m < 0 ? "\\sin(" + absoluteM + "\\phi)" : "";
    var magnetic = m < 0 ? "-" + absoluteM : String(m);
    var rhoNumerator = n % 2 === 0 ? 1 : 2;
    var rhoDenominator = n % 2 === 0 ? n / 2 : n;
    var rhoTex = rhoDenominator === 1
      ? rhoNumerator === 1 ? "\\frac{r}{a_0}" : "\\frac{" + rhoNumerator + "r}{a_0}"
      : rhoNumerator === 1 ? "\\frac{r}{" + rhoDenominator + "a_0}" : "\\frac{" + rhoNumerator + "r}{" + rhoDenominator + "a_0}";
    var radialExpression = "\\left(" + rhoTex + "\\right)";
    var exponentialDenominator = n === 1 ? "a_0" : n + "a_0";
    radialPower = radialPower.replace(/\\rho/g, radialExpression);
    radialPolynomial = radialPolynomial.replace(/\\rho/g, radialExpression);
    var factors = [normalisation, "e^{-\\frac{r}{" + exponentialDenominator + "}}", radialPower, radialPolynomial, angularPolynomial, angularPower, azimuthal].filter(function (factor) {
      return factor && factor !== "1";
    }).join("\\,");
    return "\\psi_{" + n + "," + l + "," + magnetic + "}(r,\\theta,\\phi)=" + factors;
  }

  function randomGenerator(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6d2b79f5 | 0;
      var value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function generalizedLaguerre(order, alpha, value) {
    if (order === 0) {
      return 1;
    }

    if (order === 1) {
      return 1 + alpha - value;
    }

    var previous = 1;
    var current = 1 + alpha - value;

    for (var index = 2; index <= order; index += 1) {
      var next = ((2 * index - 1 + alpha - value) * current - (index - 1 + alpha) * previous) / index;
      previous = current;
      current = next;
    }

    return current;
  }

  function associatedLegendre(degree, order, value) {
    var result = 1;

    if (order > 0) {
      var root = Math.sqrt(Math.max(0, (1 - value) * (1 + value)));
      var factor = 1;

      for (var index = 1; index <= order; index += 1) {
        result *= -factor * root;
        factor += 2;
      }
    }

    if (degree === order) {
      return result;
    }

    var next = value * (2 * order + 1) * result;

    if (degree === order + 1) {
      return next;
    }

    for (var level = order + 2; level <= degree; level += 1) {
      var current = ((2 * level - 1) * value * next - (level + order - 1) * result) / (level - order);
      result = next;
      next = current;
    }

    return next;
  }

  function angularAmplitude(l, m, cosineTheta, phi) {
    var absoluteM = Math.abs(m);
    var polar = associatedLegendre(l, absoluteM, cosineTheta);

    if (m > 0) {
      return polar * Math.cos(absoluteM * phi);
    }

    if (m < 0) {
      return polar * Math.sin(absoluteM * phi);
    }

    return polar;
  }

  function radialDensity(n, l, radius) {
    var scaledRadius = 2 * radius / n;
    var polynomial = generalizedLaguerre(n - l - 1, 2 * l + 1, scaledRadius);
    return radius * radius * Math.exp(-scaledRadius) * Math.pow(scaledRadius, 2 * l) * polynomial * polynomial;
  }

  function buildRadialDistribution(n, l) {
    var steps = 8192;
    var maximumRadius = Math.max(12, 6 * n * n);
    var increment = maximumRadius / steps;
    var cumulative = new Float64Array(steps + 1);
    var previousDensity = radialDensity(n, l, 0);
    var total = 0;

    for (var index = 1; index <= steps; index += 1) {
      var density = radialDensity(n, l, index * increment);
      total += (previousDensity + density) * increment * 0.5;
      cumulative[index] = total;
      previousDensity = density;
    }

    for (var normaliseIndex = 1; normaliseIndex <= steps; normaliseIndex += 1) {
      cumulative[normaliseIndex] /= total;
    }

    return {
      cumulative: cumulative,
      maximumRadius: maximumRadius
    };
  }

  function findRadialNodes(n, l, maximumRadius) {
    var count = n - l - 1;

    if (!count) {
      return [];
    }

    var nodes = [];
    var steps = 16384;
    var order = count;
    var alpha = 2 * l + 1;
    var previousRadius = 0;
    var previousValue = generalizedLaguerre(order, alpha, 0);

    for (var index = 1; index <= steps && nodes.length < count; index += 1) {
      var radius = maximumRadius * index / steps;
      var value = generalizedLaguerre(order, alpha, 2 * radius / n);

      if (Math.abs(value) < 1e-10) {
        nodes.push(radius);
      } else if (Math.abs(previousValue) >= 1e-10 && value * previousValue < 0) {
        var lower = previousRadius;
        var upper = radius;
        var lowerValue = previousValue;

        for (var iteration = 0; iteration < 32; iteration += 1) {
          var middle = (lower + upper) * 0.5;
          var middleValue = generalizedLaguerre(order, alpha, 2 * middle / n);

          if (middleValue * lowerValue <= 0) {
            upper = middle;
          } else {
            lower = middle;
            lowerValue = middleValue;
          }
        }

        nodes.push((lower + upper) * 0.5);
      }

      previousRadius = radius;
      previousValue = value;
    }

    return nodes;
  }

  function sampleCumulative(distribution, random) {
    var cumulative = distribution.cumulative;
    var target = random();
    var lower = 0;
    var upper = cumulative.length - 1;

    while (upper - lower > 1) {
      var middle = lower + upper >>> 1;

      if (cumulative[middle] < target) {
        lower = middle;
      } else {
        upper = middle;
      }
    }

    var lowerValue = cumulative[lower];
    var upperValue = cumulative[upper];
    var fraction = upperValue === lowerValue ? 0 : (target - lowerValue) / (upperValue - lowerValue);
    return (lower + fraction) * distribution.maximumRadius / (cumulative.length - 1);
  }

  function maximumAngularDensity(l, m) {
    var maximum = 0;

    for (var latitude = 0; latitude <= 180; latitude += 1) {
      var cosineTheta = -1 + 2 * latitude / 180;

      for (var longitude = 0; longitude < 256; longitude += 1) {
        var phi = 2 * Math.PI * longitude / 256;
        var amplitude = angularAmplitude(l, m, cosineTheta, phi);
        maximum = Math.max(maximum, amplitude * amplitude);
      }
    }

    return maximum * 1.015;
  }

  function radialRegion(radius, nodes) {
    var region = 0;

    while (region < nodes.length && radius > nodes[region]) {
      region += 1;
    }

    return region;
  }

  function generateCloud(n, l, m) {
    var seed = (n * 73856093 ^ l * 19349663 ^ (m + 8) * 83492791) >>> 0;
    var random = randomGenerator(seed);
    var distribution = buildRadialDistribution(n, l);
    var nodes = findRadialNodes(n, l, distribution.maximumRadius);
    var angularMaximum = maximumAngularDensity(l, m);
    var positions = new Float32Array((PARTICLE_COUNT + 1) * 3);
    var colours = new Float32Array((PARTICLE_COUNT + 1) * 3);
    var radii = new Float64Array(PARTICLE_COUNT);

    for (var index = 0; index < PARTICLE_COUNT; index += 1) {
      var radius = sampleCumulative(distribution, random);
      var cosineTheta;
      var phi;
      var density;

      do {
        cosineTheta = random() * 2 - 1;
        phi = random() * 2 * Math.PI;
        var amplitude = angularAmplitude(l, m, cosineTheta, phi);
        density = amplitude * amplitude;
      } while (random() * angularMaximum > density);

      var sineTheta = Math.sqrt(Math.max(0, 1 - cosineTheta * cosineTheta));
      var positionOffset = index * 3;
      positions[positionOffset] = radius * sineTheta * Math.cos(phi);
      positions[positionOffset + 1] = radius * sineTheta * Math.sin(phi);
      positions[positionOffset + 2] = radius * cosineTheta;
      radii[index] = radius;

      var colour = PALETTE[radialRegion(radius, nodes) % PALETTE.length];
      colours[positionOffset] = colour[0];
      colours[positionOffset + 1] = colour[1];
      colours[positionOffset + 2] = colour[2];
    }

    var sortedRadii = Array.prototype.slice.call(radii).sort(function (first, second) {
      return first - second;
    });
    var frameRadius = sortedRadii[Math.floor(PARTICLE_COUNT * 0.997)] || 1;
    var scale = 1 / (frameRadius * 1.07);

    for (var positionIndex = 0; positionIndex < PARTICLE_COUNT * 3; positionIndex += 1) {
      positions[positionIndex] *= scale;
    }

    var nucleusOffset = PARTICLE_COUNT * 3;
    positions[nucleusOffset] = 0;
    positions[nucleusOffset + 1] = 0;
    positions[nucleusOffset + 2] = 0;
    colours[nucleusOffset] = 1;
    colours[nucleusOffset + 1] = 0.71;
    colours[nucleusOffset + 2] = 0.28;

    return {
      positions: positions,
      colours: colours
    };
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  function createProgram(gl) {
    var vertexSource = [
      "attribute vec3 aPosition;",
      "attribute vec3 aColour;",
      "uniform float uYaw;",
      "uniform float uPitch;",
      "uniform float uZoom;",
      "uniform vec2 uPan;",
      "uniform float uAspect;",
      "uniform float uPointSize;",
      "varying vec3 vColour;",
      "void main() {",
      "  float cy = cos(uYaw);",
      "  float sy = sin(uYaw);",
      "  float cp = cos(uPitch);",
      "  float sp = sin(uPitch);",
      "  vec3 point = vec3(cy * aPosition.x + sy * aPosition.z, aPosition.y, -sy * aPosition.x + cy * aPosition.z);",
      "  point = vec3(point.x, cp * point.y - sp * point.z, sp * point.y + cp * point.z);",
      "  point.xy += uPan;",
      "  point.z -= 3.2 / uZoom;",
      "  float focal = 2.41421356;",
      "  float nearPlane = 0.1;",
      "  float farPlane = 10.0;",
      "  gl_Position = vec4(point.x * focal / uAspect, point.y * focal, ((farPlane + nearPlane) / (nearPlane - farPlane)) * point.z + (2.0 * farPlane * nearPlane / (nearPlane - farPlane)), -point.z);",
      "  gl_PointSize = uPointSize * (3.2 / max(1.5, -point.z));",
      "  vColour = aColour;",
      "}"
    ].join("\n");
    var fragmentSource = [
      "precision mediump float;",
      "uniform float uOpacity;",
      "varying vec3 vColour;",
      "void main() {",
      "  float radius = length(gl_PointCoord - vec2(0.5)) * 2.0;",
      "  if (radius > 1.0) discard;",
      "  float alpha = uOpacity * (1.0 - smoothstep(0.38, 1.0, radius));",
      "  gl_FragColor = vec4(vColour, alpha);",
      "}"
    ].join("\n");
    var program = gl.createProgram();
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    return program;
  }

  function createRenderer(canvas) {
    var gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      powerPreference: "high-performance"
    });

    if (!gl) {
      throw new Error("WebGL is unavailable in this browser.");
    }

    var program = createProgram(gl);
    var positionBuffer = gl.createBuffer();
    var colourBuffer = gl.createBuffer();
    var positionLocation = gl.getAttribLocation(program, "aPosition");
    var colourLocation = gl.getAttribLocation(program, "aColour");
    var uniforms = {
      yaw: gl.getUniformLocation(program, "uYaw"),
      pitch: gl.getUniformLocation(program, "uPitch"),
      zoom: gl.getUniformLocation(program, "uZoom"),
      pan: gl.getUniformLocation(program, "uPan"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      pointSize: gl.getUniformLocation(program, "uPointSize"),
      opacity: gl.getUniformLocation(program, "uOpacity")
    };
    var pointSize = 2;
    var aspect = 1;
    var hasCloud = false;

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
    gl.enableVertexAttribArray(colourLocation);
    gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 0, 0);

    function resize() {
      var rectangle = canvas.getBoundingClientRect();
      var pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      var width = Math.max(1, Math.round(rectangle.width * pixelRatio));
      var height = Math.max(1, Math.round(rectangle.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      aspect = width / height;
      pointSize = Math.min(4.8, 2.15 * pixelRatio);
    }

    function upload(cloud) {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cloud.positions, gl.STATIC_DRAW);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cloud.colours, gl.STATIC_DRAW);
      gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 0, 0);
      hasCloud = true;
    }

    function draw(yaw, pitch, zoom, panX, panY) {
      resize();
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!hasCloud) {
        return;
      }

      gl.useProgram(program);
      gl.uniform1f(uniforms.yaw, yaw);
      gl.uniform1f(uniforms.pitch, pitch);
      gl.uniform1f(uniforms.zoom, zoom);
      gl.uniform2f(uniforms.pan, panX, panY);
      gl.uniform1f(uniforms.aspect, aspect);
      gl.uniform1f(uniforms.pointSize, pointSize);
      gl.uniform1f(uniforms.opacity, 0.31);
      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
      gl.uniform1f(uniforms.pointSize, pointSize * 4.2);
      gl.uniform1f(uniforms.opacity, 0.95);
      gl.drawArrays(gl.POINTS, PARTICLE_COUNT, 1);
    }

    resize();

    return {
      draw: draw,
      resize: resize,
      upload: upload
    };
  }

  function initialise(root) {
    if (root.dataset.hydrogenInitialised === "true") {
      return;
    }

    root.dataset.hydrogenInitialised = "true";
    var viewport = root.querySelector(".hydrogen-viewport");
    var canvas = root.querySelector("canvas");
    var status = root.querySelector(".hydrogen-viewport__status");
    var state = root.querySelector(".hydrogen-viewport__state");
    var formula = root.querySelector(".hydrogen-formula__math");
    var nInput = root.querySelector('input[name="n"]');
    var lInput = root.querySelector('input[name="l"]');
    var mInput = root.querySelector('input[name="m"]');
    var renderer;

    nInput.value = 1;
    lInput.value = 0;
    mInput.value = 0;

    try {
      renderer = createRenderer(canvas);
    } catch (error) {
      viewport.classList.add("has-error");
      status.textContent = error.message;
      return;
    }

    var yaw = -0.55;
    var pitch = 0.32;
    var zoom = 1;
    var panX = 0;
    var panY = 0;
    var pointers = new Map();
    var lastPinchDistance = 0;
    var lastPinchCentre = null;
    var generationTimer = 0;
    var generationNumber = 0;
    var formulaTimer = 0;
    var formulaNumber = 0;
    var visible = true;
    var previousTime = performance.now();
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function readValues(force) {
      var n = Number(nInput.value);
      var l = Number(lInput.value);
      var m = Number(mInput.value);

      if ((!Number.isFinite(n) || !Number.isFinite(l) || !Number.isFinite(m)) && !force) {
        return null;
      }

      n = clamp(Math.round(Number.isFinite(n) ? n : 1), 1, 8);
      l = clamp(Math.round(Number.isFinite(l) ? l : 0), 0, n - 1);
      m = clamp(Math.round(Number.isFinite(m) ? m : 0), -l, l);
      nInput.value = n;
      lInput.max = n - 1;
      lInput.value = l;
      mInput.min = -l;
      mInput.max = l;
      mInput.value = m;

      root.querySelectorAll("[data-step]").forEach(function (button) {
        var input = button.closest(".hydrogen-number-field").querySelector("input");
        var value = Number(input.value);
        var limit = Number(button.dataset.step === "up" ? input.max : input.min);
        button.disabled = button.dataset.step === "up" ? value >= limit : value <= limit;
      });

      return { n: n, l: l, m: m };
    }

    function stateName(values) {
      return values.n + SPECTROSCOPIC[values.l];
    }

    function setState(values) {
      var magnetic = values.m < 0 ? "−" + Math.abs(values.m) : String(values.m);
      if (state) {
        state.innerHTML = stateName(values) + "<small>n = " + values.n + " · l = " + values.l + " · m = " + magnetic + "</small>";
      }
      canvas.setAttribute("aria-label", "Interactive three-dimensional probability cloud for the hydrogen " + stateName(values) + " orbital with m equal to " + values.m);

      if (formula) {
        formulaNumber += 1;
        var requestedFormula = formulaNumber;
        var formulaTex = wavefunctionTex(values.n, values.l, values.m);
        window.clearTimeout(formulaTimer);
        formulaTimer = window.setTimeout(function () {
          if (window.MathJax && window.MathJax.typesetPromise && formula.isConnected) {
            var staging = document.createElement("div");
            staging.className = "hydrogen-formula__staging";
            staging.textContent = "\\[" + formulaTex + "\\]";
            document.body.appendChild(staging);

            window.MathJax.typesetPromise([staging]).then(function () {
              if (requestedFormula !== formulaNumber || !formula.isConnected) {
                if (window.MathJax.typesetClear) {
                  window.MathJax.typesetClear([staging]);
                }

                staging.remove();
                return;
              }

              if (window.MathJax.typesetClear) {
                window.MathJax.typesetClear([formula]);
              }

              var renderedFormula = document.createDocumentFragment();

              while (staging.firstChild) {
                renderedFormula.appendChild(staging.firstChild);
              }

              formula.replaceChildren(renderedFormula);
              staging.remove();
            }).catch(function () {
              staging.remove();
            });
          }
        }, 120);
      }
    }

    function queueGeneration(values) {
      window.clearTimeout(generationTimer);
      generationNumber += 1;
      var requestedGeneration = generationNumber;
      viewport.classList.add("is-loading");
      viewport.classList.remove("has-error");
      status.textContent = "Generating 40,000 particles…";
      setState(values);

      generationTimer = window.setTimeout(function () {
        window.requestAnimationFrame(function () {
          try {
            var cloud = generateCloud(values.n, values.l, values.m);

            if (requestedGeneration !== generationNumber || !root.isConnected) {
              return;
            }

            renderer.upload(cloud);
            viewport.classList.remove("is-loading");
            status.textContent = "40,000 probability samples generated";
          } catch (error) {
            viewport.classList.remove("is-loading");
            viewport.classList.add("has-error");
            status.textContent = "The orbital could not be generated.";
          }
        });
      }, 90);
    }

    function inputHandler(event) {
      var values = readValues(event.type === "change");

      if (values) {
        queueGeneration(values);
      }
    }

    [nInput, lInput, mInput].forEach(function (input) {
      input.addEventListener("input", inputHandler);
      input.addEventListener("change", inputHandler);
    });

    root.querySelectorAll("[data-step]").forEach(function (button) {
      button.addEventListener("click", function () {
        var input = button.closest(".hydrogen-number-field").querySelector("input");

        if (button.dataset.step === "up") {
          input.stepUp();
        } else {
          input.stepDown();
        }

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      });
    });

    canvas.addEventListener("pointerdown", function (event) {
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      lastPinchDistance = 0;
      lastPinchCentre = null;
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!pointers.has(event.pointerId)) {
        return;
      }

      var previous = pointers.get(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size === 1) {
        yaw += (event.clientX - previous.x) * 0.008;
        pitch = clamp(pitch + (event.clientY - previous.y) * 0.008, -1.35, 1.35);
        return;
      }

      if (pointers.size === 2) {
        var points = Array.from(pointers.values());
        var distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        var centre = {
          x: (points[0].x + points[1].x) * 0.5,
          y: (points[0].y + points[1].y) * 0.5
        };

        if (lastPinchDistance) {
          zoom = clamp(zoom * distance / lastPinchDistance, 0.58, 2.5);
        }

        if (lastPinchCentre) {
          var panScale = 2.7 / (Math.max(1, canvas.clientHeight) * zoom);
          panX = clamp(panX + (centre.x - lastPinchCentre.x) * panScale, -1.4, 1.4);
          panY = clamp(panY - (centre.y - lastPinchCentre.y) * panScale, -1.4, 1.4);
        }

        lastPinchDistance = distance;
        lastPinchCentre = centre;
      }
    });

    function releasePointer(event) {
      pointers.delete(event.pointerId);
      lastPinchDistance = 0;
      lastPinchCentre = null;
    }

    canvas.addEventListener("pointerup", releasePointer);
    canvas.addEventListener("pointercancel", releasePointer);
    canvas.addEventListener("wheel", function (event) {
      event.preventDefault();
      zoom = clamp(zoom * Math.exp(-event.deltaY * 0.0012), 0.58, 2.5);
    }, { passive: false });

    canvas.addEventListener("keydown", function (event) {
      var handled = true;

      if (event.key === "ArrowLeft") {
        yaw -= 0.08;
      } else if (event.key === "ArrowRight") {
        yaw += 0.08;
      } else if (event.key === "ArrowUp") {
        pitch = clamp(pitch - 0.08, -1.35, 1.35);
      } else if (event.key === "ArrowDown") {
        pitch = clamp(pitch + 0.08, -1.35, 1.35);
      } else if (event.key === "+" || event.key === "=") {
        zoom = clamp(zoom * 1.1, 0.58, 2.5);
      } else if (event.key === "-" || event.key === "_") {
        zoom = clamp(zoom / 1.1, 0.58, 2.5);
      } else {
        handled = false;
      }

      if (handled) {
        event.preventDefault();
      }
    });

    if ("ResizeObserver" in window) {
      var resizeObserver = new ResizeObserver(function () {
        renderer.resize();
      });
      resizeObserver.observe(viewport);
    }

    if ("IntersectionObserver" in window) {
      var visibilityObserver = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { rootMargin: "120px" });
      visibilityObserver.observe(root);
    }

    function animate(time) {
      if (!root.isConnected) {
        return;
      }

      var elapsed = Math.min(0.1, (time - previousTime) / 1000);
      previousTime = time;

      if (visible) {
        if (!reducedMotion.matches && pointers.size === 0) {
          yaw += elapsed * ROTATION_SPEED;
        }

        renderer.draw(yaw, pitch, zoom, panX, panY);
      }

      window.requestAnimationFrame(animate);
    }

    queueGeneration(readValues(true));
    window.requestAnimationFrame(animate);
  }

  window.initHydrogenOrbital = function () {
    document.querySelectorAll("[data-hydrogen-orbital]").forEach(initialise);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initHydrogenOrbital);
  } else {
    window.initHydrogenOrbital();
  }
})();
