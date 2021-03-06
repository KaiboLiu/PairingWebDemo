var H_title = 20;
var seriesNo = "grp1";
var seqNo = "seq00";
var BeamFromBar = 20;
var title11 = "CONTRAfold MFE";
var title21 = "Vienna RNAfold";
var title12 = "LinearFold-C";
var title22 = "LinearFold-V";
var min_P_C, max_P_C, min_R_C, max_R_C; 
var min_P_V, max_P_V, min_R_V, max_R_V; 
//var slide_highlight_style_P = 'point { size: 7; shape-type: star; shape-dent:0.5 ; shape-sides: 5; fill-color: #6ca1f7; visible:true}';
var slide_highlight_style_P = 'point { size: 5; shape-type: circle; fill-color:#013ea0; visible:true}';
var slide_highlight_style_R = 'point { size: 5; shape-type: circle; fill-color:#bf0f0f; visible:true}';
var logView1 = true;
 var logView2 = true;

/*
function filterSeq(){
	var series = $("#series").find('option:selected').text(); // stores series
	$("#option-container").children().appendTo("#seqNo"); // moves <option> contained in #option-container back to their <select>
	var toMove = $("#seqNo").children("[data-c1!='"+series+"']"); // selects seqNo elements to move out
	toMove.appendTo("#option-container"); // moves seqNo elements in #option-container
	$("#seqNo").removeAttr("disabled"); // enables select	
	comfirmSeq();
}

function comfirmSeq(){
	var series = $("#series").find('option:selected').text(); // stores series
	seriesNo = $("#series").find('option:selected').val();
	seqNo = "seq" + $("#seqNo").find('option:selected').val();//.slice(-2);
	//alert(seqNo);
	document.getElementById("seqShown").innerHTML = series + "_" + $("#seqNo").find('option:selected').text();//.slice(7);
	logView1 = true;
	logView2 = true;
	fillPage_go(d=40,R=250,circleScale=50,halfOpen=20);
}

function tempBeam(){
    BeamFromBar = document.getElementById("beamslidebar").value;	// this is a string, instead of number...
    BeamFromBar = Number(BeamFromBar);
    if (BeamFromBar > 200){
    	BeamFromBar = (BeamFromBar - 200)*100 + 200;
    }    
    document.getElementById("beamsize").innerHTML = BeamFromBar
    document.getElementById("slidebarHint").innerHTML = '   (release mouse to confirm)';
}


//change beam slidebar to tune beam size and draw
function change(hint) {
	document.getElementById("beamsize").innerHTML = BeamFromBar;
	document.getElementById("slidebarHint").innerHTML = hint;
	console.log('Beam size: ' + BeamFromBar);
    fillPage_go(d=40,R=250,circleScale=50,halfOpen=20);
}
*/

console.log('start')
fillPage_go(d=40,R=250,circleScale=50,halfOpen=20,inFile="pairing.res");     // fill text, draw graphs and plots on the right


function fillPage_go(d,R,circleScale,halfOpen=20,inFile) {
	//var inFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/demo_pairing_for_js/combine_pairing_"+seriesNo+"."+seqNo; //"16s.seq13";
	//var pairingFile = "../demo_data_run/" + inFile; 
    var pairingFile = "./" + inFile; 
	console.log(pairingFile)
	$.getJSON(pairingFile, function(data,status) {
        console.log('read successfully')
        document.getElementById("seqEcho").innerHTML = data.pairing[4]+' (len:'+data.pairing[0]+')';
        document.getElementById("beamEcho").innerHTML = data.pairing[1];
        document.getElementById("timeLCEcho").innerHTML = (''+data.pairing[2]).slice(0,-5);
        document.getElementById("timeLVEcho").innerHTML = (''+data.pairing[3]).slice(0,-5);
   
        document.getElementById("seqStr").innerHTML = 'seq: <br>'+data.pairing[5];
        document.getElementById("lcf").innerHTML = 'LinearFold-C: <br>' + data.pairing[6];
        document.getElementById("lvn").innerHTML = 'LinearFold-V: <br>' + data.pairing[7];
		draw_graphs(data.pairing, d,R,circleScale,halfOpen);
		draw_plots(data.pairing);
	});
}


