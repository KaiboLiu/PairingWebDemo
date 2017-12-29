var H_title = 20;
var seriesNo = "16s";
var seqNo = "seq01";
var BeamFromBar = 20;


function filterSeq(){
	var series = $("#series").find('option:selected').text(); // stores series
	$("#option-container").children().appendTo("#seqNo"); // moves <option> contained in #option-container back to their <select>
	var toMove = $("#seqNo").children("[data-c1!='"+series+"']"); // selects seqNo elements to move out
	toMove.appendTo("#option-container"); // moves seqNo elements in #option-container
	$("#seqNo").removeAttr("disabled"); // enables select
	//var seqNo = $("#seqNo").find('option:selected').text();
	//document.getElementById("seqShown").innerHTML = series + "-" + seqNo;
	comfirmSeq();
}

function comfirmSeq(){
	seriesNo = $("#series").find('option:selected').text();
	seqNo = "seq" + $("#seqNo").find('option:selected').val();//.slice(-2);
	//alert(seqNo);
	document.getElementById("seqShown").innerHTML = seriesNo + "_" + $("#seqNo").find('option:selected').text();//.slice(7);
	load_go(d=40,R=250,circleScale=50,halfOpen=20);
	
}

//change beam slidebar to tune beam size and draw
  function change() {
    BeamFromBar = document.getElementById("beamslidebar").value;
    if (BeamFromBar > 200){
    	BeamFromBar = (BeamFromBar - 200)*100 + 200;
    }
    document.getElementById("beamsize").innerHTML = BeamFromBar;
    load_go(d=40,R=250,circleScale=50,halfOpen=20);
    console.log(BeamFromBar);
    //return value;
  }



