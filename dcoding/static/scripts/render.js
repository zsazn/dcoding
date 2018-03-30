'use strict';

$('#answer-modal').modal('hide');

var svgWidth = document.getElementById('min-div').clientWidth - 1;
var svgHeight = svgWidth;
var aspectRatio = window.innerWidth / window.innerHeight;
var legendWidth = svgWidth;
var legendHeight = 80;
var margin = {'top': 10, 'bottom': 20, 'left': 10, 'right': 10};

const orderNum = 5;
const orders = [1, 2, 3, 4, 5];

const viewWidth = 600,
      viewHeight = 600,
      canvasSize = 600;

const frustumSize = 1000;

let colorScale = d3.scaleOrdinal(d3.schemeBlues[orderNum]).domain(orders);
let fillColor = colorScale(order(qVal));

const args = ['min', 'max', 'val'];
const strokeColor = '#ff0000';
const localStrokeColor = '#000000';
const strokeWidth = 1;

const orderLimits = new OrderLimits(qVal);
const minLocal = orderLimits.min();
const maxLocal = orderLimits.max();
const valLocal = qVal;


if (qDimension == 'length' || qDimension == 'area' || qDimension == 'volume'){
    document.getElementById('min-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最小参考值">Minimum Value Reference: ' + qMin + '</p>';
    document.getElementById('max-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最大参考值">Maximum Value Reference: ' + qMax + '</p>';
    document.getElementById('val-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="请估计所表示数值">Value estimation?</p>';
} else {
    document.getElementById('min-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最小参考值">Minimum Value Reference: ' + minLocal + '</p>';
    document.getElementById('max-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最大参考值">Maximum Value Reference: ' + maxLocal + '</p>';
    document.getElementById('val-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="请估计所表示数值">Value estimation?</p>';
}

function renderBars(value, color) {
    d3.select('#min-div')
      .append('svg')
      .attr('id', 'min-svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    d3.select('#max-div')
      .append('svg')
      .attr('id', 'max-svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    d3.select('#val-div')
      .append('svg')
      .attr('id', 'val-svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    document.getElementById('min-svg').setAttribute('viewbox', '0 0 600 600');
    document.getElementById('max-svg').setAttribute('viewbox', '0 0 600 600');
    document.getElementById('val-svg').setAttribute('viewbox', '0 0 600 600');

    let barWidth = 5,
        minH = 5,
        maxH = 500;
    let valH = minH + (value - qMin) / (qMax - qMin) * (maxH - minH),
        minLocalH = minH + (minLocal - qMin) / (qMax - qMin) * (maxH - minH),
        maxLocalH = minH + (maxLocal - qMin) / (qMax - qMin) * (maxH - minH),
        valLocalH = valH;
    function renderBar(arg) {
        let g = d3.select('#' + arg + '-svg')
                    .append('g')
                    .attr('id', arg + '-g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        if (color == 0) {
            g.append('rect')
             .attr('id', arg + '-bar')
             .attr('x', function() {
                return (viewWidth - barWidth) / 2;
             })
             .attr('y', function() {
                return viewHeight - eval(arg + 'H') - margin.bottom;
             })
             .attr('width', barWidth)
             .attr('height', function() {
                return eval(arg + 'H');
             })
             .attr('fill', '#000000');
        } else {
            g.append('rect')
             .attr('id', arg + '-bar')
             .attr('x', function() {
                return (viewWidth - barWidth) / 2;
             })
             .attr('y', function() {
                return viewHeight - eval(arg + 'LocalH') - margin.bottom;
             })
             .attr('width', barWidth)
             .attr('height', function() {
                return eval(arg + 'LocalH');
             })
             .attr('fill', fillColor)
        }
        if (color == -1) {
            d3.select('#' + arg + '-bar')
              .attr('fill', '#000000');
            d3.select('#' + arg + '-svg')
              .style('background-color', fillColor);
        }
    }
    for (let i = 0; i < args.length; i++) {
        renderBar(args[i]);
    }
}

function renderRects(value, color) {
    d3.select('#min-div')
      .append('svg')
      .attr('id', 'min-svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    d3.select('#max-div')
      .append('svg')
      .attr('id', 'max-svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    d3.select('#val-div')
      .append('svg')
      .attr('id', 'val-svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    document.getElementById('min-svg').setAttribute('viewbox', '0 0 600 600');
    document.getElementById('max-svg').setAttribute('viewbox', '0 0 600 600');
    document.getElementById('val-svg').setAttribute('viewbox', '0 0 600 600');

    let normW = 5,
        normH = 5,
        fullW = 500,
        fullH = 500;
    let minH = normH,
        maxH = fullH * (fullH / normH),
        valH = Math.floor(minH + (value - qMin) / (qMax - qMin) * (maxH - minH));
    let minLocalH = minH + (minLocal - qMin) / (qMax - qMin) * (maxH - minH),
        maxLocalH = minH + (maxLocal - qMin) / (qMax - qMin) * (maxH - minH),
        valLocalH = valH;
    let x = (viewWidth - fullW) / 2,
        y = (viewHeight - fullH) / 2,
        ratio = maxH / normH;

    function renderRect(arg) {
        d3.select('#' + arg +'-svg')
          .append('g')
          .attr('id', arg + '-g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        if (color == 0) {
            let h = eval(arg + 'H');
            if (h > fullH) {
                d3.select('#' + arg + '-g')
                  .append('rect')
                  .attr('id', arg + '-sqr')
                  .attr('x', x)
                  .attr('y', y)
                  .attr('width', function() {
                    return normW * Math.floor(h / fullH);
                  })
                  .attr('height', fullH)
                  .attr('fill', '#000000')
                  .attr('stroke', strokeColor)
                  .attr('stroke-width', strokeWidth);
                for (let i = 1; i < Math.floor(h / fullH); i++) {
                    d3.select('#' + arg + '-g')
                      .append('rect')
                      .attr('x', function() {
                        return x + normW * i;
                      })
                      .attr('y', function() {
                        return y;
                      })
                      .attr('width', 1)
                      .attr('height', fullH)
                      .attr('fill', strokeColor);
                  }
                if (h % fullH != 0) {
                    d3.select('#' + arg + '-g')
                      .append('rect')
                      .attr('id', arg + '-sqr-minor')
                      .attr('x', function() {
                        let w = document.getElementById(arg + '-sqr').width.baseVal.value;
                        return x + w;
                      })
                      .attr('y', function() {
                        return viewHeight - (h % fullH) - y;
                      })
                      .attr('width', normW)
                      .attr('height', function() {
                        return h % fullH;
                      })
                      .attr('fill', '#000000')
                      .attr('stroke', strokeColor)
                      .attr('stroke-width', strokeWidth);
                  }
            } else {
                d3.select('#' + arg + '-g')
                  .append('rect')
                  .attr('id', arg + '-sqr')
                  .attr('x', x)
                  .attr('y', function() {
                    return viewHeight - (h % fullH) - y;
                  })
                  .attr('width', normW)
                  .attr('height', function() {
                    return h % fullH;
                  })
                  .attr('fill', '#000000')
                  .attr('stroke', strokeColor)
                  .attr('stroke-width', strokeWidth)
            }
        } else {
            let hl = eval(arg + 'LocalH');
            if (hl >= fullH) {
                d3.select('#' + arg + '-g')
                  .append('rect')
                  .attr('id', arg + '-sqr')
                  .attr('x', x)
                  .attr('y', y)
                  .attr('width', function() {
                    return normW * Math.floor(hl / fullH);
                  })
                  .attr('height', fullH)
                  .attr('fill', fillColor)
                  .attr('stroke', localStrokeColor)
                  .attr('stroke-width', strokeWidth);
                for (let i = 1; i < Math.floor(hl / fullH); i++) {
                    d3.select('#' + arg + '-g')
                      .append('rect')
                      .attr('class', 'grids')
                      .attr('x', function() {
                        return x + normW * i;
                      })
                      .attr('y', function() {
                        return y;
                      })
                      .attr('width', 1)
                      .attr('height', fullH)
                      .attr('fill', localStrokeColor);
                  }
                if (hl % fullH != 0) {
                    d3.select('#' + arg + '-g')
                      .append('rect')
                      .attr('id', arg + '-sqr-minor')
                      .attr('x', function() {
                        let w = document.getElementById(arg + '-sqr').width.baseVal.value;
                        return x + w;
                      })
                      .attr('y', function() {
                        return viewHeight - (hl % fullH) - y;
                      })
                      .attr('width', normW)
                      .attr('height', function() {
                        return hl % fullH;
                      })
                      .attr('fill', fillColor)
                      .attr('stroke', localStrokeColor)
                      .attr('stroke-width', strokeWidth);
                  }
            } else {
                d3.select('#' + arg + '-g')
                  .append('rect')
                  .attr('id', arg + '-sqr')
                  .attr('x', x)
                  .attr('y', function() {
                    return viewHeight - (hl % fullH) - y;
                  })
                  .attr('width', normW)
                  .attr('height', function() {
                    return hl % fullH;
                  })
                  .attr('fill', fillColor)
                  .attr('stroke', localStrokeColor)
                  .attr('stroke-width', strokeWidth)
            }
            if (color == -1) {
                d3.select('#' + arg + '-svg')
                  .style('background-color', fillColor);
                d3.select('#' + arg + '-sqr')
                  .attr('fill', '#000000')
                  .attr('stroke', strokeColor);
                d3.select('#' + arg + '-sqr-minor')
                  .attr('fill', '#000000')
                  .attr('stroke', strokeColor);
                d3.selectAll('.grids')
                  .attr('fill', strokeColor);
            }
        }
    }
    for (let i = 0; i < args.length; i++){
        renderRect(args[i]);
    }
}

function renderCubes(value, color) {
    let min = qMin,
        max = 10648, //qMax won't fit
        val = value,
        pointer = 0;
    function render(arg) {
        let scene, camera, renderer, mesh, wireframe;
        init(arg);
        renderScene();
        function init(arg){
            let axes, grid, boxGeo, wireGeo, boxMat, wireMat,
                startPos = new THREE.Vector3(-550, 0, -550),
                camPos = new THREE.Vector3(850, 1200, 850),
                lookAtPos = new THREE.Vector3(-800, 0, -800),
                gridSize = 1100,
                gridCnt = 22,
                gridColor = 0xd3d3d3,
                axesSize = 50,
                matColor, backgroundColor;
            if (color == 0) {
                matColor = 0xf0f0f0,
                backgroundColor = 0xffffff;
            } else if (color == 1) {
                matColor = fillColor,
                backgroundColor = 0xffffff;
            } else if (color == -1) {
                matColor = 0xf0f0f0,
                backgroundColor = fillColor;
            }

            scene = new THREE.Scene();
            scene.background = new THREE.Color(backgroundColor);
            camera = new THREE.OrthographicCamera(frustumSize * aspectRatio / 2,
                                                  frustumSize * aspectRatio / - 2,
                                                  frustumSize * aspectRatio / 2,
                                                  frustumSize * aspectRatio / - 2,
                                                  1, 3000);
            camera.position.copy(camPos);
            camera.lookAt(lookAtPos);
            renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
            // renderer = new THREE.CanvasRenderer();
            // renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(canvasSize, canvasSize);
            renderer.autoClear = true;
            boxGeo = new THREE.BoxGeometry(50, 50, 50, 1, 1, 1);
            boxMat = new THREE.MeshBasicMaterial({color:matColor, overdraw:0.5});
            wireGeo = new THREE.EdgesGeometry(boxGeo);
            wireMat = new THREE.LineBasicMaterial({color:0x000000, linewidth:2});
            mesh = new THREE.Mesh(boxGeo, boxMat);
            mesh.position.copy(startPos);
            wireframe = new THREE.LineSegments(wireGeo, wireMat);
            wireframe.position.copy(startPos);


            axes = new THREE.AxesHelper(axesSize);
            axes.renderOrder = 1000;
            axes.onBeforeRender = function(renderer) {
                renderer.clearDepth();
            }
            grid = new THREE.GridHelper(gridSize, gridCnt, gridColor, gridColor);
            grid.renderOrder = 997;
            grid.onBeforeRender = function(renderer) {
                renderer.clearDepth();
            }
            // scene.add(grid);
            // scene.add(axes);
            scene.add(mesh);
            scene.add(wireframe);

            let parEle = document.getElementById(arg + '-div');
            parEle.insertBefore(renderer.domElement, parEle.firstChild);

            if (color == 0) {
                createAll(arg);
            } else {
                arg = arg + 'Local';
                createAll(arg);
            }

            function createObj(arg, deltaX, deltaY, deltaZ) {
                let meshClone = mesh.clone(),
                    wireClone = wireframe.clone(),
                    offset = new THREE.Vector3(50 * deltaZ, 50 * deltaY, 50 * deltaX);
                meshClone.position.add(offset);
                wireClone.position.add(offset);
                scene.add(meshClone);
                scene.add(wireClone);
            }

            function createAll(arg) {
                let area = Math.pow(gridCnt, 2);
                if (eval(arg) <= gridCnt) {
                    for (let i = 0; i < eval(arg); i++) {
                        createObj(arg, 0, i, 0);
                    }
                } else if(eval(arg) > gridCnt && eval(arg) <= area){
                    let major = Math.floor(eval(arg) / gridCnt),
                        minor = eval(arg) % gridCnt;
                    for (let i = 0; i < major; i++){
                        for (let j = 0; j < gridCnt; j++) {
                            createObj(arg, i, j, 0);
                        }
                    }
                    for (let i = 0; i < minor; i++) {
                        createObj(arg, major , i, 0);
                    }
                } else if (eval(arg) > area) {
                    let major3D = Math.floor(eval(arg) / area),
                        major2D = Math.floor((eval(arg) % area) / gridCnt),
                        minor = (eval(arg) % area) % gridCnt;
                    for (let i = 0; i < major3D; i++) {
                        for (let j = 0; j < gridCnt; j++) {
                            for (let k = 0; k < gridCnt; k++) {
                                createObj(arg, j, k, i);
                            }
                        }
                    }
                    for (let i = 0; i < major2D; i++) {
                        for (let j = 0; j < gridCnt; j++) {
                            createObj(arg, i, j, major3D);
                        }
                    }
                    for (let i = 0; i < minor; i++) {
                        createObj(arg, major2D, i, major3D);
                    }
                }
            }
        }

        function renderScene() {
            requestAnimationFrame(renderScene);
            renderer.render(scene, camera);
        }
    }
    for (let i = 0; i < args.length; i++) {
        render(args[i]);
    }
}

function renderLegend() {
    let legendUnit = 100;
    let legendRectH = 30;
    let legend = d3.select('#legend')
                   .append('svg')
                   .attr('id', 'legend-svg')
                   .attr('width', legendWidth)
                   .attr('height', legendHeight)
                   .append('g')
                   .attr('id', 'legend-g')
                   .attr('transform', 'translate(50,0)');
    document.getElementById('legend-svg').setAttribute('viewbox', '0 0 600 100');
    for (let i = 1; i < orders.length + 1; i++) {
        legend.append('rect')
              .attr('id', 'legend_' + i)
              .attr('x', function() {
                return legendUnit * (i - 1);
              })
              .attr('y', margin.top)
              .attr('width', legendUnit)
              .attr('height', legendRectH)
              .attr('fill', function() {
                return colorScale(i);
              });
          }
    for (let j = 0; j < orders.length + 1; j++) {
        legend.append('text')
              .attr('x', function() {
                return legendUnit * j;
              })
              .attr('y', legendRectH * 2)
              .attr('text-anchor', 'middle')
              .text(function() {
                if (j == 0) {
                    return '1';
                } else {
                    return Math.pow(10, j);
                }
              });
    }
}

function render(dimension, value) {
    let colorOption = {'no_color': 0, 'color': 1, 'bg_color': -1};
    switch(dimension) {
        case 'length':
            renderBars(value, colorOption.no_color);
            break;
        case 'length_color':
            renderBars(value, colorOption.color);
            renderLegend();
            break;
        case 'length_background_color':
            renderBars(value, colorOption.bg_color);
            renderLegend();
            break;
        case 'area':
            renderRects(value, colorOption.no_color);
            break;
        case 'area_color':
            renderRects(value, colorOption.color);
            renderLegend();
            break;
        case 'area_background_color':
            renderRects(value, colorOption.bg_color);
            renderLegend();
            break;
        case 'volume':
            renderCubes(value, colorOption.no_color);
            renderLegend();
            break;
        case 'volume_color':
            renderCubes(value, colorOption.color);
            renderLegend();
            break;
        case 'volume_background_color':
            renderCubes(value, colorOption.bg_color);
            renderLegend();
            break;
        default:
            console.log('why default???');
            break;
    }
    return 1;
}

function order(value) {
    return Math.floor(Math.log10(value)) + 1;
}

function OrderLimits(value) {
    this.min = function() {
        return Math.pow(10, order(value) - 1);
    }
    this.max = function() {
        return Math.pow(10, order(value));
    }
}

$(window).resize(function() {
    svgWidth = $('#min-div').width() - 1;
    svgHeight = svgWidth;
    // console.log('svgWidth: ');
    // console.log(svgWidth);
    // console.log('svgHeight: ');
    // console.log(svgHeight);
});

render(qDimension, qVal);