function draw_graphs(pairingList, d,R,circleScale,halfOpen=20) {
		var canvas = document.getElementById("myCanvas");
		//check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
		if(canvas.getContext)
		{  
    		//get corresponding CanvasRenderingContext2D object(pen)
    		var ctx = canvas.getContext("2d");  
    		ctx.clearRect(1, 1, 1199, 1199);
    	}
		//drawFrame(pairingList[0],d,R,circleScale,halfOpen,half="left");
        //fillCircles(pairingList,d,R,circleScale,halfOpen,0,half="left");

        //var beamsize = 100;
        drawFrame(pairingList[0],d,R,circleScale,halfOpen,half="right");
        fillCircles(pairingList,d,R,circleScale,halfOpen,half="right");
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
	    //ctx.fillText(title11, R-2*d, d-0.5*H_title);	
	    //ctx.fillText(title21, R-2*d, a+a+d+0.5*H_title);	
	    ctx.fillText(title12, b-2.7*d, d-0.5*H_title);	//Linear CONTRAfold
	    ctx.fillText(title22, b-2.7*d, a+a+d+0.5*H_title);	//Linear Vienna
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

function fillCircles(data,d,R,circleScale,halfOpen=20,half="right"){
	var a = R + d;
	var b = 3*R + 3*d;	//2*d is also ok
	//var data = loadInfo();
	var N = data[0];
	//var pairs;
    var l;	//line number
    var beamsize = data[1]

	if (half == "left"){
		//fill circle top-left with cf_missing, cf_hit, cf_wrong
		fillCircle(data[l],data[l+1],data[l+2],data[l+3],N,a,a+H_title,R,halfOpen);
		//fill circle bottom-left with vn_missing, vn_hit, vn_wrong
		fillCircle(data[l+4],data[l+5],data[l+6],data[l+7],N,a,b+2*H_title,R,halfOpen);
	}else{
		//fill circle top-right with linearcf_missing, linearcf_hit, linearcf_wrong
		fillCircle(data[8],data[9],data[10],data[11],N,b,a+H_title,R,halfOpen);
		//fill circle bottom-right with linearvn_missing, linearvn_hit, linearvn_wrong
		fillCircle(data[12],data[13],data[14],data[15],N,b,b+2*H_title,R,halfOpen);
	}
}


function fillCircle(P_R_F,missing,hit,wrong,N,x0,y0,R,halfOpen=20){

	var missing_pair = missing.length;
	for (var i=0; i<missing_pair; i=i+2){
		//drawArc(missing[i],missing[i+1],N,x0,y0,R,'LightGray',halfOpen);
        drawArc(missing[i],missing[i+1],N,x0,y0,R,'LightGreen',halfOpen);
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
    	ctx.strokeStyle = color;			//set this arc to a certain color
    	ctx.stroke();    	
    };
};

function draw_plots(pairingList){
	////// Figure 411, plot P/R-beam for LinearFold-C, data saved in data_C_1_log or data_C_1_linear, used in log/linear view
	plot_411(pairingList);
	////// Figure 412, plot R-P for LinearFold-C, data saved in data_C_2
	plot_412(pairingList);
	////// Figure 421, plot P/R-beam for LinearFold-V, data saved in data_V_1_log or data_V_1_linear, used in log/linear view
	plot_421(pairingList);
	////// Figure 422, plot R-P for LinearFold-V, data saved in data_V_2
	plot_422(pairingList);
}



function plot_411(pairingList){
////// Figure 411, plot P/R-beam for LinearFold-C, data saved in data_C_1_log or data_C_1_linear, used in log/linear view
    var button = document.getElementById('change_chart_411');
    var chartDiv = document.getElementById('chart_div_411');
 	//console.log('plot data generated');

// data_C_1 is data ready for log or linear view, to be transfered later
    var data_C_1 = new google.visualization.DataTable();
    data_C_1.addColumn('number', 'Beam');
    data_C_1.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});	// Use custom HTML content for the domain tooltip.
    data_C_1.addColumn('number', 'PPV');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_C_1.addColumn('number', 'Sensitivity');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    //data_C_1.addColumn('number', 'F-score');  
    data_C_1.addColumn('number', 'PPV_'+title11);
    data_C_1.addColumn('number', 'Sensitivity_'+title11);

    var l, beam = 1;
    min_P_C = pairingList[2][0]; //100;
    max_P_C = pairingList[2][0]; //0;
    min_R_C = pairingList[2][1]; //100;
    max_R_C = pairingList[2][1]; //0;

	var P_fix = Math.round(pairingList[2][0]*10000)/100;
	var R_fix = Math.round(pairingList[2][1]*10000)/100;   
	var P, R;

    for (beam=1; beam<=200; beam+=1){
      l = beam * 8 + 2;
	  if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];		// pairingList[l][0] is P
	  if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
	  if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];		// pairingList[l][0] is R
	  if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];
	  P = Math.round(pairingList[l][0]*10000)/100;
	  R = Math.round(pairingList[l][1]*10000)/100;
	  data_C_1.addRow([beam, createCustomHTMLContent_1(beam, data_C_1.getColumnLabel(2), data_C_1.getColumnLabel(4), data_C_1.getColumnLabel(6), data_C_1.getColumnLabel(7), P, R, P_fix, R_fix), 
							 P, , R, , P_fix, R_fix]);
    }
    for (beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 2;  
	  if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];		// pairingList[l][0] is P
	  if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
	  if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];		// pairingList[l][0] is R
	  if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];      
	  P = Math.round(pairingList[l][0]*10000)/100;
	  R = Math.round(pairingList[l][1]*10000)/100;
	  data_C_1.addRow([beam, createCustomHTMLContent_1(beam, data_C_1.getColumnLabel(2), data_C_1.getColumnLabel(4), data_C_1.getColumnLabel(6), data_C_1.getColumnLabel(7), P, R, P_fix, R_fix), 
							 P, , R, , P_fix, R_fix]);
    }

	// highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
	data_C_1.setValue(rowIndex-1, 3, slide_highlight_style_P);	//[beam, P, style, R, null, P_fix, R_fix],
	data_C_1.setValue(rowIndex-1, 5, slide_highlight_style_R);	//[beam, P, style, R, style, P_fix, R_fix],

	//var max_tmp = max_P_C, min_tmp = min_P_C;
    min_P_C = 5 * Math.floor(min_P_C*100/5);
    max_P_C = 5 * Math.ceil(max_P_C*100/5);
