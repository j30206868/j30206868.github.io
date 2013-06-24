/*
* Name: StackJS
* Description: Main Application Object	
*
*
*/

/*		Application Model		*/

/***********************************************************************************************************************/
/*												效能問題
										1.共用一組TextEditor, Anchor
										2.離開螢幕的圖用invisible
										3.圖背景漸層很吃效能
										4.侷限reDraw的範圍
											->將被focus的圖形加到一個特殊group, 只redraw那個group
										5.地圖變大 單一圖形變大對效能影響較小
										
										存檔功能
										1.幫shape寫一個save function
											->call的時候可以把所有需要被記錄的資訊轉成文字記錄起來
																													   */
/***********************************************************************************************************************/


/*		Application Object		*/
//使用decorator
var moveEvent;
var shapeCount = 0;
var canvasRange = {
	x:0,
	y:0,
	x2:1350,
	y2:660,
	scalePer:1	
};

var ShapeArray = [];

$(document).ready(function(e) {
	$(document).mousemove(function(e){
		moveEvent = e;
	});
	$(document).mousedown(function(e){
		//console.log(FlowAllChart.getPointerPosition());
	});
});

//
function cloneToMonitor(ShapeArray, _shape){
	
}

function reSizeMoniShape(_shapeGroup, _shape, _layer){
	var moniGroup = _layer.get("#moniShape_"+_shapeGroup.getId())[0];
	var moniShape = moniGroup.get("."+_shape.getName())[0];
	var moniText  = moniGroup.get(".TextArea")[0];
	moniGroup.setX(_shapeGroup.getX());
	moniGroup.setY(_shapeGroup.getY());
	moniGroup.setWidth(_shapeGroup.getWidth());
	moniGroup.setHeight(_shapeGroup.getHeight());
	if( chkIfSpeShape(_shape.getName()) ){
		moniShape.setX(_shape.getX());
		moniShape.setY(_shape.getY());
		moniShape.setRadius(_shape.getRadius());
		moniText.setWidth(_shapeGroup.getWidth());
		moniText.setHeight(_shapeGroup.getHeight());
	}else{
		moniShape.setWidth(_shape.getWidth());
		moniShape.setHeight(_shape.getHeight());
		moniText.setWidth(_shape.getWidth());
		moniText.setHeight(_shape.getHeight());
	}
	
	_layer.draw();
}

function reLocateMoniShape(_shapeGroup, _layer){
	var moniGroup = _layer.get("#moniShape_"+_shapeGroup.getId())[0];
	moniGroup.setX(_shapeGroup.getX());
	moniGroup.setY(_shapeGroup.getY());	
}

//updateBorder(range, x1, y1, width, height)
function updateBorder(range, x1, y1, width, height){
	if(range.x > x1){
		range.x = x1-100;
	}
	
	if(range.y > y1){
		range.y = y1-100;
	}
	
	if(range.x2 < (x1+width)){
		range.x2 = (x1+width)+100;
	}
	
	if(range.y2 < (y1+height)){
		range.y2 = (y1+height)+100;
	}
}

//updateScale(range)
function updateScale(range){
	var scaleX = 160/(range.x2 - range.x);
	var scaleY = 200/(range.y2- range.y);
	if(scaleX > scaleY){
		range.scalePer = scaleY;
	}else{
		range.scalePer = scaleX;
	}
}

//updateCanvasMonitor(range, _layer)
function updateCanvasMonitor(range, _layer){
	var monitor = _layer.get("#winMonitor")[0];
	var winScreen  = monitor.get("#winScreen")[0];
	winScreen.setX(range.x);
	winScreen.setY(range.y);
	winScreen.setWidth(range.x2 - range.x);
	winScreen.setHeight(range.y2 - range.y);
	monitor.setScale([range.scalePer, range.scalePer]);
	_layer.draw();
}

