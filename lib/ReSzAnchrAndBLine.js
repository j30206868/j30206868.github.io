function chkIfSpeShape(shapeName){
	if(shapeName == "triangle"){
		return true;
	}
	return false;
}
function addResizeAnchor(obj, position, layerAll){
	var tmpResizeAnchor; 
	var objGroup = obj.getParent();
	var rads = 5;
	var OriginStrW = 2;
	var BiggerStrW = 2;
	var x1 = objGroup.getX();
	var y1 = objGroup.getY();
	var x2 = objGroup.getX() + objGroup.getWidth();
	var y2 = objGroup.getY() + objGroup.getHeight();
	
	//宣告锚點
	switch(position){
		case 'leftTop':
			tmpResizeAnchor = new Kinetic.Circle({
				x: 0,
				y: 0
			});
			break;
		case 'rightBottom':
			tmpResizeAnchor = new Kinetic.Circle({
				x: x2-x1,
				y: y2-y1
			});
			break;
		case 'rightTop':
			tmpResizeAnchor = new Kinetic.Circle({
				x: x2-x1,
				y: 0
			});
			break;
		case 'leftBottom':
			tmpResizeAnchor = new Kinetic.Circle({
				x: 0,
				y: y2-y1
			});
			break;
	}
	
	//設定樣式
	tmpResizeAnchor.setRadius(rads);
	tmpResizeAnchor.setFill('#eee');
	tmpResizeAnchor.setStroke('black');
	tmpResizeAnchor.setStrokeWidth(OriginStrW);
	tmpResizeAnchor.setName(position);

	//加入群組中
	objGroup.add(tmpResizeAnchor);

	resizeAnchorEvt(obj, tmpResizeAnchor, layerAll);
};

function resizeAnchorEvt(obj, tmpResizeAnchor, layerAll){
	var objGroup = obj.getParent();
	var anchorTimer;
	
	//滑鼠經過 變粗
	tmpResizeAnchor.on('mouseenter',function(e){
		if(this.getName() == 'leftTop' || this.getName() == 'rightBottom'){
			document.body.style.cursor = 'nw-resize';
		}else{
			document.body.style.cursor = 'ne-resize';
		}
	});
	tmpResizeAnchor.on('mouseleave',function(e){
		document.body.style.cursor = '';
	});
	
	//	設定Resize的托拉動作
	tmpResizeAnchor.on("mousedown",function(e){
		var movedAnchor = this; 
		objGroup.setDraggable(false);

		if(tmpResizeAnchor.getName() == 'leftTop'){
			//objGroup有隨頁面位移 從原點算起的位置
			//moveEvent是不隨頁面位移的 需加上位移
			var x2 = objGroup.getX() + objGroup.getWidth();
			var y2 = objGroup.getY() + objGroup.getHeight();
			
			anchorTimer = window.setInterval(function(){
				document.body.style.cursor = 'nw-resize';	
				var x1 = moveEvent.pageX - layerAll.getX();
				var y1 = moveEvent.pageY - layerAll.getY();		
				
				//形狀必須保持正方形
				if( chkIfSpeShape(obj.getName()) ){
					var xDisplace = x2 - x1;
					var yDisplace = y2 - y1;	
					if(xDisplace >= yDisplace){
						y1 = y2 - x2 + x1;
					}else{
						x1 = x2 - y2 + y1;
					}
				}

				resizeShape(obj, objGroup, x1, y1, x2, y2);
				layerAll.draw();
			},50);
		}else if(tmpResizeAnchor.getName() == 'leftBottom'){
			var x2 = objGroup.getX() + objGroup.getWidth();
			var y1 = objGroup.getY();
			
			anchorTimer = window.setInterval(function(){
				document.body.style.cursor = 'ne-resize';
				var x1 = moveEvent.pageX - layerAll.getX();
				var y2 = moveEvent.pageY - layerAll.getY();

				//形狀必須保持正方形
				if( chkIfSpeShape(obj.getName()) ){
					var xDisplace = x2 - x1;
					var yDisplace = y2 - y1;
					if(xDisplace >= yDisplace){
						y2 = x2 - x1 + y1;
					}else{
						x1 = x2 - y2 + y1;
					}
				}

				resizeShape(obj, objGroup, x1, y1, x2, y2);
				layerAll.draw();
			},50);
		}else if(tmpResizeAnchor.getName() == 'rightTop'){
			var x1 = objGroup.getX();
			var y2 = objGroup.getY() + objGroup.getHeight();
			
			anchorTimer = window.setInterval(function(){	
				document.body.style.cursor = 'ne-resize';
				var x2 = moveEvent.pageX - layerAll.getX();
				var y1 = moveEvent.pageY - layerAll.getY();

				//形狀必須保持正方形
				if( chkIfSpeShape(obj.getName()) ){
					var xDisplace = x2 - x1;
					var yDisplace = y2 - y1;
					if(xDisplace >= yDisplace){
						y1 = y2 + x1 - x2;
					}else{
						x2 = x1 + y2 - y1;
					}
				}

				resizeShape(obj, objGroup, x1, y1, x2, y2);
				layerAll.draw();
			},50);
		}else if(tmpResizeAnchor.getName() == 'rightBottom'){
			var x1 = objGroup.getX();
			var y1 = objGroup.getY();
			
			anchorTimer = window.setInterval(function(){	
				document.body.style.cursor = 'nw-resize';
				var x2 = moveEvent.pageX - layerAll.getX();
				var y2 = moveEvent.pageY - layerAll.getY();

				//形狀必須保持正方形
				if( chkIfSpeShape(obj.getName()) ){
					var xDisplace = x2 - x1;
					var yDisplace = y2 - y1;
					if(xDisplace >= yDisplace){
						y2 = y1 + x2 - x1;
					}else{
						x2 = x1 + y2 - y1;
					}
				}

				resizeShape(obj, objGroup, x1, y1, x2, y2);
				layerAll.draw();
			},50);
		}
	});
	
	$(document).mouseup(function(e){
		clearInterval(anchorTimer);	
		reSizeMoniShape(objGroup, obj, layerAll);
		objGroup.setDraggable(true);
		document.body.style.cursor = '';
	});	
}