//    if ((max_P_C - min_P_C) % 10 != 0){
//  	if (max_P_C - max_tmp < min_tmp - min_P_C) min_P_C -= 5;
//    	else max_P_C += 5;
//    }
//    max_tmp = max_R_C, min_tmp = min_R_C;
    min_R_C = 5 * Math.floor(min_R_C*100/5);
    max_R_C = 5 * Math.ceil(max_R_C*100/5);
//    if ((max_R_C - min_R_C) % 10 != 0){
//    	if (max_R_C - max_tmp < min_tmp - min_R_C) min_R_C -= 5;
//    	else max_R_C += 5;
//    }    

    var logOptions = {
      legend:'top',
      title:'Performance VS Beam size (LinearFold-C)',
      focusTarget: 'category',
      tooltip: { isHtml: true },
      backgroundColor: { fill:'transparent' },
      //'is3D':true,
      hAxis: {
        scaleType: 'log',
        //gridlines: {count: 40},
        title: 'Beam size (log scale view)',
      },

      vAxis: {
        //gridlines: {count: 4},
        viewWindow: {
          max: Math.max(max_P_C, max_R_C),
          min: Math.min(min_P_C, min_R_C),
        },
        //minValue: Math.min(min_P_C, min_R_C), maxValue: Math.max(max_P_C, max_R_C),
        title: 'Performance (%)',
      },
      series: {
        2: {lineWidth: 1, lineDashStyle: [8, 10]},
        3: {lineWidth: 1, lineDashStyle: [8, 10]},
          //type: 'scatter'
      },
      curveType: 'function',
      //pointSize: 0.1,
      //dataOpacity: 0.6
    };  

    var linearOptions = {
      legend:'top',
      title:'Performance VS Beam size (LinearFold-C)',
      focusTarget: 'category',
      tooltip: { isHtml: true },
      backgroundColor: { fill:'transparent' },
      hAxis: {
        //slantedText:true,
        //slantedTextAngle:9,
        //gridlines: {count: 2},
        title: 'Beam size (linear scale view)',
        //ticks: [{v:1, f:'1'}, {v:100, f:'100'}, {v:200, f:'200'}, {v:500, f:'500'}, {v:206, f:'800'}],//[1, 100, 200, 500, 800]        
      },
      vAxis: {
        //gridlines: {count: 5},
        viewWindow: {
          max: Math.max(max_P_C, max_R_C),
          min: Math.min(min_P_C, min_R_C),
        },
        title: 'Performance (%)'            
      },
      series: {
        2: {lineWidth: 1, lineDashStyle: [8, 10]},
        3: {lineWidth: 1, lineDashStyle: [8, 10]},
      },
      //pointSize: 0.1,
      //dataOpacity: 0.6
    };  
/*////////////
// data_C_1_log is data for log view, use number as x label   
	function to_data_log(data){	// x from [1,2,3,...,200,201,...,206] to [1,2,3,..,200,300,400,..,800]
		for (var i = 201; i <= 206; i++){
			data.setValue(i-1,0,(i-200)*100+200);
		}
		return data;
	}
// data_C_1_linear is data for linear view, use string as x label      
	function to_data_linear(data){	// x from [1,2,3,..,200,300,400,..,800] to [1,2,3,...,200,201,...,206]
		for (var i = 201; i <= 206; i++){
			data.setValue(i-1,0,i);
		}
		return data;
	}
///////////*/
	//var chart = new google.visualization.LineChart(chartDiv);
    //chart.draw(data_C_1, options);
    var thisChart;
	function drawLogChart() {
		logView1 = true;
	    var logChart = new google.visualization.LineChart(chartDiv);
	    logChart.draw(data_C_1, logOptions);
	    button.innerText = 'Switch to Linear Scale';
	    button.onclick = drawLinearChart;
	    thisChart = logChart;
    }    
    function drawLinearChart() {
    	logView1 = false;
	    var linearChart = new google.visualization.LineChart(chartDiv);
	    linearChart.draw(data_C_1, linearOptions);
	    button.innerText = 'Switch to Log Scale';
	    button.onclick = drawLogChart;
	    thisChart = linearChart;	    
    }    
    if (logView1) drawLogChart();
    else drawLinearChart();

    // The select handler. Call the chart's getSelection() method
	function selectHandler() {
    	var selectedItem = thisChart.getSelection()[0];
    	if (selectedItem) {
      	//var value = data.getValue(selectedItem.row, selectedItem.column);
      	BeamFromBar = selectedItem.row + 1;  							// 1-206, need to be converted to 1-200,300,400,500,600,700,800
      	document.getElementById("beamslidebar").value = BeamFromBar;	// update the position on beam size slide bar
      	if (BeamFromBar > 200) BeamFromBar = (BeamFromBar - 200) * 100 + 200;      	
      	change('   (selected from chart)');
    	}
  	}

	// Listen for the 'select' event, and call my function selectHandler() when the user selects something on the chart.
	google.visualization.events.addListener(thisChart, 'select', selectHandler);
}

