function myFunction()
{
    document.getElementById("demo").innerHTML="This is a demo for pairing";
}

function draw_4(N,d,R,range,halfOpen=20)
{
	drawframe(N,d,R,range,halfOpen)
}


function drawframe(N,d,R,range,halfOpen=20)
{
	var a = R+d;
	var b =3*R + 4*d;	//2*d is also ok
	drawcircle(a,a,R,halfOpen);
	drawcircle(a,b,R,halfOpen);
	drawcircle(b,a,R,halfOpen);
	drawcircle(b,b,R,halfOpen);

	var extDis = d/1.5;
	drawaxis(N,a,a,R,extDis,range,halfOpen);
	drawaxis(N,a,b,R,extDis,range,halfOpen);
	drawaxis(N,b,a,R,extDis,range,halfOpen);
	drawaxis(N,b,b,R,extDis,range,halfOpen);
}

function drawcircle(x0,y0,R,halfOpen=20)
{
	//获取Canvas对象(画布)
	var canvas = document.getElementById("myCanvas");
	//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
	if(canvas.getContext)
	{  
    	//获取对应的CanvasRenderingContext2D对象(画笔)
    	var ctx = canvas.getContext("2d");  
	    //设置字体样式
	    ctx.font = "30px italic";
	    //设置字体填充颜色
	    ctx.fillStyle = "black";
	    //从坐标点(270,50)开始绘制文字
	    ctx.fillText("Pairing Test by Kaibo", 420, 40);	
	
		
	    //start to draw an open circle
	    ctx.beginPath();
	    ctx.strokeStyle = "black";
	    var circle = {
	        x : x0,    //圆心的x轴坐标值
	        y : y0,    //圆心的y轴坐标值
	        r : R      //圆的半径
	    };
	    ctx.arc(circle.x, circle.y, circle.r, ((halfOpen-90)/360) * 2*Math.PI, ((270-halfOpen)/360) * 2*Math.PI, false);	

	    ctx.stroke();	
	}
}


function drawaxis(N,x0,y0,R,extDis,range=50,halfOpen=20)
{
	//获取Canvas对象(画布)
	var canvas = document.getElementById("myCanvas");
	//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
	if(canvas.getContext)
	{  
    	//获取对应的CanvasRenderingContext2D对象(画笔)
    	var ctx = canvas.getContext("2d");  
	    //设置字体样式
	    ctx.font = "10px italic";
	    //设置字体填充颜色
	    ctx.fillStyle = "black";
	    offset = extDis/1.5;				// make numbers offset to left 
	    var alpha;
	    var p = new Object;
	    var theta = halfOpen/360 * 2*Math.PI;
	    for (var i=range; i<N-1; i=i+range)
	    {
	    	alpha = i/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
	    	p.x = x0 + (R+extDis)*Math.sin(theta+alpha)-offset;
			p.y = y0 - (R+extDis)*Math.cos(theta+alpha);
			//ctx.moveTo(p1.x, p1.y);				//指定绘制文字的起始点
	    	ctx.fillText(i, p.x, p.y);	
	    }

	    // to draw the mark of 5'
    	alpha = 0;
    	p.x = x0 + (R+extDis)*Math.sin(theta+alpha)-offset/2;
		p.y = y0 - (R+extDis)*Math.cos(theta+alpha);
    	ctx.fillText("5'", p.x, p.y);	

    	// to draw the mark of 3'
    	alpha = (360-2*halfOpen)/360 * 2*Math.PI;
    	p.x = x0 + (R+extDis)*Math.sin(theta+alpha)-offset/2;
		p.y = y0 - (R+extDis)*Math.cos(theta+alpha);
    	ctx.fillText("3'", p.x, p.y);	

	}
}


function draw_1_to_n(N,d,R,halfOpen=20)
{	
	var a = R+d;
	var b =3*R + 4*d;	//2*d is also ok
	for (var i=1; i<N; i=i+2)
	{
		drawarc(0,i,N,a,a,R,'red',halfOpen);
		drawarc(0,i,N,a,b,R,'green',halfOpen);
		drawarc(0,i,N,b,a,R,'grey',halfOpen);
		drawarc(0,i,N,b,b,R,'blue',halfOpen);
	}
}