function AnchorShowAndHide(obj, layerAll){
	var leftTops = layerAll.get('.leftTop');	
	var rightBottoms = layerAll.get('.rightBottom');	
	var leftBottoms = layerAll.get('.leftBottom');	
	var rightTops = layerAll.get('.rightTop');	
	var borderLines = layerAll.get('.borderLine');	
	var clickedObj = obj;
	
	leftTops.each(function(node){
		this.hide();	
	});
	rightBottoms.each(function(node){
		this.hide();	
	});
	leftBottoms.each(function(node){
		this.hide();	
	});
	rightTops.each(function(node){
		this.hide();	
	});
	borderLines.each(function(node){
		this.hide();	
	});
	
	if(obj != null){
		var leftTop = clickedObj.getParent().get('.leftTop');	
		var rightBottom = clickedObj.getParent().get('.rightBottom');	
		var leftBottom = clickedObj.getParent().get('.leftBottom');	
		var rightTop = clickedObj.getParent().get('.rightTop');	
		var borderLine = clickedObj.getParent().get('.borderLine');	
		
		leftTop.each(function(node){
			this.show();	
		});
		rightBottom.each(function(node){
			this.show();	
		});
		leftBottom.each(function(node){
			this.show();	
		});
		rightTop.each(function(node){
			this.show();	
		});
		borderLine.each(function(node){
			this.show();	
		});	
	}
}

function resizeShape(obj, objGroup, x1, y1, x2, y2){
	var groupWidth = x2 - x1;
	var groupHeight = y2 - y1;
	var textArea = objGroup.get(".TextArea")[0];				

	if( chkIfSpeShape(obj.getName()) ){
		var radius = groupHeight/2;
		var triangleX = (x2 - x1)/2;
		var triangleY = (y2 - y1)/2;
		obj.setX(triangleX);
		obj.setY(triangleY);
		obj.setRadius(radius);
	}else{
		obj.setWidth(groupWidth);
		obj.setHeight(groupHeight);
	}

	objGroup.setX(x1);
	objGroup.setY(y1);
	objGroup.setWidth(groupWidth);
	objGroup.setHeight(groupHeight);
	textArea.setWidth(groupWidth);
	textArea.setHeight(groupHeight);

	reDrawAnchor(objGroup, 'leftTop', x1, y1, x2, y2);
	reDrawAnchor(objGroup, 'leftBottom', x1, y1, x2, y2);
	reDrawAnchor(objGroup, 'rightTop', x1, y1, x2, y2);
	reDrawAnchor(objGroup, 'rightBottom', x1, y1, x2, y2);

	reDrawBorderLine(obj, x1, y1, x2, y2);
}

function addBorderLine(obj){	
	var objGroup = obj.getParent();
	var margin = 4;
	
	var x1 = 0 - margin;
	var y1 = 0 - margin;
	var x2 = objGroup.getWidth() + margin;
	var y2 = objGroup.getHeight() + margin;
	
	var newLine = new Kinetic.Line({
		points: [x1, y1, x2, y1, x2, y2, x1, y2, x1, y1],
		stroke: '#5b7e91',
		strokeWidth: 2,
		lineCap: 'round',
		lineJoin: 'round',
		name: 'borderLine'
	});

	objGroup.add(newLine);
	newLine.moveToBottom();
}

function reDrawBorderLine(obj, groupX1, groupY1, groupX2, groupY2){
	var line;
	var margin = 4;
	var x1 = 0 - margin;
	var y1 = 0 - margin;
	var x2 = groupX2 - groupX1 + margin;
	var y2 = groupY2 - groupY1 + margin;
	
	obj.getParent().get('.borderLine').each(function(node){
		line = this;	
	});
	
	line.setPoints([x1, y1, x2, y1, x2, y2, x1, y2, x1, y1]);
	line.moveToBottom();
}

function reDrawAnchor(groupObj, position, groupX1, groupY1, groupX2, groupY2){
	var margin = 0;
	var anchorObj;
	groupObj.get('.'+position).each(function(node){
		anchorObj = this;
	});

	switch(anchorObj.getName()){
		case 'leftTop':
			anchorObj.setX(0 - margin);
			anchorObj.setY(0 - margin);
			break;
		case 'rightBottom':
			anchorObj.setX(groupX2-groupX1 + margin);
			anchorObj.setY(groupY2-groupY1 + margin);
			break;
		case 'rightTop':
			anchorObj.setX(groupX2-groupX1 + margin);
			anchorObj.setY(0 - margin);
			break;
		case 'leftBottom':
			anchorObj.setX(0 - margin);
			anchorObj.setY(groupY2-groupY1 + margin);
			break;
	}	
	
	//layerAll.draw();
}