/*
function plot_411(pairingList){
////// Figure 411, plot P/R-beam for LinearFold-C, data saved in data_C_1_log or data_C_1_linear, used in log/linear view
    var button = document.getElementById('change_chart_411');
    var chartDiv = document.getElementById('chart_div_411');
 
// data_C_1 is data ready for log or linear view, to be transfered later
    var data_C_1 = new google.visualization.DataTable();
    data_C_1.addColumn('number', 'Beam');
    //data_C_1.addColumn({type: 'string', role: 'domain'});
    data_C_1.addColumn('number', 'PPV');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_C_1.addColumn('number', 'Sensitivity');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    //data_C_1.addColumn('number', 'F-score');  
    data_C_1.addColumn('number', 'PPV_'+title11);
    data_C_1.addColumn('number', 'Sensitivity_'+title11);

    var l, beam = 1;
    min_P_C = pairingList[2][0]; //100;
    max_P_C = pairingList[2][0]; //0;
    min_R_C = pairingList[2][1]; //100;
    max_R_C = pairingList[2][1]; //0;
   
    for (beam=1; beam<=200; beam+=1){
      l = beam * 8 + 2;
      if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];		// pairingList[l][0] is P
      if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
      if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];		// pairingList[l][0] is R
      if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];
      data_C_1.addRow([beam, Math.round(pairingList[l][0]*10000)/100, ,
							 Math.round(pairingList[l][1]*10000)/100, ,
							 Math.round(pairingList[2][0]*10000)/100, 
							 Math.round(pairingList[2][1]*10000)/100]); 
    }
    for (beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 2;  
      if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];		// pairingList[l][0] is P
      if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
      if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];		// pairingList[l][0] is R
      if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];      
      data_C_1.addRow([beam, Math.round(pairingList[l][0]*10000)/100, ,
							 Math.round(pairingList[l][1]*10000)/100, ,
							 Math.round(pairingList[2][0]*10000)/100, 
							 Math.round(pairingList[2][1]*10000)/100]); 
    }

	// highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
	data_C_1.setValue(rowIndex-1, 2, slide_highlight_style_P);	//[beam, P, style, R, null, P_fix, R_fix],
	data_C_1.setValue(rowIndex-1, 4, slide_highlight_style_R);	//[beam, P, style, R, style, P_fix, R_fix],

	//var max_tmp = max_P_C, min_tmp = min_P_C;
    min_P_C = 5 * Math.floor(min_P_C*100/5);
    max_P_C = 5 * Math.ceil(max_P_C*100/5);
//    if ((max_P_C - min_P_C) % 10 != 0){
//  	if (max_P_C - max_tmp < min_tmp - min_P_C) min_P_C -= 5;
//    	else max_P_C += 5;
//    }
//    max_tmp = max_R_C, min_tmp = min_R_C;
    min_R_C = 5 * Math.floor(min_R_C*100/5);
    max_R_C = 5 * Math.ceil(max_R_C*100/5);
//    if ((max_R_C - min_R_C) % 10 != 0){
//    	if (max_R_C - max_tmp < min_tmp - min_R_C) min_R_C -= 5;
//    	else max_R_C += 5;
//    }    

    var logOptions = {
      legend:'top',
      title:'Performance VS Beam size (LinearFold-C)',
      focusTarget: 'category',
      backgroundColor: { fill:'transparent' },
      //'is3D':true,
      hAxis: {
        scaleType: 'log',
        //gridlines: {count: 40},
        title: 'Beam size (log scale view)',
      },

      vAxis: {
        //gridlines: {count: 4},
        viewWindow: {
          max: Math.max(max_P_C, max_R_C),
          min: Math.min(min_P_C, min_R_C),
        },
        //minValue: Math.min(min_P_C, min_R_C), maxValue: Math.max(max_P_C, max_R_C),
        title: 'Performance (%)',
      },
      series: {
        2: {lineWidth: 1, lineDashStyle: [8, 10]},
        3: {lineWidth: 1, lineDashStyle: [8, 10]},
          //type: 'scatter'
      },
      curveType: 'function',
      //pointSize: 0.1,
      //dataOpacity: 0.6
    };  

    var linearOptions = {
      legend:'top',
      title:'Performance VS Beam size (LinearFold-C)',
      focusTarget: 'category',
      backgroundColor: { fill:'transparent' },
      hAxis: {
        //slantedText:true,
        //slantedTextAngle:9,
        //gridlines: {count: 2},
        title: 'Beam size (linear scale view)',
        //ticks: [{v:1, f:'1'}, {v:100, f:'100'}, {v:200, f:'200'}, {v:500, f:'500'}, {v:206, f:'800'}],//[1, 100, 200, 500, 800]        
      },
      vAxis: {
        //gridlines: {count: 5},
        viewWindow: {
          max: Math.max(max_P_C, max_R_C),
          min: Math.min(min_P_C, min_R_C),
        },
        title: 'Performance (%)'            
      },
      series: {
        2: {lineWidth: 1, lineDashStyle: [8, 10]},
        3: {lineWidth: 1, lineDashStyle: [8, 10]},
      },
      //pointSize: 0.1,
      //dataOpacity: 0.6
    };  
/////////////
// data_C_1_log is data for log view, use number as x label   
	function to_data_log(data){	// x from [1,2,3,...,200,201,...,206] to [1,2,3,..,200,300,400,..,800]
		for (var i = 201; i <= 206; i++){
			data.setValue(i-1,0,(i-200)*100+200);
		}
		return data;
	}
// data_C_1_linear is data for linear view, use string as x label      
	function to_data_linear(data){	// x from [1,2,3,..,200,300,400,..,800] to [1,2,3,...,200,201,...,206]
		for (var i = 201; i <= 206; i++){
			data.setValue(i-1,0,i);
		}
		return data;
	}
////////////
    //var chart = new google.visualization.LineChart(chartDiv);
    //chart.draw(data_C_1, options);
	function drawLogChart() {
		logView1 = true;
	    var LogChart = new google.visualization.LineChart(chartDiv);
	    LogChart.draw(data_C_1, logOptions);
	    button.innerText = 'Switch to Linear Scale View';
	    button.onclick = drawLinearChart;
    }    
    function drawLinearChart() {
    	logView1 = false;
	    var linearChart = new google.visualization.LineChart(chartDiv);
	    linearChart.draw(data_C_1, linearOptions);
	    button.innerText = 'Switch to Log Scale View';
	    button.onclick = drawLogChart;
    }    
    if (logView1) drawLogChart();
    else drawLinearChart();
}
*/


