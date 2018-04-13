'use strict';

$('#answer-modal').modal('hide');

var svgWidth = document.getElementById('min-div').clientWidth - 1;
var svgHeight = svgWidth;
var aspectRatio = window.innerWidth / window.innerHeight;
var legendWidth = svgWidth;
var legendHeight = 80;
var margin = {'top': 10, 'bottom': 20, 'left': 10, 'right': 10};

const orderNum = 5;
const orders = [1, 2, 3, 4];

const viewWidth = 600,
      viewHeight = 600;

var canvasSize = 600;

const frustumSize = 1000;

// let colorScale = d3.scaleOrdinal(d3.schemeBlues[orderNum]).domain(orders);
// let fillColor = colorScale(order(qVal));

// let colorScale = d3.scaleSequential(d3.interpolateBlues);

const minColor = '#d4e4f4',
      maxColor = '#08306b';
let colorLinearScale = d3.interpolate(d3.rgb(minColor), d3.rgb(maxColor));
let colorOrdinalScale = d3.scaleOrdinal()
                          .domain(orders)
                          .range([minColor,
                                  colorLinearScale(0.33),
                                  colorLinearScale(0.67),
                                  maxColor])

const args = ['min', 'max', 'val'];

const orderLimits = new OrderLimits(qVal);
const minLocal = orderLimits.min();
const maxLocal = orderLimits.max();
const valLocal = qVal;


render(qDimension, qVal);

for (let i = 0; i < args.length; i++) {
    annotate(args[i]);
}

function annotate(arg) {
    let p = document.createElement('p'),
        title = {'min': '最小参考值', 'max': '最大参考值', 'val': '请估计所表示数值'},
        text;
    p.setAttribute('data-toggle', 'tooltip');
    p.setAttribute('data-placement', 'bottom');
    p.setAttribute('class', 'annotation')
    p.setAttribute('title', title[arg]);
    if (qDimension == 'length') {
        text = {'min': 'Minimum Value Reference: <span><u><i>20</i></u></span>',
                'max': 'Maximum Value Reference: <span><u><i>' + qMax.toString() + '</i></u></span>',
                'val': 'Value Estimation?'};
    } else {
        text = {'min': 'Minimum Value Reference: <span><u><i>' + qMin.toString() + '</i></u></span>',
                'max': 'Maximum Value Reference: <span><u><i>' + qMax.toString() + '</i></u></span>',
                'val': 'Value Estimation?'};
    }
    p.innerHTML = text[arg];
    document.getElementById(arg + '-div').appendChild(p);
}

$(window).resize(function() {
    if (qDimension.indexOf('volume') == -1) {
        svgWidth = $('#min-div').width() - 1;
        svgHeight = svgWidth;
    }
});

function render(dimension, value) {
    let colorOption = {'no_color': 0, 'color': 1};
    switch(dimension) {
        case 'length':
            renderBars(value, colorOption.no_color);
            break;
        case 'area':
            renderRects(value, colorOption.no_color);
            break;
        case 'volume':
            renderCubes(value, colorOption.no_color);
            break;
        case 'volume_color':
            renderCubes(value, colorOption.color);
            renderLegend();
            break;
        default:
            console.log('why default???');
            break;
    }
    return 1;
}

