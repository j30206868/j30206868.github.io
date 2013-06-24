// JavaScript Document
var sWidth = 300;
var sHeight= 100;
var sRadius= sWidth/2;

var Rhombus_tpl = new Kinetic.RegularPolygon({
	x: 0,
	y: 0,
	sides: 4,
	radius: sRadius,
	stroke: 'black',
	strokeWidth: 3,
	Name: "Rhombus",
	draggable: false,
	fillLinearGradientStartPoint: [10, 10],
	fillLinearGradientEndPoint: [100, 100],
	fillLinearGradientColorStops: [0, '#eee', 1, '#bbb'],
	shadowColor: 'black',
	shadowBlur: 2,
	shadowOffset: 4,
	shadowOpacity: 0.5,
});

var Rectangle_tpl= new Kinetic.Rect({
	x: 0,
	y: 0,
	width: sWidth,
	height: sHeight,
	stroke: 'black',
	strokeWidth: 3,
	Name: "Rectangle",
	draggable: false,
	fillLinearGradientStartPoint: [10, 10],
	fillLinearGradientEndPoint: [120, 120],
	fillLinearGradientColorStops: [0, '#eee', 1, '#bbb'],
	shadowColor: 'black',
	shadowBlur: 2,
	shadowOffset: 4,
	shadowOpacity: 0.5
});

var Text_tpl = new Kinetic.Text({
	x: 0,
	y: 0,
	fontSize: 10,
	fontFamily: 'Calibri',
	fill: '#555',
	width: sWidth,
	height:sHeight,
	padding: 20,
	lineHeight: 1.15,
	align: 'center',
	strokeWidth:1,
	Name: "TextArea"
});