function plot_412(pairingList){
////// Figure 412, plot R-P for LinearFold-C, data saved in data_C_2
    var data_C_2 = new google.visualization.DataTable();
    data_C_2.addColumn('number', 'PPV');
    data_C_2.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});	// Use custom HTML content for the domain tooltip.
    data_C_2.addColumn('number', title12);
    data_C_2.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_C_2.addColumn('number', title11);
    var l;
    var P_tmp = Math.round(pairingList[2][0]*10000)/100;
    var R_tmp = Math.round(pairingList[2][1]*10000)/100;
    
    data_C_2.addRow([P_tmp, createCustomHTMLContent_2(0, title11, P_tmp, R_tmp), , , R_tmp]);	// row for fixed R-P(CONTRAfold MFE)

    for (var beam=1; beam<=200; beam=beam+1){
      l = beam * 8 + 2;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_C_2.addRow([P_tmp, createCustomHTMLContent_2(beam, title12, P_tmp, R_tmp), R_tmp, , null]);
    }
    
    for (var beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 2;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_C_2.addRow([P_tmp, createCustomHTMLContent_2(beam, title12, P_tmp, R_tmp), R_tmp, , null]);
    }

    // highlight by customizing individual point   
	var rowIndex = BeamFromBar;
	if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
	data_C_2.setValue(rowIndex, 3, slide_highlight_style_P);	//[P, tooltip, R, style, R_fix],

    var options = {
      legend:'top',
      title:'Sensitivity VS PPV (CONTRAfold)',
      backgroundColor: { fill:'transparent' },
      //'width':400,
      //'height':410,
      hAxis: {
        title: 'PPV (%)',
       	viewWindow: {
       		max: max_P_C,
       		min: min_P_C,
     	},
      },
      vAxis: {
        title: 'Sensitivity (%)',
       	viewWindow: {
       		max: max_R_C,
       		min: min_R_C,
     	},
      },
      focusTarget: 'category',
      tooltip: { isHtml: true },
      series: {
        1: {
          pointSize: 12,
          pointShape: {
            type: 'star',
            sides: 5,
            dent: 0.6
          },
          type: 'scatter'
        }
      },
      //pointSize: 0.1,
      //dataOpacity: 0.6      
    };  
    //var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_412'));
    var chart = new google.visualization.LineChart(document.getElementById('chart_div_412'));
    chart.draw(data_C_2, options);





    // The select handler. Call the chart's getSelection() method
	function selectHandler() {
    	var selectedItem = chart.getSelection()[0];
    	if (selectedItem) {
    	if (selectedItem.row == 0) return;
      	//var value = data.getValue(selectedItem.row, selectedItem.column);
      	BeamFromBar = selectedItem.row;		  							// 1-206, need to be converted to 1-200,300,400,500,600,700,800
      	document.getElementById("beamslidebar").value = BeamFromBar;	// update the position on beam size slide bar
      	if (BeamFromBar > 200) BeamFromBar = (BeamFromBar - 200) * 100 + 200;      	
      	change('   (selected from chart)');
    	}
  	}

	// Listen for the 'select' event, and call my function selectHandler() when the user selects something on the chart.
	google.visualization.events.addListener(chart, 'select', selectHandler);    
}



