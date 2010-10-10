/**
 * Ext.ux.Sparkline.js
 * v1.0
 * Contact: Daniel Gasparotto <daniel@dgaspar.com>
 *
 * jquery.sparkline.js adapted (and simplified) to work with ExtJS
 * obs:
 * - a grid plugin is also provided
 * - composite (superposed graphs) is broken
 * - lazy render (when visible) behavior is broken
 * ----------------------------------------------------
 *
 * The original copyright stuff:
*
* jquery.sparkline.js
*
* v1.5.1
* (c) Splunk, Inc
* Contact: Gareth Watts (gareth@splunk.com)
* http://omnipotent.net/jquery.sparkline/
*
* Generates inline sparkline charts from data supplied either to the method
* or inline in HTML
*
* Compatible with Internet Explorer 6.0+ and modern browsers equipped with the canvas tag
* (Firefox 2.0+, Safari, Opera, etc)
*
* License: New BSD License
*
* Copyright (c) 2010, Splunk Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
*
*     * Redistributions of source code must retain the above copyright notice,
*       this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright notice,
*       this list of conditions and the following disclaimer in the documentation
*       and/or other materials provided with the distribution.
*     * Neither the name of Splunk Inc nor the names of its contributors may
*       be used to endorse or promote products derived from this software without
*       specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
* OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
* SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
* OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
*
* Usage:
*  $(selector).sparkline(values, options)
*
* If values is undefined or set to 'html' then the data values are read from the specified tag:
*   <p>Sparkline: <span class="sparkline">1,4,6,6,8,5,3,5</span></p>
*   $('.sparkline').sparkline();
* There must be no spaces in the enclosed data set
*
* Otherwise values must be an array of numbers or null values
*    <p>Sparkline: <span id="sparkline1">This text replaced if the browser is compatible</span></p>
*    $('#sparkline1').sparkline([1,4,6,6,8,5,3,5])
*    $('#sparkline2').sparkline([1,4,6,null,null,5,3,5])
*
* For line charts, x values can also be specified:
*   <p>Sparkline: <span class="sparkline">1:1,2.7:4,3.4:6,5:6,6:8,8.7:5,9:3,10:5</span></p>
*    $('#sparkline1').sparkline([ [1,1], [2.7,4], [3.4,6], [5,6], [6,8], [8.7,5], [9,3], [10,5] ])
*
* Supported options:
*   lineColor - Color of the line used for the chart
*   fillColor - Color used to fill in the chart - Set to '' or false for a transparent chart
*   width - Width of the chart - Defaults to 3 times the number of values in pixels
*   height - Height of the chart - Defaults to the height of the containing element
*   chartRangeMin - Specify the minimum value to use for the Y range of the chart - Defaults to the minimum value supplied
*   chartRangeMax - Specify the maximum value to use for the Y range of the chart - Defaults to the maximum value supplied
*   chartRangeClip - Clip out of range values to the max/min specified by chartRangeMin and chartRangeMax
*   chartRangeMinX - Specify the minimum value to use for the X range of the chart - Defaults to the minimum value supplied
*   chartRangeMaxX - Specify the maximum value to use for the X range of the chart - Defaults to the maximum value supplied
*   composite - If true then don't erase any existing chart attached to the tag, but draw
*           another chart over the top - Note that width and height are ignored if an
*           existing chart is detected.
*
* There are 7 types of sparkline, selected by supplying a "type" option of 'line' (default),
* 'bar', 'tristate', 'bullet', 'discrete', 'pie' or 'box'
*    line - Line chart.  Options:
*       spotColor - Set to '' to not end each line in a circular spot
*       minSpotColor - If set, color of spot at minimum value
*       maxSpotColor - If set, color of spot at maximum value
*       spotRadius - Radius in pixels
*       lineWidth - Width of line in pixels
*       normalRangeMin
*       normalRangeMax - If set draws a filled horizontal bar between these two values marking the "normal"
*                      or expected range of values
*       normalRangeColor - Color to use for the above bar
*       defaultPixelsPerValue - Defaults to 3 pixels of width for each value in the chart
*
*   bar - Bar chart.  Options:
*       barColor - Color of bars for postive values
*       negBarColor - Color of bars for negative values
*       zeroColor - Color of bars with zero values
*       nullColor - Color of bars with null values - Defaults to omitting the bar entirely
*       barWidth - Width of bars in pixels
*       colorMap - Optional mappnig of values to colors to override the *BarColor values above
*                  can be an Array of values to control the color of individual bars
*       barSpacing - Gap between bars in pixels
*       zeroAxis - Centers the y-axis around zero if true
*
*   tristate - Charts values of win (>0), lose (<0) or draw (=0)
*       posBarColor - Color of win values
*       negBarColor - Color of lose values
*       zeroBarColor - Color of draw values
*       barWidth - Width of bars in pixels
*       barSpacing - Gap between bars in pixels
*       colorMap - Optional mappnig of values to colors to override the *BarColor values above
*                  can be an Array of values to control the color of individual bars
*
*   discrete - Options:
*       lineHeight - Height of each line in pixels - Defaults to 30% of the graph height
*       thesholdValue - Values less than this value will be drawn using thresholdColor instead of lineColor
*       thresholdColor
*
*   bullet - Values for bullet graphs msut be in the order: target, performance, range1, range2, range3, ...
*       options:
*       targetColor - The color of the vertical target marker
*       targetWidth - The width of the target marker in pixels
*       performanceColor - The color of the performance measure horizontal bar
*       rangeColors - Colors to use for each qualitative range background color
*
*   pie - Pie chart. Options:
*       sliceColors - An array of colors to use for pie slices
*       offset - Angle in degrees to offset the first slice - Try -90 or +90
*
*   box - Box plot. Options:
*       raw - Set to true to supply pre-computed plot points as values
*             values should be: low_outlier, low_whisker, q1, median, q3, high_whisker, high_outlier
*             When set to false you can supply any number of values and the box plot will
*             be computed for you.  Default is false.
*       showOutliers - Set to true (default) to display outliers as circles
*       outlierIRQ - Interquartile range used to determine outliers.  Default 1.5
*       boxLineColor - Outline color of the box
*       boxFillColor - Fill color for the box
*       whiskerColor - Line color used for whiskers
*       outlierLineColor - Outline color of outlier circles
*       outlierFillColor - Fill color of the outlier circles
*       spotRadius - Radius of outlier circles
*       medianColor - Line color of the median line
*       target - Draw a target cross hair at the supplied value (default undefined)
*
*
*
*   Examples:
*   $('#sparkline1').sparkline(myvalues, { lineColor: '#f00', fillColor: false });
*   $('.barsparks').sparkline('html', { type:'bar', height:'40px', barWidth:5 });
*   $('#tristate').sparkline([1,1,-1,1,0,0,-1], { type:'tristate' }):
*   $('#discrete').sparkline([1,3,4,5,5,3,4,5], { type:'discrete' });
*   $('#bullet').sparkline([10,12,12,9,7], { type:'bullet' });
*   $('#pie').sparkline([1,1,2], { type:'pie' });
*/

