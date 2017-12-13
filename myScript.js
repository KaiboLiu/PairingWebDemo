function myFunction()
{
    document.getElementById("demo").innerHTML="This is a demo for pairing";
}
/*
$(document).ready(function(){
	$("#import").click(function(){//点击导入按钮，使files触发点击事件，然后完成读取文件的操作。
        $("#files").click();
    });
});

function import(){
    var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    console.log("文件名:"+name+"大小："+size);

    var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
    reader.readAsText(selectedFile);//读取文件的内容

    reader.onload = function(){
        console.log(this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
    }
}


jQuery.get('https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/pairing_for_js/combine_pairing_23s.seq05', function(data) {
    var myvar = data;
});

*/



function draw_4(N,d,R,range,halfOpen=20)
{
	drawframe(N,d,R,range,halfOpen);
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
	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  
	    //set font and style
	    ctx.font = "30px italic";
	    //set fill style
	    ctx.fillStyle = "black";
	    //fill text at the position (420,40)
	    ctx.fillText("Pairing Test by Kaibo", 420, 40);	
	
		
	    //start to draw an open circle
	    ctx.beginPath();
	    ctx.strokeStyle = "black";
	    var circle = {
	        x : x0,    //center x
	        y : y0,    //center y
	        r : R      //radius
	    };
	    ctx.arc(circle.x, circle.y, circle.r, ((halfOpen-90)/360) * 2*Math.PI, ((270-halfOpen)/360) * 2*Math.PI, false);	

	    ctx.stroke();	
	}
}


function drawaxis(N,x0,y0,R,extDis,range=50,halfOpen=20)
{
	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  
	    //set font and style
	    ctx.font = "10px italic";
	    //set fill style
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
	for (var i=1; i<N; i=i+10)
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
		

	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);				//assign the start position of drawing
		if (arc)
		{
			ctx.arcTo(x0, y0, p2.x, p2.y, r);	//draw an arc of radius r, tangent with 2 sides consisted by p1 to (x0,y0) to p2.
    	
		}else
		{
			ctx.lineTo(p2.x,p2.y);
		}
    	ctx.strokeStyle = color;			//set arc to red
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
		

	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);				//assign the start position of drawing
		if (arc)
		{
			ctx.arcTo(x0, y0, p2.x, p2.y, r);	//draw an arc of radius r, tangent with 2 sides consisted by p1 to (x0,y0) to p2.
    	
		}else
		{
			ctx.lineTo(p2.x,p2.y);
		}
    	ctx.strokeStyle = color;			//set arc to red
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

	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  

		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);				//assign the start position of drawing
    	ctx.arcTo(x0, y0, p2.x, p2.y, r);	//draw an arc of radius r, tangent with 2 sides consisted by p1 to (x0,y0) to p2.
    	ctx.strokeStyle = color;			//set arc to red
    	ctx.stroke();
    }
*/
}