function plot_421(pairingList){
////// Figure 421, plot P/R-beam for LinearFold-V, data saved in data_V_1_log or data_V_1_linear, used in log/linear view
    var button = document.getElementById('change_chart_421');
    var chartDiv = document.getElementById('chart_div_421')
 
// data_V_1_log is data for log view, use number as x label       
    var data_V_1_log = new google.visualization.DataTable();
    data_V_1_log.addColumn('number', 'Beam');
    //data_V_1_log.addColumn({type: 'string', role: 'domain'});
    data_V_1_log.addColumn('number', 'PPV');
    data_V_1_log.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_V_1_log.addColumn('number', 'Sensitivity');
    data_V_1_log.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    //data_V_1_log.addColumn('number', 'F-score');  
    data_V_1_log.addColumn('number', 'PPV_'+title21);
    data_V_1_log.addColumn('number', 'Sensitivity_'+title21);

    var l, beam = 1;
    min_P_V = 100;
    max_P_V = 0;
    min_R_V = 100;
    max_R_V = 0; 

    for (beam=1; beam<=200; beam=beam+1){
      l = beam * 8 + 6;
      if (pairingList[l][0] < min_P_V) min_P_V = pairingList[l][0];		// pairingList[l][0] is P
      if (pairingList[l][0] > max_P_V) max_P_V = pairingList[l][0];
      if (pairingList[l][1] < min_R_V) min_R_V = pairingList[l][1];		// pairingList[l][0] is R
      if (pairingList[l][1] > max_R_V) max_R_V = pairingList[l][1];
      data_V_1_log.addRow([beam, Math.round(pairingList[l][0]*10000)/100, ,
								 Math.round(pairingList[l][1]*10000)/100, ,
								 Math.round(pairingList[6][0]*10000)/100, 
								 Math.round(pairingList[6][1]*10000)/100]); 
    }
    for (beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 6;  
      if (pairingList[l][0] < min_P_V) min_P_V = pairingList[l][0];		// pairingList[l][0] is P
      if (pairingList[l][0] > max_P_V) max_P_V = pairingList[l][0];
      if (pairingList[l][1] < min_R_V) min_R_V = pairingList[l][1];		// pairingList[l][0] is R
      if (pairingList[l][1] > max_R_V) max_R_V = pairingList[l][1];      
      data_V_1_log.addRow([beam, Math.round(pairingList[l][0]*10000)/100, ,
								 Math.round(pairingList[l][1]*10000)/100, ,
								 Math.round(pairingList[6][0]*10000)/100, 
								 Math.round(pairingList[6][1]*10000)/100]); 
    }

	// highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
	data_V_1_log.setValue(rowIndex-1, 2, slide_highlight_style_P);	//[beam, P, style, R, null, P_fix, R_fix],
	data_V_1_log.setValue(rowIndex-1, 4, slide_highlight_style_R);	//[beam, P, style, R, style, P_fix, R_fix],


// data_V_1_linear is data for linear view, use string as x label      
    var data_V_1_linear = new google.visualization.DataTable();
    data_V_1_linear.addColumn('string', 'Beam');
    data_V_1_linear.addColumn('number', 'PPV');
    data_V_1_linear.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_V_1_linear.addColumn('number', 'Sensitivity');
    data_V_1_linear.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_V_1_linear.addColumn('number', 'PPV_'+title21);
    data_V_1_linear.addColumn('number', 'Sensitivity_'+title21);

    for (beam=1; beam<=200; beam=beam+1){
      l = beam * 8 + 6;
      data_V_1_linear.addRow([''+beam, Math.round(pairingList[l][0]*10000)/100, ,
                                       Math.round(pairingList[l][1]*10000)/100, ,
									   Math.round(pairingList[6][0]*10000)/100, 
									   Math.round(pairingList[6][1]*10000)/100]); 
    }
    for (beam=300; beam<=800; beam=beam+20){
      l = (Math.round(beam/100)+198) * 8 + 6;  
      data_V_1_linear.addRow([''+beam, Math.round(pairingList[l][0]*10000)/100, ,
                                       Math.round(pairingList[l][1]*10000)/100, ,
									   Math.round(pairingList[6][0]*10000)/100, 
									   Math.round(pairingList[6][1]*10000)/100]);
    }
	// highlight by customizing individual point
	data_V_1_linear.setValue(rowIndex-1, 2, slide_highlight_style_P);	//[beam, P, style, R, null, P_fix, R_fix],
	data_V_1_linear.setValue(rowIndex-1, 4, slide_highlight_style_R);	//[beam, P, style, R, style, P_fix, R_fix],

    min_P_V = 5 * Math.floor(min_P_V*100/5);
    max_P_V = 5 * Math.ceil(max_P_V*100/5);
    min_R_V = 5 * Math.floor(min_R_V*100/5);
    max_R_V = 5 * Math.ceil(max_R_V*100/5);
    var logOptions = {
      legend:'top',
      title:'Performance VS Beam size (LinearFold-V)',
      focusTarget: 'category',
      backgroundColor: { fill:'transparent' },
      //'is3D':true,
      hAxis: {
        //slantedText:true,
        //slantedTextAngle:12,
        scaleType: 'log',
        //gridlines: {count: 40},
        title: 'Beam size (log scale view)',
      },

      vAxis: {
        //gridlines: {count: 4},
        viewWindow: {
          max: Math.max(max_P_V, max_R_V),
          min: Math.min(min_P_V, min_R_V),
        },
        //minValue: Math.min(min_P_V, min_R_V), maxValue: Math.max(max_P_V, max_R_V),
        title: 'Performance (%)',
      },
      series: {
        2: {lineWidth: 1, lineDashStyle: [8, 10]},
        3: {lineWidth: 1, lineDashStyle: [8, 10]},
          //type: 'scatter'
      },
      curveType: 'function',
      //pointSize: 0.1,
      //dataOpacity: 0.6
    };  

    var linearOptions = {
      legend:'top',
      title:'Performance VS Beam size (LinearFold-V)',
      focusTarget: 'category',
      backgroundColor: { fill:'transparent' },
      //'is3D':true,
      hAxis: {
        slantedText:true,
        slantedTextAngle:9,
        gridlines: {count: 2},
        title: 'Beam size (linear scale view)'
      },
      vAxis: {
        //gridlines: {count: 5},
        viewWindow: {
          max: Math.max(max_P_V, max_R_V),
          min: Math.min(min_P_V, min_R_V),
        },
        //minValue: 15,
        title: 'Performance (%)'            
      },
      series: {
        2: {lineWidth: 1, lineDashStyle: [8, 10]},
        3: {lineWidth: 1, lineDashStyle: [8, 10]},
      },
      //pointSize: 0.1,
      //dataOpacity: 0.6
    };  


    var thisChart;
    //var chart = new google.visualization.LineChart(chartDiv);
    //chart.draw(data_V_1, options);
    function drawLinearChart() {
    	logView2 = false;
	    var linearChart = new google.visualization.LineChart(chartDiv);
	    linearChart.draw(data_V_1_linear, linearOptions);
	    button.innerText = 'Switch to Log Scale';
	    button.onclick = drawLogChart;
	    thisChart = linearChart;
    }    
	function drawLogChart() {
		logView2 = true;
	    var logChart = new google.visualization.LineChart(chartDiv);
	    logChart.draw(data_V_1_log, logOptions);
	    button.innerText = 'Switch to Linear Scale';
	    button.onclick = drawLinearChart;
	    thisChart = logChart;
    }    
    if (logView2) drawLogChart();
    else drawLinearChart();


    // The select handler. Call the chart's getSelection() method
	function selectHandler() {
    	var selectedItem = thisChart.getSelection()[0];
    	if (selectedItem) {
      	//var value = data.getValue(selectedItem.row, selectedItem.column);
      	BeamFromBar = selectedItem.row + 1;  							// 1-206, need to be converted to 1-200,300,400,500,600,700,800
      	document.getElementById("beamslidebar").value = BeamFromBar;	// update the position on beam size slide bar
      	if (BeamFromBar > 200) BeamFromBar = (BeamFromBar - 200) * 100 + 200;      	
      	change('   (selected from chart)');
    	}
  	}

	// Listen for the 'select' event, and call my function selectHandler() when the user selects something on the chart.
	google.visualization.events.addListener(thisChart, 'select', selectHandler);
}