Ext.namespace('Ext.ux.Sparkline');

// IE doesn't provide an indexOf method for arrays :-(
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(entry) {
        for(var i=0, vlen=this.length; i<vlen; i++) {
            if (this[i] == entry)
                return i;
        }
        return -1;
    }
}

// Setup a very simple "virtual canvas" to make drawing the few shapes we need easier
if (Ext.isIE && !document.namespaces['v']) {
    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
}

function quartile(values, q) {
    if (q==2) {
        var vl2 = Math.floor(values.length/2);
        return values.length % 2 ? values[vl2] : (values[vl2]+values[vl2+1])/2;
    } else {
        var vl4 = Math.floor(values.length/4);
        return values.length % 2 ? (values[vl4*q]+values[vl4*q+1])/2 : values[vl4*q];
    }
};

var t = document.createElement('canvas');
Ext.hasCanvas = t.getContext!=undefined;

var vcanvas_base = function(){};
vcanvas_base.prototype = {

    drawShape : function(path, lineColor, fillColor, lineWidth) {
        alert('drawShape not implemented');
    },

    drawLine : function(x1, y1, x2, y2, lineColor, lineWidth) {
        return this.drawShape([ [x1,y1], [x2,y2] ], lineColor, lineWidth);
    },

    drawCircle : function(x, y, radius, lineColor, fillColor) {
        alert('drawCircle not implemented');
    },

    drawPieSlice : function(x, y, radius, startAngle, endAngle, lineColor, fillColor) {
        alert('drawPieSlice not implemented');
    },

    drawRect : function(x, y, width, height, lineColor, fillColor) {
        alert('drawRect not implemented');
    },

    getElement : function() {
        return this.canvas;
    },

    _insert : function(el, target) {
        Ext.fly(target).insertFirst(el);
    }
};