function drawarc(n1,n2,N,x0,y0,R,color,halfOpen=20)
{

	var p1 = new Object;
	var p2 = new Object;
	var theta = halfOpen/360 * 2*Math.PI;
	var alpha1 = n1/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
	var alpha2 = n2/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
	
	p1.x = x0 + R*Math.sin(theta+alpha1);
	p1.y = y0 - R*Math.cos(theta+alpha1);

	p2.x = x0 + R*Math.sin(theta+alpha2);
	p2.y = y0 - R*Math.cos(theta+alpha2);

	var arc = true;
	var r;
	var deltaAlpha = alpha2-alpha1;
	//if (Math.abs(n2-n1-(N-1)*90/(180-halfOpen)) < 2)
	if (Math.abs(n2-n1-(N-1)*90/(180-halfOpen)) < Math.round(N/1000))	//2 is enough for N<=3000, if N is up to 4000, we can use 3 instead of 2
	{
		arc = false;		
	} else
	{
		r = R * Math.abs(Math.tan((deltaAlpha)/2));	
	}
		

	//获取Canvas对象(画布)
	var canvas = document.getElementById("myCanvas");
	//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
	if(canvas.getContext)
	{  
    	//获取对应的CanvasRenderingContext2D对象(画笔)
    	var ctx = canvas.getContext("2d");  

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);				//指定绘制路径的起始点
		if (arc)
		{
			ctx.arcTo(x0, y0, p2.x, p2.y, r);	//绘制与当前端点、端点1、端点2三个点所形成的夹角的两边相切并且半径为50px的圆的一段弧线
    	
		}else
		{
			ctx.lineTo(p2.x,p2.y);
		}
    	ctx.strokeStyle = color;			//设置线条颜色为红色
    	ctx.stroke();
    }

/*

	var arc = true;
	var r;
	var deltaAlpha = alpha2-alpha1;
	if (Math.abs(deltaAlpha-Math.PI) < 1.86e-3) 	//1.86e-3 is the angle threshold of adjacent points in a sequence of 3000
	{
		arc = false;
		//deltaAlpha = Math.PI + 3.41e-4;
	} else
	{
		r = R * Math.abs(Math.tan((deltaAlpha)/2));	
	}
		

	//获取Canvas对象(画布)
	var canvas = document.getElementById("myCanvas");
	//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
	if(canvas.getContext)
	{  
    	//获取对应的CanvasRenderingContext2D对象(画笔)
    	var ctx = canvas.getContext("2d");  

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);				//指定绘制路径的起始点
		if (arc)
		{
			ctx.arcTo(x0, y0, p2.x, p2.y, r);	//绘制与当前端点、端点1、端点2三个点所形成的夹角的两边相切并且半径为50px的圆的一段弧线
    	
		}else
		{
			ctx.lineTo(p2.x,p2.y);
		}
    	ctx.strokeStyle = color;			//设置线条颜色为红色
    	ctx.stroke();
    }
*/

/*
	var deltaAlpha = alpha2-alpha1;
	if (Math.abs(deltaAlpha-Math.PI) < 1.86e-3) 	//1.86e-3 is the angle threshold of adjacent points
	{
		deltaAlpha = Math.PI + 3.41e-4;
	}
	var r = R*Math.abs(Math.tan((deltaAlpha)/2));

	//获取Canvas对象(画布)
	var canvas = document.getElementById("myCanvas");
	//简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
	if(canvas.getContext)
	{  
    	//获取对应的CanvasRenderingContext2D对象(画笔)
    	var ctx = canvas.getContext("2d");  

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);				//指定绘制路径的起始点
    	ctx.arcTo(x0, y0, p2.x, p2.y, r);	//绘制与当前端点、端点1、端点2三个点所形成的夹角的两边相切并且半径为50px的圆的一段弧线
    	ctx.strokeStyle = color;			//设置线条颜色为红色
    	ctx.stroke();
    }
*/
}