function plot_422(pairingList){
////// Figure 422, plot R-P for LinearFold-V, data saved in data_V_2
    var data_V_2 = new google.visualization.DataTable();
    data_V_2.addColumn('number', 'PPV');
    data_V_2.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});	// Use custom HTML content for the domain tooltip.
    data_V_2.addColumn('number', title22);
    data_V_2.addColumn({'type': 'string', 'role': 'style'});	//Customizing individual points
    data_V_2.addColumn('number', title21);
    var l;
    var P_tmp = Math.round(pairingList[6][0]*10000)/100;
    var R_tmp = Math.round(pairingList[6][1]*10000)/100;
    
    data_V_2.addRow([P_tmp, createCustomHTMLContent_2(0, title21, P_tmp, R_tmp), , , R_tmp]);	// row for fixed R-P(Vienna RNAfold)

    for (var beam=1; beam<=200; beam=beam+1){
      l = beam * 8 + 6;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_V_2.addRow([P_tmp, createCustomHTMLContent_2(beam, title22, P_tmp, R_tmp), R_tmp, , null]);
    }
    
    for (var beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 6;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_V_2.addRow([P_tmp, createCustomHTMLContent_2(beam, title22, P_tmp, R_tmp), R_tmp, , null]);
    }

    // highlight by customizing individual point   
	var rowIndex = BeamFromBar;
	if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
	data_V_2.setValue(rowIndex, 3, slide_highlight_style_P);	//[P, tooltip, R, style, R_fix],

    var options = {
      legend:'top',
      title:'Sensitivity VS PPV (Vienna)',
      backgroundColor: { fill:'transparent' },
      //'width':400,
      //'height':410,
      hAxis: {
        title: 'PPV (%)',
       	viewWindow: {
       		max: max_P_V,
       		min: min_P_V,
     	},
      },
      vAxis: {
        title: 'Sensitivity (%)',
       	viewWindow: {
       		max: max_R_V,
       		min: min_R_V,
     	},
      },
      focusTarget: 'category',
      tooltip: { isHtml: true },
      //series: {
      //  2: {curveType: 'function'}
      //}

      series: {
        1: {
          pointSize: 12,
          pointShape: {
            type: 'star',
            sides: 5,
            dent: 0.6
          },
          type: 'scatter'
        }
      },
      //pointSize: 0.1,
      //dataOpacity: 0.6      
    };  
    //var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_422'));
    var chart = new google.visualization.LineChart(document.getElementById('chart_div_422'));
    chart.draw(data_V_2, options);


    // The select handler. Call the chart's getSelection() method
	function selectHandler() {
    	var selectedItem = chart.getSelection()[0];
    	if (selectedItem) {
    	if (selectedItem.row == 0) return;
      	//var value = data.getValue(selectedItem.row, selectedItem.column);
      	BeamFromBar = selectedItem.row;		  							// 1-206, need to be converted to 1-200,300,400,500,600,700,800
      	document.getElementById("beamslidebar").value = BeamFromBar;	// update the position on beam size slide bar
      	if (BeamFromBar > 200) BeamFromBar = (BeamFromBar - 200) * 100 + 200;      	
      	change('   (selected from chart)');
    	}
  	}

	// Listen for the 'select' event, and call my function selectHandler() when the user selects something on the chart.
	google.visualization.events.addListener(chart, 'select', selectHandler);     

}