vcanvas_vml = Ext.extend(vcanvas_base, {

    constructor : function(width, height, target) {
        this.width = width;
        this.height = height;
        this.target = target;

        if (target[0]) target=target[0];
        target.vcanvas = this;
        this.canvas = document.createElement('span');
        //$(this.canvas).css({ display:'inline-block', position: 'relative', overflow:'hidden', width:width, height:height, margin:'0px', padding:'0px', verticalAlign: 'top'});
        this.canvas.style.display='inline-block';
        this.canvas.style.position = 'relative';
        this.canvas.style.overflow = 'hidden';
        this.canvas.style.width = width;
        this.canvas.style.height = height;
        this.canvas.style.margin = '0px';
        this.canvas.style.padding = '0px';
        this.canvas.style.verticalAlign = 'top';

        this._insert(this.canvas, target);
        this.pixel_height = Ext.fly(this.canvas).getHeight();
        this.pixel_width = Ext.fly(this.canvas).getWidth();
        this.canvas.width = this.pixel_width;
        this.canvas.height = this.pixel_height;
        var groupel = '<v:group coordorigin="0 0" coordsize="'+this.pixel_width+' '+this.pixel_height+'"'
                +' style="position:absolute;top:0;left:0;width:'+this.pixel_width+'px;height='+this.pixel_height+'px;"></v:group>';
        this.canvas.insertAdjacentHTML('beforeEnd', groupel);
        //this.group = $(this.canvas).children()[0];
        this.group = this.canvas.childNodes.item(0);
    },

    drawShape : function(path, lineColor, fillColor, lineWidth) {
        var vpath = [];
        for(var i=0, plen=path.length; i<plen; i++) {
            vpath[i] = ''+(path[i][0])+','+(path[i][1]);
        }
        var initial = vpath.splice(0,1);
        lineWidth = lineWidth == undefined ? 1 : lineWidth;
        var stroke = lineColor == undefined ? ' stroked="false" ' : ' strokeWeight="'+lineWidth+'" strokeColor="'+lineColor+'" ';
        var fill = fillColor == undefined ? ' filled="false"' : ' fillColor="'+fillColor+'" filled="true" ';
        var closed = vpath[0] == vpath[vpath.length-1] ? 'x ' : '';
        var vel = '<v:shape coordorigin="0 0" coordsize="'+this.pixel_width+' '+this.pixel_height+'" '
            + stroke
            + fill
            +' style="position:absolute;left:0px;top:0px;height:'+this.pixel_height+'px;width:'+this.pixel_width+'px;padding:0px;margin:0px;" '
            +' path="m '+initial+' l '+vpath.join(', ')+' '+closed+'e">'
            +' </v:shape>';
         this.group.insertAdjacentHTML('beforeEnd', vel);
    },

    drawCircle : function(x, y, radius, lineColor, fillColor) {
        x -= radius+1;
        y -= radius+1;
        var stroke = lineColor == undefined ? ' stroked="false" ' : ' strokeWeight="1" strokeColor="'+lineColor+'" ';
        var fill = fillColor == undefined ? ' filled="false"' : ' fillColor="'+fillColor+'" filled="true" ';
        var vel = '<v:oval '
            + stroke
            + fill
            +' style="position:absolute;top:'+y+'px; left:'+x+'px; width:'+(radius*2)+'px; height:'+(radius*2)+'px"></v:oval>';
        this.group.insertAdjacentHTML('beforeEnd', vel);

    },

    drawPieSlice : function(x, y, radius, startAngle, endAngle, lineColor, fillColor) {
        if (startAngle == endAngle) {
            return;  // VML seems to have problem when start angle equals end angle.
        }
        if ((endAngle - startAngle) == (2*Math.PI)) {
            startAngle = 0.0;  // VML seems to have a problem when drawing a full circle that doesn't start 0
            endAngle = (2*Math.PI);
        }

        var startx = x + Math.round(Math.cos(startAngle) * radius);
        var starty = y + Math.round(Math.sin(startAngle) * radius);
        var endx = x + Math.round(Math.cos(endAngle) * radius);
        var endy = y + Math.round(Math.sin(endAngle) * radius);

        // Prevent very small slices from being mistaken as a whole pie
        if (startx==endx && starty==endy && (endAngle-startAngle) < Math.PI)
            return;

        var vpath = [  x-radius, y-radius, x+radius, y+radius, startx, starty, endx, endy ];
        var stroke = lineColor == undefined ? ' stroked="false" ' : ' strokeWeight="1" strokeColor="'+lineColor+'" ';
        var fill = fillColor == undefined ? ' filled="false"' : ' fillColor="'+fillColor+'" filled="true" ';
        var vel = '<v:shape coordorigin="0 0" coordsize="'+this.pixel_width+' '+this.pixel_height+'" '
            + stroke
            + fill
            +' style="position:absolute;left:0px;top:0px;height:'+this.pixel_height+'px;width:'+this.pixel_width+'px;padding:0px;margin:0px;" '
            +' path="m '+x+','+y+' wa '+vpath.join(', ')+' x e">'
            +' </v:shape>';
         this.group.insertAdjacentHTML('beforeEnd', vel);
    },

    drawRect : function(x, y, width, height, lineColor, fillColor) {
        return this.drawShape( [ [x, y], [x, y+height], [x+width, y+height], [x+width, y], [x, y] ], lineColor, fillColor);
    }
});

var vcanvas_canvas = Ext.extend(vcanvas_base, {

    constructor : function(width, height, target) {

        this.width = width;
        this.height = height;
        this.target = target;

        this.canvas = document.createElement('canvas');
        if (target[0]) target=target[0];
        target.vcanvas = this;
        this.canvas = document.createElement('canvas');
        this.canvas.style.display='inline-block';
        this.canvas.width=width;
        this.canvas.height = height;
        this.canvas.style.verticalAlign = 'top';

        this._insert(this.canvas, target);
        //this.pixel_height = $(this.canvas).height();
        //this.pixel_width = $(this.canvas).width();
        this.pixel_height = Ext.fly(this.canvas).getHeight();
        this.pixel_width = Ext.fly(this.canvas).getWidth();
        this.canvas.width = this.pixel_width;
        this.canvas.height = this.pixel_height;
        //$(this.canvas).css({width: this.pixel_width, height: this.pixel_height});
        Ext.fly(this.canvas).applyStyles({width: this.pixel_width, height: this.pixel_height});

    },

    _getContext : function(lineColor, fillColor, lineWidth) {
        var context = this.canvas.getContext('2d');
        if (lineColor != undefined)
            context.strokeStyle = lineColor;
        context.lineWidth = lineWidth==undefined ? 1 : lineWidth;
        if (fillColor != undefined)
            context.fillStyle = fillColor;
        return context;
    },

    drawShape : function(path, lineColor, fillColor, lineWidth) {
        var context = this._getContext(lineColor, fillColor, lineWidth);
        context.beginPath();
        context.moveTo(path[0][0]+0.5, path[0][1]+0.5);
        for(var i=1, plen=path.length; i<plen; i++) {
            context.lineTo(path[i][0]+0.5, path[i][1]+0.5); // the 0.5 offset gives us crisp pixel-width lines
        }
        if (lineColor != undefined) {
            context.stroke();
        }
        if (fillColor != undefined) {
            context.fill();
        }
    },

    drawCircle : function(x, y, radius, lineColor, fillColor) {
        var context = this._getContext(lineColor, fillColor);
        context.beginPath();
        context.arc(x, y, radius, 0, 2*Math.PI, false);
        if (lineColor != undefined) {
            context.stroke();
        }
        if (fillColor != undefined) {
            context.fill();
        }
    },

    drawPieSlice : function(x, y, radius, startAngle, endAngle, lineColor, fillColor) {
        var context = this._getContext(lineColor, fillColor);
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, radius, startAngle, endAngle, false);
        context.lineTo(x, y);
        context.closePath();
        if (lineColor != undefined) {
            context.stroke();
        }
        if (fillColor) {
            context.fill();
        }
    },

    drawRect : function(x, y, width, height, lineColor, fillColor) {
        return this.drawShape([ [x,y], [x+width, y], [x+width, y+height], [x, y+height], [x, y] ], lineColor, fillColor);
    }

});