//FShape
Class('FShape', {
	shape 	: null,
	group 	: null,
	layer 	: null,
	textArea: null,
	FShape : function(shapeName, x1, y1, sWidth, sHeight, _layer){
		
		var _group = new Kinetic.Group({
			x:x1,
			y:y1,
			width:sWidth,
			height:sHeight,
			draggable : true,
			Name: shapeName+"G",
			Id  : shapeCount
		});
		shapeCount++;
		
		var _content = new Kinetic.Text({
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
		
		var _shape;
		if(shapeName == "triangle"){
			_shape = new Kinetic.RegularPolygon({
				x: 0,
				y: 0,
				sides: 4,
				radius: sWidth/2,
				stroke: 'black',
				strokeWidth: 3,
				Name: shapeName,
				draggable: false,
				fillLinearGradientStartPoint: [10, 10],
          		fillLinearGradientEndPoint: [100, 100],
         		fillLinearGradientColorStops: [0, '#eee', 1, '#bbb'],
				shadowColor: 'black',
				shadowBlur: 2,
				shadowOffset: 4,
				shadowOpacity: 0.5
			});
			_content.setText('\n\n\nCOMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.');
			
		}else if(shapeName == "rectangle"){
			_shape = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: sWidth,
				height: sHeight,
				stroke: 'black',
				strokeWidth: 3,
				Name: shapeName,
				draggable: false,
				fillLinearGradientStartPoint: [10, 10],
          		fillLinearGradientEndPoint: [120, 120],
         		fillLinearGradientColorStops: [0, '#eee', 1, '#bbb'],
				shadowColor: 'black',
				shadowBlur: 2,
				shadowOffset: 4,
				shadowOpacity: 0.5
			});
			_content.setText('COMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.');
		}
		
		_group.add(_shape);		_group.add(_content);	_layer.add(_group);
		this.group = _group;	this.shape = _shape;	this.layer = _layer;	this.textArea = _content;

		if( chkIfSpeShape(_shape.getName()) ){
			_group.setWidth( _shape.getRadius()*2 );		_group.setHeight( _shape.getRadius()*2 );
			_shape.setX( 0+_shape.getRadius() );	_shape.setY( 0+_shape.getRadius() );
		}else{
			_group.setWidth( _shape.getWidth() );	_group.setHeight( _shape.getHeight() );
		}
		
		addResizeAnchor(_shape, 'leftTop' , _layer);
		addResizeAnchor(_shape, 'leftBottom', _layer);
		addResizeAnchor(_shape, 'rightTop', _layer);
		addResizeAnchor(_shape, 'rightBottom', _layer);
		addBorderLine(_shape);
		AnchorShowAndHide(_shape, _layer);
		
		_group.setDragOnTop(false);
		this.initEvt();
		
		var tmp =_group.clone();
		var tmpSh = _shape.clone();
		var tmpText = _content.clone();
		tmp.removeChildren();
		tmp.setListening(false);
		tmp.add(tmpSh);
		tmp.add(tmpText);
		
		tmp.setDraggable(false);
		tmp.setId("moniShape_"+tmp.getId());
		
		_layer.get("#winMonitor")[0].add(tmp);
		updateBorder(canvasRange, x1, y1, sWidth, sHeight);
		updateScale(canvasRange);
		updateCanvasMonitor(canvasRange, _layer);
		_layer.draw();
		
	},
	destroy : function(){
		var objGroup = this.group;
		objGroup.removeChildren();
		objGroup.remove();
		this.layer.draw();
		
		this.layer = null;
		this.group = null;
		this.shape = null;
	},
	initEvt : function(){
		var _shape = this.shape;
		var _group = this.group;
		var _textArea = this.textArea;
		var _layer = this.layer;
		_group.on('dragend', function(){
			reLocateMoniShape(this, _layer);
			updateBorder(canvasRange, this.getX(), this.getY(), this.getWidth(), this.getHeight());
			updateScale(canvasRange);
			updateCanvasMonitor(canvasRange, _layer);
		});
		
		_group.on('dblclick', function(evt){
			AnchorShowAndHide(null, _layer);
			
			if($("#TextEditor").css("display") == "none"){
				$("#TextEditor")
				.css("left", _group.getX() + _layer.getX()+_textArea.getStrokeWidth() + "px")
				.css("top", _group.getY() + _layer.getY()+_textArea.getStrokeWidth() + "px")
				.css("width", _group.getWidth()-_textArea.getPadding()*2 + "px")
				.css("height", _group.getHeight()-_textArea.getPadding()*2 + "px")
				.css("color", _group.fill)
				.css("font-family", _textArea.getFontFamily())
				.css("font-size", _textArea.getFontSize())
				.css("font-style", _textArea.getFontStyle())
				.css("padding", _textArea.getPadding()-_textArea.getStrokeWidth() + "px")
				.css("text-align", _textArea.getAlign())
				.css("line-height", _textArea.getFontSize()*_textArea.getLineHeight()+"px")
				.css("text-shadow","#000 "+_textArea.getStrokeWidth()+"px " + _textArea.getStrokeWidth()+"px " + _textArea.getStrokeWidth()+"px ")
				.val(_textArea.getText())
				.css("display", "block")
				.trigger("focus");
				_textArea.setText("");
				TextOnFocus = 1;

				if( chkIfSpeShape(_shape.getName()) ){
					$("#TextEditor").css("outline","dotted #333333 2px");
				}else{
					$("#TextEditor").css("outline","none");
				}

				var textEditTimer = setInterval(function(){
					if(TextOnFocus == 0){
						_textArea.setText($("#TextEditor").val());
						_group.draw();
						$("#TextEditor").css("display", "none");
						clearInterval(textEditTimer);
					}
				}, 50);
			}
		});
		
		_group.on('mousedown', function(){
			if(this.get(".borderLine")[0].getVisible() == false){
				_group.moveToTop();
				_group.moveDown();
				AnchorShowAndHide(_shape, _layer);
			}
		});
	}
});