function createCustomHTMLContent_1(beam, label1, label2, label3, label4, P, R, P_fix, R_fix) {
	return '<p style="font-family:verdana;">&nbsp&nbsp' + 
					'Beam size: <span style="color:red;"><b>' + beam +'</b></span>&nbsp&nbsp<br>&nbsp&nbsp' +
					'<span style="color:#1560d8;font-size:60%;">█</span> ' + label1 + ': <b>' + P.toFixed(2) +'%</b>&nbsp&nbsp<br>&nbsp&nbsp' +
					'<span style="color:#d62728;font-size:60%;">█</span> ' + label2 + ': <b>' + R.toFixed(2) +'%</b>&nbsp&nbsp<br>&nbsp&nbsp' +
					'<span style="color:#ff7f0e;font-size:60%;">█</span> ' + label3 + ': <b>' + P_fix.toFixed(2) +'%</b>&nbsp&nbsp<br>&nbsp&nbsp' +
					'<span style="color:#2ca02c;font-size:60%;">█</span> ' + label4 + ': <b>' + R_fix.toFixed(2) +'%</b>&nbsp&nbsp<br></p>';
					//160% ■, or 60% █
}

function createCustomHTMLContent_2(beam, legendLabel, P, R) {
/*	var customedHTML = '<p>' + legendLabel + '<br>' +
					xLabel + ': <b>' + P +'</b><br>' +
					yLabel + ': <b>' + R +'</b>';
	if (beam > 0) customedHTML += '<br>at beam size: <b>' + beam +'</b>';
	customedHTML += '</p>';
	return customedHTML;*/
	var customedHTML = '<p style="font-family:verdana;">&nbsp&nbsp' + legendLabel + '<br>&nbsp&nbsp' +
					'PPV: <b>' + P.toFixed(2) +'%</b>&nbsp&nbsp<br>&nbsp&nbsp' +
					'Sensitivity: <b>' + R.toFixed(2) +'%</b>&nbsp&nbsp';
	if (beam > 0) customedHTML += '<br>&nbsp&nbspat beam size: <span style="color:red;"><b>' + beam +'</b></span>&nbsp&nbsp';
	customedHTML += '<br>';
	customedHTML += '</p>';
	return customedHTML;
}


/*
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawCurveTypes);

function drawCurveTypes() {
      var data_C_1 = new google.visualization.DataTable();
      data_C_1_linear.addColumn('number', 'Beam');
      data_C_1_linear.addColumn('number', 'P');
      data_C_1_linear.addColumn('number', 'R');
      data_C_1_linear.addColumn('number', 'F');

      data_C_1_linear.addRows([
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