function renderBars(value, color) {
    let min = qMin,
        max = qMax,
        val = value;

    let barWidth = 5,
        minH = 1,
        maxH = 500,
        valH;
    if (value <= 20) {
        valH = minH;
    } else {
        valH = Math.floor(value / 20) * minH;
    }

    let fillColor = '#888888';
    // let strokeColor = '#000000';

    for (let i = 0; i < args.length; i++){
        d3.select('#' + args[i] +'-div')
          .append('svg')
          .attr('id', args[i] + '-svg')
          .attr('width', svgWidth)
          .attr('height', svgHeight);
        document.getElementById(args[i] + '-svg').setAttribute('viewBox', '0 0 600 600');
        renderBar(args[i]);
      }

    function renderBar(arg) {
        let g = d3.select('#' + arg + '-svg')
                    .append('g')
                    .attr('id', arg + '-g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
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
         .attr('fill', fillColor);
         // .attr('stroke', strokeColor);
    }
}

function renderRects(value, color) {
    for (let i = 0; i < args.length; i++){
        d3.select('#' + args[i] +'-div')
          .append('svg')
          .attr('id', args[i] + '-svg')
          .attr('width', svgWidth)
          .attr('height', svgHeight);
        document.getElementById(args[i] + '-svg').setAttribute('viewBox', '0 0 600 600');
      }

    let min = qMin,
        max = qMax,
        val = value;

    let normW = 5,
        normH = 5,
        gridW = 50,
        gridH = 50,
        fullW = 500,
        fullH = 500;
    let minW = normW,
        minH = normH,
        maxW = fullW,
        maxH = fullH,
        valW, valH,
        valMajorW, valMajorH,
        valMinorW, valMinorH,
        valTMajorW, valTMajorH;
    let x = (viewWidth - fullW) / 2,
        y = (viewHeight + fullH) / 2;

    let fillColor = '#888888';
    // let strokeColor = '#000000';

    renderRect();

    function renderRect() {
        for (let i = 0; i < args.length; i++){
            d3.select('#' + args[i] +'-svg')
              .append('g')
              .attr('id', args[i] + '-g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          }
        d3.select('#min-g')
          .append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', normW)
          .attr('height', normH)
          .attr('fill', fillColor);
          // .attr('stroke', strokeColor);
        d3.select('#max-g')
          .append('rect')
          .attr('x', x)
          .attr('y', viewHeight - y)
          .attr('width', fullW)
          .attr('height', fullH)
          .attr('fill', fillColor);
          // .attr('stroke', strokeColor);
        if (value >=1 && value <=10) {
            valW = value / min * normW;
            valH = normH;
            d3.select('#val-g')
              .append('rect')
              .attr('x', x)
              .attr('y', y + valH)
              .attr('width', valW)
              .attr('height', valH)
              .attr('fill', fillColor);
              // .attr('stroke', strokeColor);
        } else if (value > 10 && value < 1000) {
            valMajorW = gridW;
            valMajorH = Math.floor(value / 10) * normH;
            valMinorW = value % 10 * normW;
            valMinorH = normH;
            d3.select('#val-g')
              .append('rect')
              .attr('x', x)
              .attr('y', y - valMajorH)
              .attr('width', valMajorW)
              .attr('height', valMajorH)
              .attr('fill', fillColor);
              // .attr('stroke', strokeColor);
            d3.select('#val-g')
              .append('rect')
              .attr('x', x)
              .attr('y', y - valMajorH - valMinorH)
              .attr('width', valMinorW)
              .attr('height', valMinorH)
              .attr('fill', fillColor);
              // .attr('stroke', strokeColor);
        } else if (value >= 1000 && value <= 10000) {
            valTMajorW = Math.floor(value / 1000) * gridW;
            valTMajorH = fullH;
            d3.select('#val-g')
              .append('rect')
              .attr('x', x)
              .attr('y', y - valTMajorH)
              .attr('width', valTMajorW)
              .attr('height', valTMajorH)
              .attr('fill', fillColor);
              // .attr('stroke', strokeColor);
            if (value % 1000 >= 1 && value % 1000 <= 10) {
                valMajorW = (value % 1000) / min * normW;
                valMajorH = normH;
                d3.select('#val-g')
                  .append('rect')
                  .attr('x', x + valTMajorW)
                  .attr('y', y - valMajorH)
                  .attr('width', valMajorW)
                  .attr('height', valMajorH)
                  .attr('fill', fillColor);
                  // .attr('stroke', strokeColor);
            } else {
                valMajorW = gridW;
                valMajorH = Math.floor((value % 1000) / 10) * normH;
                valMinorW = (value % 1000) % 10 * normW;
                valMinorH = normH;
                d3.select('#val-g')
                  .append('rect')
                  .attr('x', x + valTMajorW)
                  .attr('y', y - valMajorH)
                  .attr('width', valMajorW)
                  .attr('height', valMajorH)
                  .attr('fill', fillColor);
                  // .attr('stroke', strokeColor);
                d3.select('#val-g')
                  .append('rect')
                  .attr('x', x + valTMajorW)
                  .attr('y', y - valMajorH - valMinorH)
                  .attr('width', valMinorW)
                  .attr('height', valMinorH)
                  .attr('fill', fillColor);
                  // .attr('stroke', strokeColor);
            }
        }
    }
}

function renderCubes(value, color) {
    let min = qMin,
        max = qMax,
        val = value,
        normY = 5,
        gridX = 50,
        gridY = 50,
        gridZ = 50;
    function render(arg) {
        let scene, camera, renderer;
        init(arg);
        renderScene();
        function init(arg){
            let axes, grid,
                boxGeo, wireGeo,
                boxGeoMajor, wireGeoMajor,
                boxGeoMajor3D, wireGeoMajor3D,
                mesh, wireframe,
                meshMajor, wireframeMajor,
                meshMajor3D, wireframeMajor3D,
                boxMat, wireMat,
                startPos = new THREE.Vector3(0, 0, 0),
                camPos = new THREE.Vector3(550, 600, 550),
                lookAtPos = new THREE.Vector3(-400, 0, -400),
                gridCnt = 10,
                gridSize = 1000,
                gridColor = 0xd3d3d3,
                axesSize = 500,
                matColor, backgroundColor;


            scene = new THREE.Scene();
            scene.background = new THREE.Color(backgroundColor);
            camera = new THREE.OrthographicCamera(frustumSize * aspectRatio / 2.5,
                                                  frustumSize * aspectRatio / - 2.5,
                                                  frustumSize * aspectRatio / 2.5,
                                                  frustumSize * aspectRatio / - 2.5,
                                                  1, 1500);
            camera.position.copy(camPos);
            camera.lookAt(lookAtPos);
            renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
            // renderer = new THREE.CanvasRenderer();
            // renderer.setPixelRatio(window.devicePixelRatio);
            if (window.innerWidth >= 1800){
                renderer.setSize(canvasSize, canvasSize);
            } else if (window.innerWidth < 1800 && window.innerWidth >= 1280) {
                renderer.setSize(canvasSize/1.5, canvasSize/1.5);
            } else if (window.innerWidth < 1280) {
                renderer.setSize(canvasSize/2, canvasSize/2);
            }
            // renderer.autoClear = true;
            // renderer.preserveDrawingBuffer = true;

            axes = new THREE.AxesHelper(axesSize);
            axes.renderOrder = 1000;
            // axes.onBeforeRender = function(renderer) {
            //     renderer.clearDepth();
            // }
            // scene.add(axes);
            grid = new THREE.GridHelper(gridSize, gridCnt, gridColor, gridColor);
            grid.renderOrder = 997;
            grid.onBeforeRender = function(renderer) {
                renderer.clearDepth();
            }

            let parEle = document.getElementById(arg + '-div');
            parEle.appendChild(renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);

            let area = Math.pow(gridCnt, 2);
            let cubic = Math.pow(gridCnt, 3);
            let data = eval(arg);
            if (color == 0) {
                matColor = 0x888888,
                backgroundColor = 0xffffff;
            } else if (color == 1) {
                matColor = colorOrdinalScale(order(data) - 1);
                backgroundColor = 0xffffff;
            }
            boxMat = new THREE.MeshBasicMaterial({color:matColor, overdraw:0.5});
            wireMat = new THREE.LineBasicMaterial({color:0x000000, linewidth:1});
            if (data <= area) {
                boxGeo = new THREE.BoxGeometry(gridX, data * normY, gridZ, 1, 1, 1);
                wireGeo = new THREE.EdgesGeometry(boxGeo);
                mesh = new THREE.Mesh(boxGeo, boxMat);
                mesh.position.copy(startPos);
                wireframe = new THREE.LineSegments(wireGeo, wireMat);
                wireframe.position.copy(startPos);
                mesh.translateY(data * normY / 2);
                wireframe.translateY(data * normY / 2);
                scene.add(mesh);
                scene.add(wireframe);
            } else if (data > area && data <= cubic) {
                let major = Math.floor(data / area),
                    minor = data % area;
                boxGeoMajor = new THREE.BoxGeometry(gridX, gridY * 10, gridZ * major, 1, 1, 1);
                wireGeoMajor = new THREE.EdgesGeometry(boxGeoMajor);
                meshMajor = new THREE.Mesh(boxGeoMajor, boxMat);
                meshMajor.position.copy(startPos);
                wireframeMajor = new THREE.LineSegments(wireGeoMajor, wireMat);
                wireframeMajor.position.copy(startPos);
                meshMajor.translateY(250);
                meshMajor.translateZ(gridZ * major / 2);
                wireframeMajor.translateY(250);
                wireframeMajor.translateZ(gridZ * major / 2);

                if (minor != 0) {
                  boxGeo = new THREE.BoxGeometry(gridX, normY * minor, gridZ, 1, 1, 1);
                  wireGeo = new THREE.EdgesGeometry(boxGeo);
                  mesh = new THREE.Mesh(boxGeo, boxMat);
                  mesh.position.z = startPos.z + gridZ * (major + 1 / 2);
                  wireframe = new THREE.LineSegments(wireGeo, wireMat);
                  wireframe.position.z = startPos.z + gridZ * (major + 1 / 2);
                  mesh.translateY(normY * minor / 2);
                  wireframe.translateY(normY * minor / 2);
                }

                scene.add(meshMajor);
                scene.add(wireframeMajor);
                scene.add(mesh);
                scene.add(wireframe);
            } else if (data > cubic) {
                let major3D = Math.floor(data / cubic),
                    major = Math.floor(data % cubic / area),
                    minor = (data % cubic) % area;
                boxGeoMajor3D = new THREE.BoxGeometry(gridX * major3D, gridY * 10, gridZ * 10, 1, 1, 1);
                wireGeoMajor3D = new THREE.EdgesGeometry(boxGeoMajor3D);
                meshMajor3D = new THREE.Mesh(boxGeoMajor3D, boxMat);
                meshMajor3D.position.copy(startPos);
                wireframeMajor3D = new THREE.LineSegments(wireGeoMajor3D, wireMat);
                wireframeMajor3D.position.copy(startPos);
                meshMajor3D.translateX(gridX * major3D / 2);
                meshMajor3D.translateY(gridY * 10 / 2);
                meshMajor3D.translateZ(gridZ * 10 / 2)
                wireframeMajor3D.translateX(gridX * major3D / 2);
                wireframeMajor3D.translateY(gridY * 10 / 2);
                wireframeMajor3D.translateZ(gridZ * 10 / 2);
                scene.add(meshMajor3D);
                scene.add(wireframeMajor3D);
                if (data % cubic != 0) {
                    boxGeoMajor = new THREE.BoxGeometry(gridX, gridY * 10, gridZ * major, 1, 1, 1);
                    wireGeoMajor = new THREE.EdgesGeometry(boxGeoMajor);
                    meshMajor = new THREE.Mesh(boxGeoMajor, boxMat);
                    wireframeMajor = new THREE.LineSegments(wireGeoMajor, wireMat);
                    meshMajor.position.x = startPos.x + gridX * (major3D + 1 / 2);
                    wireframeMajor.position.x = startPos.x + gridX * (major3D + 1 / 2);
                    meshMajor.translateY(gridY * 10 / 2);
                    meshMajor.translateZ(gridZ * major / 2);
                    wireframeMajor.translateY(gridY * 10 / 2);
                    wireframeMajor.translateZ(gridZ * major / 2);
                    scene.add(meshMajor);
                    scene.add(wireframeMajor);
                }
                if (minor != 0) {
                    boxGeo = new THREE.BoxGeometry(gridX, normY * minor, gridZ, 1, 1, 1);
                    wireGeo = new THREE.EdgesGeometry(boxGeo);
                    mesh = new THREE.Mesh(boxGeo, boxMat);
                    wireframe = new THREE.LineSegments(wireGeo, wireMat);
                    mesh.position.x = startPos.x + gridX * (major3D + 1 / 2);
                    mesh.position.z = startPos.z + gridZ * (major + 1 / 2);
                    wireframe.position.x = startPos.x + gridX * (major3D + 1 / 2);
                    wireframe.position.z = startPos.z + gridZ * (major + 1 / 2);
                    mesh.translateY(normY * minor / 2);
                    wireframe.translateY(normY * minor / 2);
                    scene.add(mesh);
                    scene.add(wireframe);
                }
            }

            // createAll(arg);
            // function createObj(arg, deltaX, deltaY, deltaZ) {
            //     let meshClone = mesh.clone(),
            //         // wireClone = wireframe.clone(),
            //         offset = new THREE.Vector3(gridZ * deltaZ, normY * deltaY, gridX * deltaX);
            //     meshClone.position.add(offset);
            //     // wireClone.position.add(offset);
            //     scene.add(meshClone);
            //     // scene.add(wireClone);
            // }
            // function createAll(arg) {
            //     let area = Math.pow(gridCnt, 2);
            //     let cubic = Math.pow(gridCnt, 3);
            //     if (eval(arg)) <= area) {
            //         for (let i = 0; i < eval(arg); i++) {
            //             createObj(arg, 0, i, 0);
            //         }
            //     } else if(eval(arg) > area && eval(arg) <= cubic){
            //         let major = Math.floor(eval(arg) / area),
            //             minor = eval(arg) % area;
            //         for (let i = 0; i < major; i++){
            //             for (let j = 0; j < gridCnt; j++) {
            //                 createObj(arg, i, j, 0);
            //             }
            //         }
            //         for (let i = 0; i < minor; i++) {
            //             createObj(arg, major , i, 0);
            //         }
            //     } else if (eval(arg) > cubic) {
            //         let major3D = Math.floor(eval(arg) / cubic),
            //             major = Math.floor((eval(arg) % cubic) / area),
            //             minor = (eval(arg) % cubic) % area;
            //         for (let i = 0; i < major3D; i++) {
            //             for (let j = 0; j < gridCnt; j++) {
            //                 for (let k = 0; k < area; k++) {
            //                     createObj(arg, j, k, i);
            //                 }
            //             }
            //         }
            //         for (let i = 0; i < major; i++) {
            //             for (let j = 0; j < area; j++) {
            //                 createObj(arg, i, j, major3D);
            //             }
            //         }
            //         for (let i = 0; i < minor; i++) {
            //             createObj(arg, major, i, major3D);
            //         }
            //     }
            // }
            function onWindowResize() {
                camera.left = frustumSize * aspectRatio / 2;
                camera.right = frustumSize * aspectRatio / -2;
                camera.top = frustumSize * aspectRatio / 2;
                camera.bottom = frustumSize * aspectRatio / -2;
                camera.updateProjectionMatrix();
                if (window.innerWidth >= 1800) {
                    canvasSize = 600;
                    renderer.setSize(canvasSize, canvasSize);
                } else if (window.innerWidth < 1800 && window.innerWidth >= 1280) {
                    canvasSize = 400;
                    renderer.setSize(canvasSize, canvasSize);
                } else if (window.innerWidth < 1280) {
                    canvasSize = 300;
                    renderer.setSize(canvasSize, canvasSize);
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

// function renderLegend() {
//     let legendUnit = 100;
//     let legendRectW = 1000;
//     let legendRectH = 20;
//     let legend = d3.select('#legend')
//                    .append('svg')
//                    .attr('id', 'legend-svg')
//                    .attr('width', legendWidth)
//                    .attr('height', legendHeight)
//                    .append('g')
//                    .attr('id', 'legend-g')
//                    .attr('transform', 'translate(50,0)');
//     document.getElementById('legend-svg').setAttribute('viewbox', '0 0 1000 100');
//     var lg = legend.append('defs')
//                    .append('linearGradient')
//                    .attr('id', 'legend-linear-gradient')
//                    .attr('x1', '0%')
//                    .attr('y1', '0%')
//                    .attr('x2', '100%')
//                    .attr('y2', '0%')
//                    .attr('spreadMethod', 'pad');
//     lg.append('stop')
//       .attr('offset', '0%')
//       .attr('stop-color', d3.rgb(minColor))
//       .attr('stop-opacity', 1);
//     lg.append('stop')
//       .attr('offset', '100%')
//       .attr('stop-color', d3.rgb(maxColor))
//       .attr('stop-opacity', 1);
//     legend.append('rect')
//           .attr('id', 'legend_rect')
//           .attr('x', 0)
//           .attr('y', 0)
//           .attr('width', legendRectW)
//           .attr('height', legendRectH)
//           .attr('fill', 'url(#legend-linear-gradient)');
//     for (let j = 0; j < orders.length; j++) {
//         legend.append('text')
//               .attr('x', function() {
//                 return Math.pow(10, j) / 10000 * legendRectW;
//               })
//               .attr('y', legendRectH * 2)
//               .attr('text-anchor', 'middle')
//               .text(function() {
//                 return Math.pow(10, j);
//               });
//     }
// }

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
                   .attr('transform', 'translate(100,0)');
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
                return colorOrdinalScale(i);
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
                    return Math.pow(10, j);
              });
    }
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
