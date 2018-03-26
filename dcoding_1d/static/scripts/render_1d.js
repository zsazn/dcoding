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
const fillColor = colorScale(order(qVal));


const args = ['min', 'max', 'val'];

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

if (qDimension == 'length'){
    document.getElementById('min-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最小参考值">Minimum Value Reference: ' + qMin + '</p>';
    document.getElementById('max-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最大参考值">Maximum Value Reference: ' + qMax + '</p>';
    document.getElementById('val-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="请估计所表示数值">Value estimation?</p>';
} else {
    document.getElementById('min-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最小参考值">Minimum Value Reference: ' + minLocal + '</p>';
    document.getElementById('max-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="最大参考值">Maximum Value Reference: ' + (maxLocal + 1) + '</p>';
    document.getElementById('val-div').innerHTML += '<p data-toggle="tooltip" data-placement="bottom" title="请估计所表示数值">Value estimation?</p>';
}

function renderBars(value, color) {
    let barWidth = 20,
        minH = 1,
        maxH = 500,
        valH;
    let minLocalH = new LocalHeight(minLocal, maxH),
        maxLocalH = new LocalHeight(maxLocal, maxH),
        valLocalH = new LocalHeight(qVal, maxH);
    function renderBar(arg) {
        valH = minH + (value - qMin) / (qMax - qMin) * (maxH - minH);
        var bar = d3.select('#' + arg + '-svg')
                    .append('g')
                    .attr('id', arg + '-g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .append('rect')
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
    }
    function renderBarLocal(arg, color) {
        var bar = d3.select('#' + arg + '-svg')
                    .append('g')
                    .attr('id', arg + '-g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .append('rect')
                    .attr('id', arg + '-bar')
                    .attr('x', function() {
                        return (viewWidth - barWidth) / 2;
                    })
                    .attr('y', function() {
                        let height = eval(arg + 'LocalH');
                        return viewHeight - height.get() - margin.bottom;
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
              .style('background-color', fillColor);
        }
    }
    for (let i = 0; i < args.length; i++) {
        if (color == 0) {
            renderBar(args[i]);
        } else if (color == 1 || color == -1) {
            renderBarLocal(args[i], color);
        }
    }
    // console.log('rendered bar');
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
        return Math.pow(10, order(value)) - 1;
    }
}

function LocalHeight(value, maxH) {
    this.get = function() {
        let _min, _max, _minH, _height;
        _min = Math.pow(10, order(value) - 1);
        _max = Math.pow(10, order(value)) - 1;
        _minH = maxH * _min / _max;
        let scale = d3.scaleLinear().domain([_min, _max]).range([_minH, maxH]);
        _height = scale(value);
        return _height;
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