function load_go(d,R,circleScale,halfOpen=20) {
	var seqFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/rearranged_results/combine_"+seriesNo+"."+seqNo;
    $.get(seqFile, function(data,status) {
    	var lines = data.split("\n");
		document.getElementById("seqName").innerHTML = lines[1];
		document.getElementById("ref").innerHTML = lines[3];
		document.getElementById("cf").innerHTML = lines[5];
		document.getElementById("vn").innerHTML = lines[7];
		var beamline = 8*BeamFromBar + 3;
		if (BeamFromBar > 200){
			beamline = 8*(BeamFromBar/100+198) + 3;
		}
		document.getElementById("lcf").innerHTML = lines[beamline];
		document.getElementById("lvn").innerHTML = lines[beamline+4];
    });


	var pairingFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/pairing_for_js/combine_pairing_"+seriesNo+"."+seqNo; //"16s.seq13";
	/*
	var seqNo = document.getElementById("beamslidebar").value;
	if (seqNo < 10){
		pairingFile = pairingFile + "0";
	}
	pairingFile = pairingFile + seqNo.toString(); 
	*/
    $.getJSON(pairingFile, function(data,status) {
        /*
        list_all = $.extend(true, [], data.pairing);
        list_all = data.pairing.slice();
        list_all = JSON.parse(JSON.stringify(data));
        */
        /*alert("length of seq: " + tmp + "\n状态: " + status);	*/

		var canvas = document.getElementById("myCanvas");
		//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
		if(canvas.getContext)
		{  
    		//get corresponding CanvasRenderingContext2D object(pen)
    		var ctx = canvas.getContext("2d");  
    		ctx.clearRect(1, 1, 1199, 1199);
    	}
		drawFrame(data.pairing[0],d,R,circleScale,halfOpen,half="left");
        fillCircles(data.pairing,d,R,circleScale,halfOpen,0,half="left");

        //var beamsize = 100;
        drawFrame(data.pairing[0],d,R,circleScale,halfOpen,half="right");
        fillCircles(data.pairing,d,R,circleScale,halfOpen,BeamFromBar,half="right");
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


/*
function draw_4(N,d,R,circleScale,halfOpen=20){
	drawFrame(N,d,R,circleScale,halfOpen);
}
*/

function drawFrame(N,d,R,circleScale,halfOpen=20,half="left"){
	var a = R+d;
	var b =3*R + 3*d;	//2*d is also ok
	var extDis = d/2.2;
	
	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  
	    //set font and style
	    ctx.font = "30px Courier";
	    //set fill style
	    ctx.fillStyle = "black";
	    //fill text at the position (420,40)
	    ctx.fillText("CONTRAfold", R-1.1*d, d-0.5*H_title);	
	    ctx.fillText("Vienna", R-0.3*d, a+a+d+0.5*H_title);	
	    ctx.fillText("Linear CONTRAfold", b-3.4*d, d-0.5*H_title);	
	    ctx.fillText("Linear Vienna", b-2.7*d, a+a+d+0.5*H_title);	
	}

	if (half == "left"){
		drawCircle(a,a+H_title,R,halfOpen);
		drawCircle(a,b+2*H_title,R,halfOpen);
		drawCircleMarks(N,a,a+H_title,R,extDis,circleScale,halfOpen);
		drawCircleMarks(N,a,b+2*H_title,R,extDis,circleScale,halfOpen);

	}else{
		drawCircle(b,a+H_title,R,halfOpen);
		drawCircle(b,b+2*H_title,R,halfOpen);
		drawCircleMarks(N,b,a+H_title,R,extDis,circleScale,halfOpen);
		drawCircleMarks(N,b,b+2*H_title,R,extDis,circleScale,halfOpen);
	}
}


function drawCircle(x0,y0,R,halfOpen=20){
	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  
		
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


function drawCircleMarks(N,x0,y0,R,extDis,circleScale=50,halfOpen=20){
	//get canvas object
	var canvas = document.getElementById("myCanvas");
	//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
	if(canvas.getContext)
	{  
    	//get corresponding CanvasRenderingContext2D object(pen)
    	var ctx = canvas.getContext("2d");  
	    //set font and style
	    //ctx.font = "10px italic";
	    ctx.font = "10px normal";
	    //set fill style
	    ctx.fillStyle = "black";
	    offset = extDis/1.5;				// make numbers offset to left 
	    var alpha;
	    var p = new Object;
	    var theta = halfOpen/360 * 2*Math.PI;
	    for (var i=circleScale; i<N-1; i=i+circleScale)
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

/*
function draw_1_to_n(N,d,R,halfOpen=20){		// draw arcs from 1 to n
	var a = R+d;
	var b =3*R + 4*d;	//2*d is also ok
	for (var i=1; i<N; i=i+10)
	{
		drawArc(0,i,N,a,a,R,'red',halfOpen);
		drawArc(0,i,N,a,b,R,'green',halfOpen);
		drawArc(0,i,N,b,a,R,'grey',halfOpen);
		drawArc(0,i,N,b,b,R,'blue',halfOpen);
	}
}
*/

function fillCircles(data,d,R,circleScale,halfOpen=20,beamsize=0,half="left"){
	var a = R + d;
	var b = 3*R + 3*d;	//2*d is also ok
	//var data = loadInfo();
	var N = data[0];
	//var pairs;
    var l;	//line number
    if (beamsize <= 200){
    	l= 8*beamsize+2
    }else{
    	l = (beamsize/100+198)*8+2;
    }

	if (half == "left"){
		//fill circle top-left with cf_missing, cf_hit, cf_wrong
		fillCircle(data[l],data[l+1],data[l+2],data[l+3],N,a,a+H_title,R,halfOpen);
		//fill circle bottom-left with vn_missing, vn_hit, vn_wrong
		fillCircle(data[l+4],data[l+5],data[l+6],data[l+7],N,a,b+2*H_title,R,halfOpen);
	}else{
		//fill circle top-right with linearcf_missing, linearcf_hit, linearcf_wrong
		fillCircle(data[l],data[l+1],data[l+2],data[l+3],N,b,a+H_title,R,halfOpen);
		//fill circle bottom-right with linearvn_missing, linearvn_hit, linearvn_wrong
		fillCircle(data[l+4],data[l+5],data[l+6],data[l+7],N,b,b+2*H_title,R,halfOpen);
	}
}


function fillCircle(P_R,missing,hit,wrong,N,x0,y0,R,halfOpen=20){

	var missing_pair = missing.length;
	for (var i=0; i<missing_pair; i=i+2){
		drawArc(missing[i],missing[i+1],N,x0,y0,R,'LightGray',halfOpen);
	}

	var hit_pair = hit.length;
	for (var i=0; i<hit_pair; i=i+2){
		drawArc(hit[i],hit[i+1],N,x0,y0,R,'blue',halfOpen);
	}

	var wrong_pair = wrong.length;
	for (var i=0; i<wrong_pair; i=i+2){
		drawArc(wrong[i],wrong[i+1],N,x0,y0,R,'red',halfOpen);
	}
/*
	var P = hit_pair/(hit_pair+wrong_pair); // PPV (precision) = #_of_correctly_predicted_pairs / #_of_predicted_pairs
	var Recall = hit_pair/(hit_pair+missing_pair);// Sensitivity (recall) = #_of_correctly_predicted_pairs / #_of_gold_pairs
*/
	var F = 2*P_R[0]*P_R[1] / (P_R[0] + P_R[1]);// F-score = 2PR / (P + R);
	//alert(P_R);
	var canvas = document.getElementById("myCanvas");
	if(canvas.getContext)
	{  
    	var ctx = canvas.getContext("2d");  
	    ctx.font = "18px Courier";
	    //set fill style
	    ctx.fillStyle = "black";
	    //fill text at the position (420,40)
	    ctx.fillText("(P="+(P_R[0]*100).toFixed(2).toString()+
	    			 ",R="+(P_R[1]*100).toFixed(2).toString()+
	    			 ",F="+(F*100).toFixed(2).toString()+"); Pair="+((hit_pair+wrong_pair)/2).toString(),
	    			 x0-R/1.4,y0-R-H_title/2);
	}	
}


function drawArc(n1,n2,N,x0,y0,R,color,halfOpen=20){

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



