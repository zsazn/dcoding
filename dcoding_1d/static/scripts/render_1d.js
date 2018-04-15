'use strict';

$('#answer-modal').modal('hide');

var svgWidth = document.getElementById('min-div').clientWidth - 1;
var svgHeight = svgWidth;
var legendWidth = svgWidth;
var legendHeight = 80;
var margin = {'top': 10, 'bottom': 20, 'left': 10, 'right': 10};

const orders = [1, 2, 3, 4];

const viewWidth = 600,
      viewHeight = 600;

const minColor = '#d4e4f4',
      maxColor = '#08306b';
let colorLinearScale = d3.interpolate(d3.rgb(minColor), d3.rgb(maxColor));
let colorOrdinalScale = d3.scaleOrdinal()
                          .domain(orders)
                          .range([minColor,
                                  colorLinearScale(0.33),
                                  colorLinearScale(0.67),
                                  maxColor]);

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
    if (qDimension.indexOf('global') != -1) {
        text = {'min': 'Minimum Value Reference: <span><u><i>20</i></u></span>',
                'max': 'Maximum Value Reference: <span><u><i>' + qMax.toString() + '</i></u></span>',
                'val': 'Value Estimation?'};
    } else {
        text = {'min': 'Minimum Value Reference: <span><u><i>' + minLocal.toString() + '</i></u></span>',
                'max': 'Maximum Value Reference: <span><u><i>' + (maxLocal + 1).toString() + '</i></u></span>',
                'val': 'Value Estimation?'};
            }
    p.innerHTML = text[arg];
    document.getElementById(arg + '-div').appendChild(p);
}

$(window).resize(function() {
    svgWidth = $('#min-div').width() - 1;
    svgHeight = svgWidth;
});

function render(dimension, value) {
    let colorOption = {'color': 1, 'bg_color': -1};
    let extremeOption = {'global': 0, 'local': 1};
    switch(dimension) {
        case 'length_global':
            renderBars(value, extremeOption.global, colorOption.color);
            renderLegend();
            break;
        case 'length_local':
            renderBars(value, extremeOption.local, colorOption.color);
            renderLegend();
            break;
        case 'length_global_background_color':
            renderBars(value, extremeOption.global, colorOption.bg_color);
            renderLegend();
            break;
        case 'length_local_background_color':
            renderBars(value, extremeOption.local, colorOption.bg_color);
            renderLegend();
            break;
        default:
            console.log('why default???');
            break;
    }
    return 1;
}

function renderBars(value, extreme, color) {
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

    document.getElementById('min-svg').setAttribute('viewBox', '0 0 600 600');
    document.getElementById('max-svg').setAttribute('viewBox', '0 0 600 600');
    document.getElementById('val-svg').setAttribute('viewBox', '0 0 600 600');

    let min = qMin,
        max = qMax,
        val = value;

    let barWidth = 5,
        minH = 1,
        maxH = 500,
        valH;
    if (value < 20) {
        valH = 20;
    } else {
        valH = Math.floor(value / 20) * minH;
    }
    let minLocalH = new LocalHeight(minLocal, maxH),
        maxLocalH = new LocalHeight(maxLocal, maxH),
        valLocalH = new LocalHeight(qVal, maxH);
    function renderBar(arg) {
        let data = eval(arg);
        let fillColor = colorOrdinalScale(order(data) - 1);

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
                    .attr('fill', fillColor);
        if (color == -1) {
            bar.attr('fill', '#000000');
            d3.select('#' + arg + '-svg')
              .style('background-color', fillColor);
        }
    }
    function renderBarLocal(arg, color) {
        let fillColor = colorOrdinalScale(order(value));

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
                    .attr('fill', fillColor);
        if (color == -1) {
            bar.attr('fill', '#000000');
            d3.select('#' + arg + '-svg')
              .style('background-color', fillColor);
        }
    }
    for (let i = 0; i < args.length; i++) {
        if (extreme == 0) {
            renderBar(args[i]);
        } else if (extreme == 1) {
            renderBarLocal(args[i], color);
        }
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
                   .attr('transform', 'translate(100,0)');
    document.getElementById('legend-svg').setAttribute('viewBox', '0 0 600 100');
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