Ext.ux.Sparkline.pending = [];

/**
 * @class Ext.ux.Sparkline
 * @extends Ext.BoxComponent
 * <p>This class extends the Ext.BoxComponent Class to provide sparkline graphs
 * @constructor
 * @param {Object} config The config object
 * @xtype sparkline
 */
Ext.ux.Sparkline = Ext.extend(Ext.BoxComponent, {

    renderTo:null,
    type : 'line',
    lineColor : '#00f',
    fillColor : '#cdf',
    width : 'auto',
    height : 16,
    composite : false,
    values : [],

    initComponent : function() {
        this.defaultPixelsPerValue = 3;
        this.width = 'auto' == this.width ? this.values.length * this.defaultPixelsPerValue : this.width;
        Ext.ux.Sparkline.superclass.initComponent.call(this);
    },

    onRender : function(){
        this.autoEl = {cls: 'x-ux-sparkline'};
        Ext.ux.Sparkline.superclass.onRender.apply(this, arguments);
        return this[this.type].call(this);
    },

    simpledraw : function(width, height, use_existing) {

        if (use_existing && this.el[0].vcanvas) return this.el[0].vcanvas;
        if (width==undefined) width= this.el.getWidth(true);
        if (height==undefined) height=this.el.getHeight(true);

        if (Ext.hasCanvas) {
            return new vcanvas_canvas(width, height, this.el);
        } else if (Ext.isIE) {
            return new vcanvas_vml(width, height, this.el);
        } else {
            return false;
        }
    },

    //TODO
    sparkline_display_visible : function() {
        for (var i=pending.length-1; i>=0; i--) {
            var el = pending[i][0];
            debugger;
            if (Ext.fly(el).isVisible()) {
                pending[i][1].call(el);
                pending.splice(i, 1);
            }
        }
    },

    line : function() {

        Ext.applyIf(this, {
            spotColor : '#f80',
            spotRadius : 1.5,
            minSpotColor : '#f80',
            maxSpotColor : '#f80',
            lineWidth: 1,
            normalRangeMin : undefined,
            normalRangeMax : undefined,
            normalRangeColor : '#ccc',
            chartRangeMin : undefined,
            chartRangeMax : undefined,
            chartRangeMinX : undefined,
            chartRangeMaxX : undefined
        });
        var values = this.values;
        var xvalues = [], yvalues = [], yminmax = [];
        for (i = 0; i < values.length; i++) {
            var v = values[i];
            var isstr = typeof(values[i]) == 'string';
            var isarray = typeof(values[i]) == 'object' && values[i] instanceof Array;
            var sp = isstr && values[i].split(':');
            if (isstr && sp.length == 2) { // x:y
                xvalues.push(Number(sp[0]));
                yvalues.push(Number(sp[1]));
                yminmax.push(Number(sp[1]));
            } else if (isarray) {
                xvalues.push(values[i][0]);
                yvalues.push(values[i][1]);
                yminmax.push(values[i][1]);
            } else {
                xvalues.push(i);
                if (values[i] === null || values[i] == 'null') {
                    yvalues.push(null);
                } else {
                    yvalues.push(Number(values[i]));
                    yminmax.push(Number(values[i]));
                }
            }
        }
        if (this.xvalues) {
            xvalues = this.xvalues;
        }

        var maxy = Math.max.apply(Math, yminmax);
        var maxyval = maxy;
        var miny = Math.min.apply(Math, yminmax);
        var minyval = miny;

        var maxx = Math.max.apply(Math, xvalues);
        var maxxval = maxx;
        var minx = Math.min.apply(Math, xvalues);
        var minxval = minx;

        if (this.normalRangeMin != undefined) {
            if (this.normalRangeMin < miny)
                miny = this.normalRangeMin;
            if (this.normalRangeMax > maxy)
                maxy = this.normalRangeMax;
        }
        if (this.chartRangeMin != undefined && (this.chartRangeClip || this.chartRangeMin < miny)) {
            miny = this.chartRangeMin;
        }
        if (this.chartRangeMax != undefined && (this.chartRangeClip || this.chartRangeMax > maxy)) {
            maxy = this.chartRangeMax;
        }
        if (this.chartRangeMinX != undefined && (this.chartRangeClipX || this.chartRangeMinX < minx)) {
            minx = this.chartRangeMinX;
        }
        if (this.chartRangeMaxX != undefined && (this.chartRangeClipX || this.chartRangeMaxX > maxx)) {
            maxx = this.chartRangeMaxX;
        }
        var rangex = maxx - minx == 0 ? 1 : maxx - minx;
        var rangey = maxy - miny == 0 ? 1 : maxy - miny;
        var vl = yvalues.length - 1;

        if (vl < 1) {
            this.innerHTML = '';
            return;
        }

        var target = this.simpledraw(this.width, this.height, this.composite);
        if (target) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;
            var canvas_top = 0;
            var canvas_left = 0;

            if (this.spotRadius && (canvas_width < (this.spotRadius * 4) || canvas_height < (this.spotRadius * 4))) {
                this.spotRadius = 0;
            }
            if (this.spotRadius) {
                // adjust the canvas size as required so that spots will fit
                if (this.minSpotColor || (this.spotColor && yvalues[vl] == miny))
                    canvas_height -= Math.ceil(this.spotRadius);
                if (this.maxSpotColor || (this.spotColor && yvalues[vl] == maxy)) {
                    canvas_height -= Math.ceil(this.spotRadius);
                    canvas_top += Math.ceil(this.spotRadius);
                }
                if (this.minSpotColor || this.maxSpotColor && (yvalues[0] == miny || yvalues[0] == maxy)) {
                    canvas_left += Math.ceil(this.spotRadius);
                    canvas_width -= Math.ceil(this.spotRadius);
                }
                if (this.spotColor || (this.minSpotColor || this.maxSpotColor && (yvalues[vl] == miny || yvalues[vl] == maxy)))
                    canvas_width -= Math.ceil(this.spotRadius);
            }


            canvas_height--;
            if (this.normalRangeMin != undefined) {
                var ytop = canvas_top + Math.round(canvas_height - (canvas_height * ((this.normalRangeMax - miny) / rangey)));
                var height = Math.round((canvas_height * (this.normalRangeMax - this.normalRangeMin)) / rangey);
                target.drawRect(canvas_left, ytop, canvas_width, height, undefined, this.normalRangeColor);
            }

            var path = [];
            var paths = [path];
            for (var i = 0, vlen = yvalues.length; i < vlen; i++) {
                var x = xvalues[i], y = yvalues[i];
                if (y === null) {
                    if (i) {
                        if (yvalues[i - 1] !== null) {
                            path = [];
                            paths.push(path);
                        }
                    }
                } else {
                    if (y < miny) y = miny;
                    if (y > maxy) y = maxy;
                    if (!path.length) {
                        // previous value was null
                        path.push([canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + canvas_height]);
                    }
                    path.push([canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((y - miny) / rangey)))]);
                }
            }
            for (var i = 0, plen = paths.length; i < plen; i++) {
                path = paths[i];
                if (!path.length)
                    continue; // last value was null
                if (this.fillColor) {
                    path.push([path[path.length - 1][0], canvas_top + canvas_height - 1]);
                    target.drawShape(path, undefined, this.fillColor);
                    path.pop();
                }
                // if there's only a single point in this path, then we want to display it as a vertical line
                // which means we keep path[0]  as is
                if (path.length > 2) {
                    // else we want the first value
                    path[0] = [ path[0][0], path[1][1] ];
                }
                target.drawShape(path, this.lineColor, undefined, this.lineWidth);
            }
            if (this.spotRadius && this.spotColor) {
                target.drawCircle(canvas_left + Math.round(xvalues[xvalues.length - 1] * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((yvalues[vl] - miny) / rangey))), this.spotRadius, undefined, this.spotColor);
            }
            if (maxy != minyval) {
                if (this.spotRadius && this.minSpotColor) {
                    var x = xvalues[yvalues.indexOf(minyval)];
                    target.drawCircle(canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((minyval - miny) / rangey))), this.spotRadius, undefined, this.minSpotColor);
                }
                if (this.spotRadius && this.maxSpotColor) {
                    var x = xvalues[yvalues.indexOf(maxyval)];
                    target.drawCircle(canvas_left + Math.round((x - minx) * (canvas_width / rangex)), canvas_top + Math.round(canvas_height - (canvas_height * ((maxyval - miny) / rangey))), this.spotRadius, undefined, this.maxSpotColor);
                }
            }
        } else {
            // Remove the tag contents if sparklines aren't supported
            this.el.dom.innerHTML = '';
        }
        return this.el.dom.innerHTML;
    },

    discrete : function() {
        //values = $.map(values, Number);
        Ext.applyIf(this, {
            lineHeight: 'auto',
            thresholdColor: undefined,
            thresholdValue : 0,
            chartRangeMax: undefined,
            chartRangeMin: undefined,
            chartRangeClip: false
        });
        var values = this.values;

        var width = this.width=='auto' ? values.length*2 : this.width;
        var interval = Math.floor(width / values.length);

        var target = this.simpledraw(width, this.height, this.composite);
        if (target) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;
            var line_height = this.lineHeight == 'auto' ? Math.round(canvas_height * 0.3) : this.lineHeight;
            var pheight = canvas_height - line_height;
            var min = Math.min.apply(Math, values);
            var max = Math.max.apply(Math, values);
            if (this.chartRangeMin!=undefined && (this.chartRangeClip || this.chartRangeMin<min)) {
                min = this.chartRangeMin;
            }
            if (this.chartRangeMax!=undefined && (this.chartRangeClip  || this.chartRangeMax>max)) {
                max = this.chartRangeMax;
            }
            var range = max-min;

            for(var i=0, vlen=values.length; i<vlen; i++) {
                var val = values[i];
                if (val < min) val=min;
                if (val > max) val=max;
                var x = (i*interval);
                var ytop = Math.round(pheight-pheight*((val-min)/range));
                target.drawLine(x, ytop, x, ytop+line_height, (this.thresholdColor && val < this.thresholdValue) ? this.thresholdColor : this.lineColor);
            }
        }  else {
            // Remove the tag contents if sparklines aren't supported
            this.innerHTML = '';
        }

    },

    bar : function() {

        Ext.applyIf(this, {
            type : 'bar',
            barColor : '#00f',
            negBarColor : '#f44',
            zeroColor: undefined,
            nullColor: undefined,
            zeroAxis : undefined,
            barWidth : 4,
            barSpacing : 1,
            chartRangeMax: undefined,
            chartRangeMin: undefined,
            chartRangeClip: false,
            colorMap : undefined
        });

        var values = this.values;
        var width = (values.length * this.barWidth) + ((values.length-1) * this.barSpacing);
        var num_values = [];
        for(var i=0, vlen=values.length; i<vlen; i++) {
            if (values[i]=='null' || values[i]===null) {
                values[i] = null;
            } else {
                values[i] = Number(values[i]);
                num_values.push(Number(values[i]));
            }
        }
        var max = Math.max.apply(Math, num_values);
        var min = Math.min.apply(Math, num_values);
        if (this.chartRangeMin!=undefined && (this.chartRangeClip || this.chartRangeMin<min)) {
            min = this.chartRangeMin;
        }
        if (this.chartRangeMax!=undefined && (this.chartRangeClip || this.chartRangeMax>max)) {
            max = this.chartRangeMax;
        }
        if (this.zeroAxis == undefined) this.zeroAxis = min<0;
        var range = max-min == 0 ? 1 : max-min;

        if (Ext.isArray(this.colorMap)) {
            var colorMapByIndex = this.colorMap;
            var colorMapByValue = null;
        } else {
            var colorMapByIndex = null;
            var colorMapByValue = this.colorMap;
        }

        var target = this.simpledraw(this.width, this.height, this.composite);
        if (target) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;
            var yzero = min<0 && this.zeroAxis ? canvas_height-Math.round(canvas_height * (Math.abs(min)/range))-1 : canvas_height-1;

            for(var i=0, vlen=values.length; i<vlen; i++) {
                var x = i*(this.barWidth+this.barSpacing);
                var val = values[i];
                if (val===null) {
                    if (this.nullColor) {
                        color = this.nullColor;
                        val = (this.zeroAxis && min<0) ? 0 : min;
                        var height = 1;
                        var y = (this.zeroAxis && min<0) ? yzero : canvas_height - height;
                    } else {
                        continue;
                    }
                } else {
                    if (val < min) val=min;
                    if (val > max) val=max;
                    var color = (val < 0) ? this.negBarColor : this.barColor;
                    if (this.zeroAxis && min<0) {
                        var height = Math.round(canvas_height*((Math.abs(val)/range)))+1;
                        var y = (val < 0) ? yzero : yzero-height;
                    } else {
                        var height = Math.round(canvas_height*((val-min)/range))+1;
                        var y = canvas_height-height;
                    }
                    if (val==0 && this.zeroColor!=undefined) {
                        color = this.zeroColor;
                    }
                    if (colorMapByValue && colorMapByValue[val]) {
                        color = colorMapByValue[val];
                    } else if (colorMapByIndex && colorMapByIndex.length>i) {
                        color = colorMapByIndex[i];
                    }
                    if (color===null) {
                        continue;
                    }
                }
                target.drawRect(x, y, this.barWidth-1, height-1, color, color);
            }
        } else {
            // Remove the tag contents if sparklines aren't supported
            this.innerHTML = '';
        }
    },


    bullet : function() {
        //values = $.map(values, Number);
        // target, performance, range1, range2, range3
        Ext.applyIf(this, {
            targetColor : 'red',
            targetWidth : 3, // width of the target bar in pixels
            performanceColor : 'blue',
            rangeColors : ['#D3DAFE', '#A8B6FF', '#7F94FF' ],
            base : undefined // set this to a number to change the base start number
        });

        var values = this.values;
        var width = this.width=='auto' ? '4.0em' : this.width;
        var height = this.height;
        var target = this.simpledraw(width, this.height, this.composite);
        if (target && values.length>1) {
            var canvas_width = target.pixel_width-Math.ceil(this.targetWidth/2);
            var canvas_height = target.pixel_height;

            var min = Math.min.apply(Math, values);
            var max = Math.max.apply(Math, values);
            if (this.base == undefined) {
                var min = min < 0 ? min : 0;
            } else {
                min = this.base;
            }
            var range = max-min;

            // draw range values
            for(i=2, vlen=values.length; i<vlen; i++) {
                var rangeval = parseInt(values[i]);
                var rangewidth = Math.round(canvas_width*((rangeval-min)/range));
                target.drawRect(0, 0, rangewidth-1, canvas_height-1, this.rangeColors[i-2], this.rangeColors[i-2]);
            }

            // draw the performance bar
            var perfval = parseInt(values[1]);
            var perfwidth = Math.round(canvas_width*((perfval-min)/range));
            target.drawRect(0, Math.round(canvas_height*0.3), perfwidth-1, Math.round(canvas_height*0.4)-1, this.performanceColor, this.performanceColor);

            // draw the target linej
            var targetval = parseInt(values[0]);
            var x = Math.round(canvas_width*((targetval-min)/range)-(this.targetWidth/2));
            var targettop = Math.round(canvas_height*0.10);
            var targetheight = canvas_height-(targettop*2);
            target.drawRect(x, targettop, this.targetWidth-1, targetheight-1, this.targetColor, this.targetColor);
        }  else {
            // Remove the tag contents if sparklines aren't supported
            this.innerHTML = '';
        }
    },


    tristate : function() {
        //values = $.map(values, Number);
        Ext.applyIf(this,{
            barWidth : 4,
            barSpacing : 1,
            posBarColor: '#6f6',
            negBarColor : '#f44',
            zeroBarColor : '#999',
            colorMap : {}
        });

        var values = this.values;
        var width = (values.length * this.barWidth) + ((values.length-1) * this.barSpacing);

        if (Ext.isArray(this.colorMap)) {
            var colorMapByIndex = this.colorMap;
            var colorMapByValue = null;
        } else {
            var colorMapByIndex = null;
            var colorMapByValue = this.colorMap;
        }

        var target = this.simpledraw(width, this.height, this.composite);
        if (target) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;
            var half_height = Math.round(canvas_height/2);

            for(var i=0, vlen=values.length; i<vlen; i++) {
                var x = i*(this.barWidth+this.barSpacing);
                if (values[i] < 0) {
                    var y = half_height;
                    var height = half_height-1;
                    var color = this.negBarColor;
                } else if (values[i] > 0) {
                    var y = 0;
                    var height = half_height-1;
                    var color = this.posBarColor;
                } else {
                    var y = half_height-1;
                    var height = 2;
                    var color = this.zeroBarColor;
                }
                if (colorMapByValue && colorMapByValue[values[i]]) {
                    color = colorMapByValue[values[i]];
                } else if (colorMapByIndex && colorMapByIndex.length>i) {
                    color = colorMapByIndex[i];
                }
                if (color===null) {
                    continue;
                }
                target.drawRect(x, y, this.barWidth-1, height-1, color, color);
            }
        } else {
            // Remove the tag contents if sparklines aren't supported
            this.innerHTML = '';
        }
    },

    pie : function() {
        //values = $.map(values, Number);
        Ext.applyIf(this,{
            sliceColors : ['#f00', '#0f0', '#00f']
        });
        var values = this.values;
        var width = this.width=='auto' ? this.height : this.width;

        var target = this.simpledraw(width, this.height, this.composite);
        if (target && values.length>1) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;

            var radius = Math.floor(Math.min(canvas_width, canvas_height)/2);
            var total = 0;
            for(var i=0, vlen=values.length; i<vlen; i++)
                total += values[i];
            var next = 0;
            if (this.offset) {
                next += (2*Math.PI)*(this.offset/360);
            }
            var circle = 2*Math.PI;
            for(var i=0, vlen=values.length; i<vlen; i++) {
                var start = next;
                var end = next;
                if (total > 0) {  // avoid divide by zero
                    end = next + (circle*(values[i]/total));
                }
                target.drawPieSlice(radius, radius, radius, start, end, undefined, this.sliceColors[i % this.sliceColors.length]);
                next = end;
            }
        }
    },


    box : function() {
        //values = $.map(values, Number);
        Ext.applyIf(this,{
            raw: false,
            boxLineColor: 'black',
            boxFillColor: '#cdf',
            whiskerColor: 'black',
            outlierLineColor: '#333',
            outlierFillColor: 'white',
            medianColor: 'red',
            showOutliers: true,
            outlierIQR: 1.5,
            spotRadius: 1.5,
            target: undefined,
            targetColor: '#4a2',
            chartRangeMax: undefined,
            chartRangeMin: undefined
        });

        var width = this.width=='auto' ? '4.0em' : this.width;
        var values = this.values;

        minvalue = this.chartRangeMin==undefined ? Math.min.apply(Math, values) : this.chartRangeMin;
        maxvalue = this.chartRangeMax==undefined ? Math.max.apply(Math, values) : this.chartRangeMax;
        var target = this.simpledraw(width, this.height, this.composite);
        if (target && values.length>1) {
            var canvas_width = target.pixel_width;
            var canvas_height = target.pixel_height;
            if (this.raw) {
                if (this.showOutliers && values.length>5) {
                    var loutlier=values[0], lwhisker=values[1], q1=values[2], q2=values[3], q3=values[4], rwhisker=values[5], routlier=values[6];
                } else {
                    var lwhisker=values[0], q1=values[1], q2=values[2], q3=values[3], rwhisker=values[4];
                }
            } else {
                values.sort(function(a, b) { return a-b; });
                var q1 = quartile(values, 1);
                var q2 = quartile(values, 2);
                var q3 = quartile(values, 3);
                var iqr = q3-q1;
                if (this.showOutliers) {
                    var lwhisker=undefined, rwhisker=undefined;
                    for(var i=0, vlen=values.length; i<vlen; i++) {
                        if (lwhisker==undefined && values[i] > q1-(iqr*this.outlierIQR))
                            lwhisker = values[i];
                        if (values[i] < q3+(iqr*this.outlierIQR))
                            rwhisker = values[i];
                    }
                    var loutlier = values[0];
                    var routlier = values[values.length-1];
                } else {
                    var lwhisker = values[0];
                    var rwhisker = values[values.length-1];
                }
            }

            var unitsize = canvas_width / (maxvalue-minvalue+1);
            var canvas_left = 0;
            if (this.showOutliers) {
                canvas_left = Math.ceil(this.spotRadius);
                canvas_width -= 2*Math.ceil(this.spotRadius);
                var unitsize = canvas_width / (maxvalue-minvalue+1);
                if (loutlier < lwhisker)
                    target.drawCircle((loutlier-minvalue)*unitsize+canvas_left, canvas_height/2, this.spotRadius, this.outlierLineColor, this.outlierFillColor);
                if (routlier > rwhisker)
                    target.drawCircle((routlier-minvalue)*unitsize+canvas_left, canvas_height/2, this.spotRadius, this.outlierLineColor, this.outlierFillColor);
            }

            // box
            target.drawRect(
                Math.round((q1-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height*0.1),
                Math.round((q3-q1)*unitsize),
                Math.round(canvas_height*0.8),
                this.boxLineColor,
                this.boxFillColor);
            // left whisker
            target.drawLine(
                Math.round((lwhisker-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height/2),
                Math.round((q1-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height/2),
                this.lineColor);
            target.drawLine(
                Math.round((lwhisker-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height/4),
                Math.round((lwhisker-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height-canvas_height/4),
                this.whiskerColor);
            // right whisker
            target.drawLine(Math.round((rwhisker-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height/2),
                Math.round((q3-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height/2),
                this.lineColor);
            target.drawLine(
                Math.round((rwhisker-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height/4),
                Math.round((rwhisker-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height-canvas_height/4),
                this.whiskerColor);
            // median line
            target.drawLine(
                Math.round((q2-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height*0.1),
                Math.round((q2-minvalue)*unitsize+canvas_left),
                Math.round(canvas_height*0.9),
                this.medianColor);
            if (this.target) {
                var size = Math.ceil(this.spotRadius);
                target.drawLine(
                    Math.round((this.target-minvalue)*unitsize+canvas_left),
                    Math.round((canvas_height/2)-size),
                    Math.round((this.target-minvalue)*unitsize+canvas_left),
                    Math.round((canvas_height/2)+size),
                    this.targetColor);
                target.drawLine(
                    Math.round((this.target-minvalue)*unitsize+canvas_left-size),
                    Math.round(canvas_height/2),
                    Math.round((this.target-minvalue)*unitsize+canvas_left+size),
                    Math.round(canvas_height/2),
                    this.targetColor);
            }
        }  else {
            // Remove the tag contents if sparklines aren't supported
            this.innerHTML = '';
        }
    }
});
Ext.reg('sparkline', Ext.ux.Sparkline);

/**
 * @clss Ext.ux.Sparkline.GridPlugin
 * GridPanel plugin that redraws the grid's sparklines on [viewready, columnresize, refresh] events
 */
Ext.ux.Sparkline.GridPlugin = (function() {
    return {
        init: function(grid) {
            var sparkRefresh = function(){
                var cm = this.getColumnModel();
                var cmlen = cm.getColumnCount();
                for (i = 0; i < cmlen; i++) {
                    var col = cm.getColumnAt(i);
                    if(cm.config[i].xtype=='sparklinecolumn'){
                        var celllen = this.getStore().getTotalCount();
                        for (j = 0; j < celllen; j++) {
                            var cell = this.view.getCell(j, i);
                            cell.innerHTML = '';
                            var cfg = {};
                            Ext.apply(cfg, this.store.getAt(j).data[col.dataIndex], {
                                renderTo:cell,
                                width: this.view.cm.getColumnWidth(i)
                            });
                            Ext.applyIf(cfg,cm.config[i].sparkline||{});
                            new Ext.ux.Sparkline(cfg);
                        }
                    }
                }
            };
            grid.on('viewready',sparkRefresh,grid);
            grid.on('columnresize',sparkRefresh,grid);
            grid.getView().on('refresh',sparkRefresh,grid);
        }
    };
});


/**
 * @class Ext.grid.SparklineColumn
 * @extends Ext.grid.Column
 * <p>This class extends the Ext.grid.Column Class to provide sparklines in Ext.grid.GridPanel columns
 * <p>It has a dummy render and tells the plugin that it should render graphs in this column
 * @constructor
 * @param {Object} config The config object
 * @xtype sparklinecolumn
 */
Ext.grid.SparklineColumn = Ext.extend(Ext.grid.Column, {
    constructor: function(cfg){
        Ext.grid.SparklineColumn.superclass.constructor.call(this, cfg);
        this.renderer = function(value, metaData, record, rowIndex, colIndex, store){
            return '&#160;';
        };
    }
});
Ext.grid.Column.types.sparklinecolumn = Ext.grid.SparklineColumn;

//Ext.util.Observable.prototype.fireEvent = Ext.util.Observable.prototype.fireEvent.createInterceptor(function() {console.log(arguments);return true;});