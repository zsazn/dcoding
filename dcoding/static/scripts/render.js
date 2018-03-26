'use strict';

$('#answer-modal').modal('hide');

var svgWidth = document.getElementById('min-div').clientWidth - 1;
var svgHeight = svgWidth;
var legendWidth = svgWidth;
var legendHeight = 80;
var margin = {'top': 10, 'bottom': 20, 'left': 10, 'right': 10};

const orderNum = 5;
const orders = [1, 2, 3, 4, 5];

const viewWidth = 600,
      viewHeight = 600;

let colorScale = d3.scaleOrdinal(d3.schemeBlues[orderNum]).domain(orders);
let fillColor = colorScale(order(qVal));

const args = ['min', 'max', 'val'];
const strokeColor = '#ff0000';
const localStrokeColor = '#000000';
const strokeWidth = 1;

const orderLimits = new OrderLimits(qVal);
const minLocal = orderLimits.min();
const maxLocal = orderLimits.max();

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
    // console.log('rendered bar');
}

function renderRects(value, color) {
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
    // console.log('renderd area');
}

function renderVolume(value, color) {
    console.log('rendered volume');
    return color;
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
            break;
        case 'volume_color':
            renderCubes(value, colorOption.color);
            break;
        case 'volume_background_color':
            renderCubes(value, colorOption.bg_color);
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
