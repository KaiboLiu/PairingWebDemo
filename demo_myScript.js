
function load_go(d,R,range,halfOpen=20) {

    $.getJSON("https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/pairing_for_js/combine_pairing_16s.seq22", function(data,status) {
        /*
        list_all = $.extend(true, [], data.pairing);
        list_all = data.pairing.slice();
        list_all = JSON.parse(JSON.stringify(data));
        */
        /*alert("length of seq: " + tmp + "\n状态: " + status);	*/

		var canvas = document.getElementById("myCanvas");
		//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
		drawframe(data.pairing[0],d,R,range,halfOpen,half="left");
        fillcircles(data.pairing,d,R,range,halfOpen,0,half="left");

        var beamsize = 100;

        drawframe(data.pairing[0],d,R,range,halfOpen,half="right");
        fillcircles(data.pairing,d,R,range,halfOpen,beamsize,half="right");

        

    });
}

/*
$(document).ready(function(){
	$("#readfile").click(function(){
		$$.get("https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/pairing_for_js/combine_pairing_23s.seq05",function(data,status){
			alert("数据: " + data + "\n状态: " + status);
		});
	});
});
*/

function fillcircles(data,d,R,range,halfOpen=20,beamsize=0,half="left"){
	var a = R + d;
	var b = 3*R + 4*d;	//2*d is also ok
	//var data = loadInfo();
	var N = data[0];
	//var pairs;
    var l;	//line number
    if (beamsize <= 200){
    	l= 6*beamsize+2
    }else{
    	l = (beamsize/100+198)*6+2;
    }

	if (half == "left"){
		//fill circle top-left with cf_missing, cf_hit, cf_wrong
		fillcircle(data[l],data[l+1],data[l+2],N,a,a,R,halfOpen);
		//fill circle bottom-left with vn_missing, vn_hit, vn_wrong
		fillcircle(data[l+3],data[l+4],data[l+5],N,a,b,R,halfOpen);
	}else{
		//fill circle top-right with linearcf_missing, linearcf_hit, linearcf_wrong
		fillcircle(data[l],data[l+1],data[l+2],N,b,a,R,halfOpen);
		//fill circle bottom-right with linearvn_missing, linearvn_hit, linearvn_wrong
		fillcircle(data[l+3],data[l+4],data[l+5],N,b,b,R,halfOpen);
	}
}


function fillcircle(missing,hit,wrong,N,x0,y0,R,halfOpen=20){

	var n_pair = missing.length;
	for (var i=0; i<n_pair; i=i+2){
		drawarc(missing[i],missing[i+1],N,x0,y0,R,'LightGray',halfOpen);
	}

	n_pair = hit.length;
	for (var i=0; i<n_pair; i=i+2){
		drawarc(hit[i],hit[i+1],N,x0,y0,R,'blue',halfOpen);
	}

	n_pair = wrong.length;
	for (var i=0; i<n_pair; i=i+2){
		drawarc(wrong[i],wrong[i+1],N,x0,y0,R,'red',halfOpen);
	}
}

/*
function draw_4(N,d,R,range,halfOpen=20){
	drawframe(N,d,R,range,halfOpen);
}
*/

function drawframe(N,d,R,range,halfOpen=20,half="left"){
	var a = R+d;
	var b =3*R + 4*d;	//2*d is also ok
	var extDis = d/1.5;
	
	if (half == "left"){
		drawcircle(a,a,R,halfOpen);
		drawcircle(a,b,R,halfOpen);
		drawaxis(N,a,a,R,extDis,range,halfOpen);
		drawaxis(N,a,b,R,extDis,range,halfOpen);

	}else{
		drawcircle(b,a,R,halfOpen);
		drawcircle(b,b,R,halfOpen);
		drawaxis(N,b,a,R,extDis,range,halfOpen);
		drawaxis(N,b,b,R,extDis,range,halfOpen);
	}
}


function drawcircle(x0,y0,R,halfOpen=20){
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


function drawaxis(N,x0,y0,R,extDis,range=50,halfOpen=20){
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
    	p.x = x0 + (R+extDis)*Math.sin(theta+alpha)-2*offset;
		p.y = y0 - (R+extDis)*Math.cos(theta+alpha)+offset;
    	ctx.fillText("5'", p.x, p.y);	

    	// to draw the mark of 3'
    	alpha = (360-2*halfOpen)/360 * 2*Math.PI;
    	p.x = x0 + (R+extDis)*Math.sin(theta+alpha)+1.5*offset;
		p.y = y0 - (R+extDis)*Math.cos(theta+alpha)+offset;
    	ctx.fillText("3'", p.x, p.y);	

	}
}


function draw_1_to_n(N,d,R,halfOpen=20){		// draw arcs from 1 to n
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

function drawarc(n1,n2,N,x0,y0,R,color,halfOpen=20){

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
    };
};

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


//change beam slidebar to tune beam size and draw
  function change() {
    var value = document.getElementById("beamslidebar").value;
    document.getElementById("beamsize").innerHTML = value;
    console.log(value);
    //return value;
  }


