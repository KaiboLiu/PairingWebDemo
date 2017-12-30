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
	plot_go();
	
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


function drawFrame(N,d,R,circleScale,halfOpen=20,half="left"){
	var a = R+d;
	var b =3*R + 3*d;	//2*d is also ok
	var extDis = d/2.8;
	
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
	    ctx.fillText("CONTRAfold MFE", R-2*d, d-0.5*H_title);	
	    ctx.fillText("Vienna RNAfold", R-2*d, a+a+d+0.5*H_title);	
	    ctx.fillText("LinearFold-C", b-2.7*d, d-0.5*H_title);	//Linear CONTRAfold
	    ctx.fillText("LinearFold-V", b-2.7*d, a+a+d+0.5*H_title);	//Linear Vienna
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


function fillCircle(P_R_F,missing,hit,wrong,N,x0,y0,R,halfOpen=20){

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
	//var F = 2*P_R[0]*P_R_F[1] / (P_R[0] + P_R_F[1]);// F-score = 2PR / (P + R);
	//alert(P_R_F);
	var canvas = document.getElementById("myCanvas");
	if(canvas.getContext)
	{  
    	var ctx = canvas.getContext("2d");  
	    ctx.font = "18px normal";
	    //set fill style
	    ctx.fillStyle = "black";
	    //fill text at the position (420,40)
	    ctx.fillText("PPV="+(P_R_F[0]*100).toFixed(2)+		//(P_R_F[0]*100).toFixed(2).toString()
	    			 ", Sensitivity="+(P_R_F[1]*100).toFixed(2)+
	    			 " (F="+(P_R_F[2]*100).toFixed(2)+", Pair="+((hit_pair+wrong_pair)/2).toString()+")",
	    			 x0-R/1.4,y0-R-H_title/2);
	    /*ctx.fillText("PPV="+(P_R[0]*100).toFixed(2).toString()+
	    			 ", Sensitivity="+(P_R[1]*100).toFixed(2).toString()+
	    			 " (F="+(F*100).toFixed(2).toString()+", Pair="+((hit_pair+wrong_pair)/2).toString()+")",
	    			 x0-R/1.4,y0-R-H_title/2);
	    */
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




function plot_go(){
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(plot_4);  
}

  function plot_4() {
    var pairingFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/pairing_for_js/combine_pairing_"+seriesNo+"."+seqNo; //"16s.seq13";
    $.getJSON(pairingFile, function(pairingData,status) {

      // Figure 411, plot P/R/F-beam for LinearFold-C, data saved in data_C_1
        var data_C_1 = new google.visualization.DataTable();
        data_C_1.addColumn('number', 'Beam');
        data_C_1.addColumn('number', 'PPV');
        data_C_1.addColumn('number', 'Sensitivity');
        data_C_1.addColumn('number', 'F-score');  
        var l, beam = 1;
        
        
        //data_C_1.addRow(['0', , , null]);
        for (beam=1; beam<=200; beam=beam+1){
          l = beam * 8 + 2;
          data_C_1.addRow([beam, Math.round(pairingData.pairing[l][0]*10000)/100, 
                                        Math.round(pairingData.pairing[l][1]*10000)/100, 
                                        Math.round(pairingData.pairing[l][2]*10000)/100]);
        }
        for (beam=300; beam<=800; beam=beam+100){
          l = (Math.round(beam/100)+198) * 8 + 2;  
          data_C_1.addRow([beam, Math.round(pairingData.pairing[l][0]*10000)/100, Math.round(pairingData.pairing[l][1]*10000)/100, Math.round(pairingData.pairing[l][2]*10000)/100]);
        }
          
        var options = {
          legend:'bottom',
          title:'Performance VS Beam size (CONTRAfold)',
          //'is3D':true,
          hAxis: {
            //slantedText:true,
            //slantedTextAngle:12,
            scaleType: 'log',
            //gridlines: {count: 40},
            //ticks:['1','3','5','7'],
            //ticks: [{v:'1', f:'1'}, {v:'100', f:'100'}, {v:'200', f:'200'}, {v:'500', f:'500'}, {v:'800', f:'800'}],//, 100, 200, 202, 204, 206]
            //ticks: [1,50,100,150,200,{v:203, f:'500'},{v:206, f:'800'}],
            title: 'Beam size'
          },
          vAxis: {
            gridlines: {count: 5},
            //viewWindow: {
            //  max: 60,
            //  min: 20,
            //},
            //minValue: 15,
            title: 'Performance (%)'            
          },
          series: {
            1: {curveType: 'function'}
          }
        };  

        var chart = new google.visualization.LineChart(document.getElementById('chart_div_411'));
        chart.draw(data_C_1, options);




        // Figure 412, plot R-P for LinearFold-C, data saved in data_C_2
        var data_C_2 = new google.visualization.DataTable();
        data_C_2.addColumn('number', 'PPV');
        data_C_2.addColumn('number', 'LinearFold-C');
        data_C_2.addColumn('number', 'CONTRAfold MFE');
        var l;
        data_C_2.addRow([Math.round(pairingData.pairing[2][0]*10000)/100, ,Math.round(pairingData.pairing[2][1]*10000)/100]);
        for (var beam=1; beam<=200; beam=beam+1){
          l = beam * 8 + 2;
          data_C_2.addRow([Math.round(pairingData.pairing[l][0]*10000)/100, Math.round(pairingData.pairing[l][1]*10000)/100, null]);
        }
        
        for (var beam=300; beam<=800; beam=beam+100){
          l = (beam/100+198) * 8 + 2;
          data_C_2.addRow([Math.round(pairingData.pairing[l][0]*10000)/100, Math.round(pairingData.pairing[l][1]*10000)/100, null]);
        }
        
        var options = {
          'legend':'bottom',
          'title':'Sensitivity VS PPV (CONTRAfold)',          
          //'width':400,
          //'height':410,
          hAxis: {
            title: 'PPV (%)'
          },
          vAxis: {
            title: 'Sensitivity (%)'
          },
          series: {
            1: {curveType: 'function'}
          }
        };  

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_412'));
        chart.draw(data_C_2, options);




      // Figure 421, plot P/R/F-beam for LinearFold-V, data saved in data_V_1
        var data_V_1 = new google.visualization.DataTable();
        data_V_1.addColumn('string', 'Beam');
        data_V_1.addColumn('number', 'PPV');
        data_V_1.addColumn('number', 'Sensitivity');
        data_V_1.addColumn('number', 'F-score');  
        var l, beam = 1;
        
        //alert(beam.toString());
        data_V_1.addRow(['0', , , null]);
        for (beam=1; beam<=200; beam=beam+1){
          l = beam * 8 + 6;
          data_V_1.addRow([beam.toString(), Math.round(pairingData.pairing[l][0]*10000)/100, 
                                        Math.round(pairingData.pairing[l][1]*10000)/100, 
                                        Math.round(pairingData.pairing[l][2]*10000)/100]);
        }
        for (beam=300; beam<=800; beam=beam+10){
          l = (Math.round(beam/100)+198) * 8 + 2;  
          data_V_1.addRow([beam.toString(), Math.round(pairingData.pairing[l][0]*10000)/100, Math.round(pairingData.pairing[l][1]*10000)/100, Math.round(pairingData.pairing[l][2]*10000)/100]);
        }
          
        var options = {
          legend:'bottom',
          title:'Performance VS Beam size (Vienna)',
          //'is3D':true,
          hAxis: {
            slantedText:true,
            slantedTextAngle:9,
            gridlines: {count: 8},
            //ticks:['1','3','5','7'],
            //ticks: [{v:'1', f:'1'}, {v:'100', f:'100'}, {v:'200', f:'200'}, {v:'500', f:'500'}, {v:'800', f:'800'}],//, 100, 200, 202, 204, 206]
            //ticks: [1,50,100,150,200,{v:203, f:'500'},{v:206, f:'800'}],
            title: 'Beam size'
          },
          vAxis: {
            gridlines: {count: 5},
            //viewWindow: {
            //  max: 60,
            //  min: 20,
            //},
            //minValue: 15,
            title: 'Performance (%)'            
          },
          series: {
            1: {curveType: 'function'}
          }
        };  

        var chart = new google.visualization.LineChart(document.getElementById('chart_div_421'));
        chart.draw(data_V_1, options);




        // Figure 422, plot R-P for LinearFold-V, data saved in data_V_2
        var data_V_2 = new google.visualization.DataTable();
        data_V_2.addColumn('number', 'PPV');
        data_V_2.addColumn('number', 'LinearFold-V');
        data_V_2.addColumn('number', 'Vienna RNA');
        var l;
        data_V_2.addRow([Math.round(pairingData.pairing[6][0]*10000)/100, ,Math.round(pairingData.pairing[6][1]*10000)/100]);
        for (var beam=1; beam<=200; beam=beam+1){
          l = beam * 8 + 6;
          data_V_2.addRow([Math.round(pairingData.pairing[l][0]*10000)/100, Math.round(pairingData.pairing[l][1]*10000)/100, null]);
        }
        
        for (var beam=300; beam<=800; beam=beam+100){
          l = (beam/100+198) * 8 + 2;
          data_V_2.addRow([Math.round(pairingData.pairing[l][0]*10000)/100, Math.round(pairingData.pairing[l][1]*10000)/100, null]);
        }
        
        var options = {
          'legend':'bottom',
          'title':'Sensitivity VS PPV (Vienna)',          
          //'width':400,
          //'height':410,
          hAxis: {
            title: 'PPV (%)'
          },
          vAxis: {
            title: 'Sensitivity (%)'
          },
          series: {
            1: {curveType: 'function'}
          }
        };  

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_422'));
        chart.draw(data_V_2, options);
    });
  }



/*
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawCurveTypes);

function drawCurveTypes() {
      var data_C_1 = new google.visualization.DataTable();
      data_C_1.addColumn('number', 'Beam');
      data_C_1.addColumn('number', 'P');
      data_C_1.addColumn('number', 'R');
      data_C_1.addColumn('number', 'F');

      data_C_1.addRows([
        [0, 0, 0,30],    [1, 10, 5,30],   [2, 23, 15,30],  [3, 17, 9,30],   [4, 18, 10,30],  [5, 9, 5,30],
        [6, 11, 3,30],   [7, 27, 19,30],  [8, 33, 25,30],  [9, 40, 32,30],  [10, 32, 24,30], [11, 35, 27,30],
        [12, 30, 22,30], [13, 40, 32,30], [14, 42, 34,30], [15, 47, 39,30], [16, 44, 36,30], [17, 48, 40,30],
        [18, 52, 44,30], [19, 54, 46,30], [20, 42, 34,30], [21, 55, 47,30], [22, 56, 48,30], [23, 57, 49,30],
        [24, 60, 52,30], [25, 50, 42,30], [26, 52, 44,30], [27, 51, 43,30], [28, 49, 41,30], [29, 53, 45,30],
        [30, 55, 47,30], [31, 60, 52,30], [32, 61, 53,30], [33, 59, 51,30], [34, 62, 54,30], [35, 65, 57,30],
        [36, 62, 54,30], [37, 58, 50,30], [38, 55, 47,30], [39, 61, 53,30], [40, 64, 56,30], [41, 65, 57,30],
        [42, 63, 55,30], [43, 66, 58,30], [44, 67, 59,30], [45, 69, 61,30], [46, 69, 61,30], [47, 70, 62,30],
        [48, 72, 64,30], [49, 68, 60,30], [50, 66, 58,30], [51, 65, 57,30], [52, 67, 59,30], [53, 70, 62,30],
        [54, 71, 63,30], [55, 72, 64,30], [56, 73, 65,30], [57, 75, 67,30], [58, 70, 62,30], [59, 68, 60,30],
        [60, 64, 56,30], [61, 60, 52,30], [62, 65, 57,30], [63, 67, 59,30], [64, 68, 60,30], [65, 69, 61,30],
        [66, 70, 62,30], [67, 72, 64,30], [68, 75, 67,30], [69, 80, 72,30]
      ]);

      var options = {
        hAxis: {
          title: 'Beam size'
        },
        vAxis: {
          title: 'Performance'
        },
        series: {
          1: {curveType: 'function'}
        }
      };

      var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
      chart.draw(data_C_1, options);
    }

*/