//WindowBoard
Class("WindowBoard",{
	group:null,
	layer:null,
	leftBoard:null,
	array:null,
	monitor:null,
	state:null,
	WindowBoard:function(_layer){	
		var _group = new Kinetic.Group({
			id : "WindowBoard"	
		});
		
		var _leftBoard = new Kinetic.Rect({
			x: -5,
			y: 10,
			stroke: '#555',
			strokeWidth: 5,
			fill: '#ddd',
			width: 300,
			height: 600,
			shadowColor: 'black',
			shadowBlur: 5,
			shadowOffset: [5, 5],
			shadowOpacity: 0.8,
			cornerRadius: 10
		});
		
		var BasicGraphDish = new Kinetic.Rect({
			x: 5,
			y: 20,
			fill: '#eee',
			stroke:'#555',
			strokeWidth:2,
			width: 275,
			height: 300,
			cornerRadius: 5
		});
		
		var stateBoard = new Kinetic.Rect({
			x:5,
			y:330,
		});
		
		this.group = _group;
		this.layer = _layer;
		this.leftBoard = _leftBoard;
		this.array = [];
		
		_group.add(_leftBoard);
		_group.add(BasicGraphDish);
		_layer.add(_group);
		
		this.initMonitor();
		
		this.state = new State();
	},
	moveToTop:function(){
		this.group.moveToTop();
		this.layer.draw();	
	},
	correctLocation:function(){
		this.group.setX(0-this.layer.getX());
		this.group.setY(0-this.layer.getY());
	},
	addModel:function(shapeModel){
		var _shapes = this.array;
		var _group = this.group;
		_shapes.push(shapeModel);
		_group.add(shapeModel);
	},
	arrangeShapes:function(){
		var _shapes = this.array;
		var _layer = this.layer;
		var _boardW = this.leftBoard.getWidth();
		var sX;
		var sY;
		
		var startX = 20;
		var startY = 40;
		var sWidth  = 70;
		var sHeight = 50;
		var sRadius = (sHeight+sWidth)/4;
		var intervalX=10;
		var intervalY=30;
		var limitWidth  =200;
		var limitHeight =500;

		var nowX = 20;
		var nowY = 40;
		for(i=0 ; i<_shapes.length ; i++){
			var	_shape = _shapes[i];
			
			_shape.setDraggable(true);
			
			if( chkIfSpeShape(_shape.getName()) ){
				_shape.setX(nowX+sRadius-5);
				_shape.setY(nowY+sRadius-5);
				_shape.setRadius(sRadius);
			}else{
				_shape.setX(nowX);
				_shape.setY(nowY);
				_shape.setWidth(sWidth);
				_shape.setHeight(sHeight);
			}
			nowX += sWidth+intervalX;
			if(nowX > limitWidth){
				nowX = startX;
				nowY += sHeight + intervalY;
			}
			
			//model drag event

			_shape.on("dragstart", function(){
				sX = this.getX();
				sY = this.getY();
			});
			_shape.on("dragend", function(){
				if(this.getX() > _boardW){
					if( chkIfSpeShape(this.getName()) ){
						var tmp = new FShape(this.getName(), this.getX() - this.getRadius() -_layer.getX(), this.getY() - this.getRadius() -_layer.getY(), this.getRadius()*2, this.getRadius()*2, _layer);
					}else{
						new FShape(this.getName(), this.getX()-_layer.getX(), this.getY()-_layer.getY(), this.getWidth(), this.getHeight(), _layer);
					}
				}
				
				this.setX(sX);
				this.setY(sY);
				this.getParent().draw();
			});			
		}	

		this.group.draw();
	},
	initMonitor:function(){
	
		this.monitor = new Kinetic.Group({
			x : 1150,
			y : 20,
			Id: "winMonitor",
			draggable:true,
			scale:[160/1350, 200/660]
		});
		
		var winScren = new Kinetic.Rect({
			x:0,
			y:0,
			width : 1350,
			height: 660,
			fill  :"#fff",
			stroke: 'black',
        	strokeWidth: 5,
			id	  : "winScreen"
		});
		
		this.monitor.add(winScren);
		this.group.add(this.monitor);
	}
});

Class("State", {
	value : null,
	
	state:function(){
		value = 1;	
	},
	
	getValue:function(){
		return value;
	},
	
	setValue:function(_value){
		this.value = _value;
	}	
});