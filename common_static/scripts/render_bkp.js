'use strict';


var svgWidth = document.getElementById('min-div').clientWidth - 1;
var svgHeight = svgWidth;
var legendWidth = svgWidth;
var legendHeight = 80;
var margin = {'top': 10, 'bottom': 20, 'left': 10, 'right': 10};

const orderNum = 5;
const orders = [1, 2, 3, 4, 5];

let colorScale = d3.scaleOrdinal(d3.schemeBlues[orderNum]).domain(orders);

const args = ['min', 'max', 'val'];
const strokeColor = '#ff0000';
const localStrokeColor = '#000000';
const strokeWidth = 1;

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
    document.getElementById('min-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最小参考值">Minimum Value Reference: ' + Math.pow(10, order(qVal) - 1) + '</p>';
    // document.getElementById('min-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最小参考值">Minimum Value Reference: ' + qMin + '</p>';
    document.getElementById('max-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最大参考值">Maximum Value Reference: ' + (Math.pow(10, order(qVal)) - 1) + '</p>';
    document.getElementById('val-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="请估计所表示数值">Value estimation?</p>';
}

function renderBars(value, color) {
    let barWidth = 20,
        minH = 1,
        maxH = 500,
        valH;
    let minLocal = Math.pow(10, (order(value) - 1)),
        maxLocal = Math.pow(10, order(value)) - 1;
    let minLocalH = new LocalHeight(minLocal, maxH),
        maxLocalH = new LocalHeight(maxLocal, maxH),
        valLocalH = new LocalHeight(value, maxH);
    function renderBar(arg) {
        valH = minH + (value - qMin) / (qMax - qMin) * (maxH - minH);
        var bar = d3.select('#' + arg + '-svg')
                    .append('g')
                    .attr('id', arg + '-g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .append('rect')
                    .attr('id', arg + '-bar')
                    .attr('x', function() {
                        return (svgWidth - barWidth) / 2;
                    })
                    .attr('y', function() {
                           return svgHeight - eval(arg + 'H') - margin.bottom;
                    })
                    .attr('width', barWidth)
                    .attr('height', function() {
                            return eval(arg + 'H');
                    })
                    .attr('fill', '#000000');
    }
    function renderBarLocal(arg, color) {
        var bar = d3.select('#' + arg + '-svg')
                    .append('g')
                    .attr('id', arg + '-g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .append('rect')
                    .attr('id', arg + '-bar')
                    .attr('x', function() {
                        return (svgWidth - barWidth) / 2;
                    })
                    .attr('y', function() {
                        let height = eval(arg + 'LocalH');
                        return svgHeight - height.get() - margin.bottom;
                    })
                    .attr('width', barWidth)
                    .attr('height', function() {
                        let height = eval(arg + 'LocalH');
                        return height.get();
                    })
                    .attr('fill', function() {
                        return colorScale(order(value));
                    });
        if (color == -1) {
            bar.attr('fill', '#000000');
            d3.select('#' + arg + '-svg')
              .style('background-color', function() {
                  return colorScale(eval(arg + 'Order'));
              })
        }
    }
    for (let i = 0; i < args.length; i++) {
        if (color == 0) {
            renderBar(args[i]);
        } else if (color == 1 || color == -1) {
            renderBarLocal(args[i], color);
        }
    }
    console.log('rendered bar');
}

function renderRects(value, color) {
    let normW = 5,
        normH = 5,
        maxW = 500,
        maxH = 500,
        ratio, valMajor, valMinor;
        ratio = maxW / normW;
        valMajor = Math.floor(value / ratio);
        valMinor = value % ratio;
    let localNorm = new LocalNorm(value, maxH);
    let localNormW = localNorm.getNorm(),
        localNormH = localNorm.getNorm(),
        localRatio = localNorm.getRatio(),
        // valLocalMajor = Math.floor(value / localRatio),
        // valLocalMinor = value % localRatio;
        maxLocalMajor = 3,
        maxLocalMinor = (Math.pow(10, order(qMax)) - 1 - (Math.pow(10, order(qMax) - 1)) * 3 * 3) / Math.pow(10, order(qMax) - 1),
        valLocalMajor = 3,
        valLocalMinor = (Math.pow(10, order(value)) - 1 - (Math.pow(10, order(value) - 1)) * 3 * 3) / Math.pow(10, order(value) - 1);
    console.log(valLocalMinor);
    // console.log(localNormH);
    // console.log(localNormW);

    d3.select('#min-svg')
      .append('g')
      .attr('id', 'min-g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    d3.select('#max-svg')
      .append('g')
      .attr('id', 'max-g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    d3.select('#val-svg')
      .append('g')
      .attr('id', 'val-g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    function renderRect(val) {
        d3.select('#min-g')
          .append('rect')
          .attr('id', 'min-sqr')
          .attr('x', function() {
                return (svgWidth - maxW) / 2;
          })
          .attr('y', function() {
                return svgHeight - normH - (svgHeight - maxH) / 2;
          })
          .attr('width', normW)
          .attr('height', normH)
          .attr('stroke-width', strokeWidth)
          .attr('stroke', strokeColor);
        d3.select('#max-g')
          .append('rect')
          .attr('id', 'max-sqr')
          .attr('x', function() {
                return (svgWidth - maxW) / 2;
          })
          .attr('y', function() {
                return (svgHeight - maxH) / 2;
          })
          .attr('width', maxW)
          .attr('height', maxH)
          .attr('stroke-width', strokeWidth)
          .attr('stroke', strokeColor);
        for (let i = 1; i < ratio; i++) {
            d3.select('#max-g')
              .append('rect')
              .attr('x', function() {
                return (svgWidth - maxW) / 2 + normW * i;
              })
              .attr('y', function() {
                return (svgHeight - maxH) / 2;
              })
              .attr('width', 1)
              .attr('height', maxH)
              .attr('fill', strokeColor);
        }
        if (valMajor != 0) {
            d3.select('#val-g')
              .append('rect')
              .attr('id', 'val-sqr-major')
              .attr('x', function() {
                return (svgWidth - maxW) / 2;
              })
              .attr('y', function() {
                return (svgHeight - maxH) / 2;
              })
              .attr('width', function() {
                return normW * valMajor;
              })
              .attr('height', maxH)
              .attr('stroke-width', strokeWidth)
              .attr('stroke', strokeColor);
            for (let i = 1; i < valMajor; i++) {
                d3.select('#val-g')
                  .append('rect')
                  .attr('x', function() {
                    return (svgWidth - maxW) / 2 + normW * i;
                  })
                  .attr('y', function() {
                    return (svgHeight - maxH) / 2;
                  })
                  .attr('width', 1)
                  .attr('height', maxH)
                  .attr('fill', strokeColor);
            }
            if (valMinor != 0) {
                d3.select('#val-g')
                  .append('rect')
                  .attr('id', 'val-sqr-minor')
                  .attr('x', function() {
                    let majorW = document.getElementById('val-sqr-major').width.baseVal.value;
                    return (svgWidth - maxW) / 2 + majorW;
                  })
                  .attr('y', function() {
                    return svgHeight - (valMinor * normH) - (svgHeight - maxH) / 2;
                  })
                  .attr('width', function() {
                    return normW;
                  })
                  .attr('height', function() {
                    return valMinor * normH;
                  })
                  .attr('stroke-width', strokeWidth)
                  .attr('stroke', strokeColor);
            }
        } else {
            d3.select('#val-g')
              .append('rect')
              .attr('id', 'val-sqr')
              .attr('x', function() {
                return (svgWidth - maxW) / 2;
              })
              .attr('y', function() {
                return svgHeight - normH * valMinor - (svgHeight - maxH) / 2;
              })
              .attr('width', normW)
              .attr('height', function() {
                return normH * valMinor;
              })
              .attr('stroke-width', strokeWidth)
              .attr('stroke', strokeColor);
        }
    }
    function renderRectLocal(val) {
        d3.select('#min-g')
          .append('rect')
          .attr('id', 'min-sqr')
          .attr('class', 'rectangles')
          .attr('x', function() {
            return (svgWidth - maxW) / 2;
          })
          .attr('y', function() {
            return svgHeight - localNormH - (svgHeight - maxH) / 2;
          })
          .attr('width', localNormW)
          .attr('height', localNormH)
          .attr('fill', function() {
            return colorScale(order(val));
          })
          .attr('stroke-width', strokeWidth)
          .attr('stroke', strokeColor);
        d3.select('#max-g')
          .append('rect')
          .attr('id', 'max-sqr-major')
          .attr('class', 'rectangles')
          .attr('x', function() {
            return (svgWidth - maxW) / 2;
          })
          .attr('y', function() {
            return (svgHeight - maxH) / 2;
          })
          .attr('width', function() {
            return localNormW * maxLocalMajor;
          })
          .attr('height', maxH)
          .attr('fill', function() {
            return colorScale(order(val));
          })
          .attr('stroke-width', strokeWidth)
          .attr('stroke', strokeColor);
        d3.select('#max-g')
          .append('rect')
          .attr('id', 'max-sqr-minor')
          .attr('x', function() {
            let majorW = document.getElementById('max-sqr-major').width.baseVal.value;
            return (svgWidth - maxW) / 2 + majorW;
          })
          .attr('y', function() {
            return svgHeight - (maxLocalMinor * localNormH) - (svgHeight - maxH) / 2;
          })
          .attr('width', function() {
            return localNormW;
          })
          .attr('height', function() {
            return maxLocalMinor * localNormH;
          })
          .attr('fill', function() {
            return colorScale(order(val));
          })
          .attr('stroke-width', strokeWidth)
          .attr('stroke', strokeColor);
        for (let i = 1; i < localRatio; i++) {
            d3.select('#max-g')
              .append('rect')
              .attr('x', function() {
                return (svgWidth - maxW) / 2 + localNormW * i;
              })
              .attr('y', function() {
                return (svgHeight - maxH) / 2;
              })
              .attr('width', 1)
              .attr('height', maxH)
              .attr('fill', strokeColor);
        }
        if (valLocalMajor != 0) {
            d3.select('#val-g')
              .append('rect')
              .attr('id', 'val-sqr-major')
              .attr('class', 'rectangles')
              .attr('x', function() {
                return (svgWidth - maxW) / 2;
              })
              .attr('y', function() {
                return (svgHeight - maxH) / 2;
              })
              .attr('width', function() {
                return localNormW * valLocalMajor;
              })
              .attr('height', maxH)
              .attr('fill', function() {
                return colorScale(order(val));
              })
              .attr('stroke-width', strokeWidth)
              .attr('stroke', strokeColor);
            for (let i = 1; i < valLocalMajor; i++) {
                d3.select('#val-g')
                  .append('rect')
                  .attr('x', function() {
                    return (svgWidth - maxW) / 2 + localNormW * i;
                  })
                  .attr('y', function() {
                    return (svgHeight - maxH) / 2;
                  })
                  .attr('width', 1)
                  .attr('height', maxH)
                  .attr('fill', strokeColor);
            }
            if (valLocalMinor != 0) {
                d3.select('#val-g')
                  .append('rect')
                  .attr('id', 'val-sqr-minor')
                  .attr('class', 'rectangles')
                  .attr('x', function() {
                    let majorW = document.getElementById('val-sqr-major').width.baseVal.value;
                    return (svgWidth - maxW) / 2 + majorW;
                  })
                  .attr('y', function() {
                    return svgHeight - (valLocalMinor * localNormH) - (svgHeight - maxH) / 2;
                  })
                  .attr('width', localNormW)
                  .attr('height', function() {
                    return valLocalMinor * localNormH;
                  })
                  .attr('fill', function() {
                    return colorScale(order(val));
                  })
                  .attr('stroke-width', strokeWidth)
                  .attr('stroke', strokeColor);
            }
        } else {
            d3.select('#val-g')
              .append('rect')
              .attr('id', 'val-sqr')
              .attr('class', 'rectangles')
              .attr('x', function() {
                return (svgWidth - maxW) / 2
              })
              .attr('y', function() {
                return svgHeight - valLocalMinor * localNormH - (svgHeight - maxH) / 2;
              })
              .attr('width', localNormW)
              .attr('height', function() {
                return valLocalMinor * localNormH;
              })
              .attr('fill', function() {
                return colorScale(order(val));
              })
              .attr('stroke-width', strokeWidth)
              .attr('stroke', strokeColor);
        }
        if (color == -1) {
            d3.selectAll('.rectangles')
              .attr('fill', '#000000');
            for (arg in args) {
                d3.select('#' + arg + '-svg')
                  .style('background-color', function() {
                    return colorScale(order(value));
                  });
            }
        }
    }

    if (color == 0) {
        renderRect(value);
    } else if (color == 1 || color == -1) {
        renderRectLocal(value);
    }
    console.log('renderd area');
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

function LocalHeight(value, maxH) {
    this.get = function() {
        let _min, _max, _minH, _height;
        _min = Math.pow(10, order(value) - 1);
        _max = Math.pow(10, order(value)) - 1;
        // console.log(_min);
        // console.log(_max);
        _minH = maxH * _min / _max;
        // console.log(_minH);
        let scale = d3.scaleLinear().domain([_min, _max]).range([_minH, maxH]);
        _height = scale(value);
        return _height;
    }
}

function LocalNorm(value, maxH) {
    this.getRatio = function() {
        // let _min = Math.pow(10, order(value) - 1);
        // let _max = Math.pow(10, order(value)) - 1;
        // let _diff = _max / _min;
        // let _ratio = Math.sqrt(_diff);
        // return _ratio;
        if (value < 10) {
            return 3;
        } else {
            return 4;
        }
    }
    this.getNorm = function() {
        // let _min = Math.pow(10, order(value) - 1);
        // let _max = Math.pow(10, order(value)) - 1;
        // let _diff = _max / _min;
        // let _ratio = Math.sqrt(_diff);
        // let _norm = maxH / _ratio;
        // return _norm;
        if (value < 10) {
            return maxH / 3;
        } else {
            return maxH / 4;
        }
    }
}

$(window).resize(function() {
    svgWidth = $('#min-div').width() - 1;
    svgHeight = svgWidth;
    console.log('svgWidth: ');
    console.log(svgWidth);
    console.log('svgHeight: ');
    console.log(svgHeight);
});

render(qDimension, qVal);
