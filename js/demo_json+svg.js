function getNode(n, v) {
    //console.log(v);
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
    //console.log(n);
  return n
}



//svg_go(d=40,R=250,circleScale=50,halfOpen=20);
function svg_load_draw_go(d=40,R=250,circleScale=50,halfOpen=20){
    var pairingFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/demo_pairing_for_js/combine_pairing_"+seriesNo+"."+seqNo; //"16s.seq13";
    //var pairingFile = "./demo_data/demo_pairing_for_js/combine_pairing_"+seriesNo+"."+seqNo; //"16s.seq13";
    //console.log('beam size: '+BeamFromBar+', file read: '+seriesNo+"_"+seqNo);
    $.getJSON(pairingFile, function(data,status) {
        $("#mySVG").empty();
        $("#mySVGref").empty();
        svg_draw_graphs(data.pairing, d,R,circleScale,halfOpen);
        draw_plots(data.pairing);
    });
}

function svg_draw_graphs(pairingList, d,R,circleScale,halfOpen=20) {
        //disp_circle_legend();
        svg_drawFrame("mySVG",pairingList[0],d,R,circleScale,halfOpen,half="left");
        svg_fillCircles("mySVG",pairingList,d,R,circleScale,halfOpen,0);

        svg_drawFrame("mySVG",pairingList[0],d,R,circleScale,halfOpen,half="right");
        svg_fillCircles("mySVG",pairingList,d,R,circleScale,halfOpen,BeamFromBar);
        
        svg_drawFrame("mySVGref",pairingList[0],d,R,circleScale,halfOpen,half="showRef");
        svg_fillCircles("mySVGref",pairingList,d,R,circleScale,halfOpen,-1);    
}

function svg_drawFrame(svgid,N,d,R,circleScale,halfOpen=20,half="left"){
    var a = R+d;
    var b =3*R + 3*d;   //2*d is also ok
    var extDis = d/2.8;
    
    //get corresponding svg object
    var svg = document.getElementById(svgid);
    var svg1 = $('#'+svgid);
    //check if current explorer support Canvas object, to avoid sytax error in some html5-unfriendly explorers.
    //write titles
    if ((svg != null) && (svgid == 'mySVG'))
    {  
        //set font and style
        titleFont = "Courier";    //italic
        titleSize = 30;

        //display legend for prediction circle graphs, with box
        var x1 = 1.76*R, x2 = 3*R, y1 = 2.2*R, y2 = 2.52*R;
        var boxstr = 'M '+x1+' '+y1+' L '+x2+' '+y1+' L '+x2+' '+y2+' L '+x1+' '+y2+' L '+x1+' '+y1;
        var attr = {d: boxstr, stroke:"LightGray", fill:"none", strokeWidth:1}; // instead of fill:"transparent"
        //svg.appendChild(getNode('path', attr));
        svg1.append(getNode('path', attr));

        var legend = getNode('text', {x: 1.8*R, y:R+R+3.5*H_title, fontFamily:titleFont, fontSize:18, fill:'blue'});
        legend.innerHTML = "⌒ True Positive pairs(hit)";
        svg.appendChild(legend);    
        //legend = getNode('text', {x: x0+R/0.65, y:y1+R/3+i*H_title, fontFamily:'Courier', fontSize:18});
        //legend.innerHTML = gold[i].length/2+" ("+(gold[i].length/n_pairs*50).toFixed(2)+"%)";
        //svg.appendChild(newmark);    
        var legend = getNode('text', {x: 1.8*R, y:R+R+4.7*H_title, fontFamily:titleFont, fontSize:18, fill:'red'});
        legend.innerHTML = "⌒ False Positive pairs";
        svg.appendChild(legend);   
        var legend = getNode('text', {x: 1.8*R, y:R+R+5.9*H_title, fontFamily:titleFont, fontSize:18, fill:'Gray'});
        legend.innerHTML = "⌒ False Negative pairs";
        svg.appendChild(legend);  
    }


    if (half == "left"){
        var newtext = getNode('text', {x: R-2*d,   y:d-0.5*H_title, fontFamily:titleFont, fontSize:titleSize});
        newtext.textContent = titles[0];
        svg.appendChild(newtext);
        var newtext = getNode('text', {x: R-2*d,   y:a+a+d+0.5*H_title, fontFamily:titleFont, fontSize:titleSize});
        newtext.textContent = titles[1];
        svg.appendChild(newtext);

        svg_drawCircle(svgid,a,a+H_title,R,halfOpen);
        svg_drawCircle(svgid,a,b+2*H_title,R,halfOpen);
        svg_drawCircleMarks(svgid,N,a,a+H_title,R,extDis,circleScale,halfOpen);
        svg_drawCircleMarks(svgid,N,a,b+2*H_title,R,extDis,circleScale,halfOpen);

    }else if (half == "right"){
        var newtext = getNode('text', {x:b-2.7*d, y: d-0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"}); //Linear CONTRAfold
        newtext.textContent = titles[2];
        svg.appendChild(newtext);
        var newtext = getNode('text', {x:b-2.7*d, y: a+a+d+0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"});  //Linear Vienna
        newtext.textContent = titles[3];
        svg.appendChild(newtext);

        svg_drawCircle(svgid,b,a+H_title,R,halfOpen);
        svg_drawCircle(svgid,b,b+2*H_title,R,halfOpen);
        svg_drawCircleMarks(svgid,N,b,a+H_title,R,extDis,circleScale,halfOpen);
        svg_drawCircleMarks(svgid,N,b,b+2*H_title,R,extDis,circleScale,halfOpen);
    }else{      // half == "showRef"
        //var svg_ref = document.getElementById('mySVGref');
        var newtext = getNode('text', {x: R-0.7*d,   y:d-0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"}); //Linear CONTRAfold
        newtext.textContent = titles[4];
        svg.appendChild(newtext);

        svg_drawCircle(svgid,a,a+H_title,R,halfOpen);
        svg_drawCircleMarks(svgid,N,a,a+H_title,R,extDis,circleScale,halfOpen);
    }
}


// draw the open circle
function svg_drawCircle(svgid,x0,y0,R,halfOpen=20){
    //get svg object
    var svg = document.getElementById(svgid);
    //check if current explorer support svg object, to avoid sytax error in some html5-unfriendly explorers.
    if(svg != null)
    {  
        //d="M x1 y1 A rx ry, x-axis-rotation, large-arc-flag,sweep-flag, x2 y2"
        //arc is a part of an eclipse with rx,ry and rotated, starts from (x1,y1) and ends at (x2,y2), small arc if large-arc-flag== 0, colockwise arc if sweep-flag == 1
        var dx = R * Math.sin(2*Math.PI * halfOpen/360);
        var dy = R * Math.cos(2*Math.PI * halfOpen/360);
        var pathstr = 'M '+(x0+dx)+' '+(y0-dy)+' A '+R+' '+R+' 0 1 1 '+(x0-dx)+' '+(y0-dy);
        var attr = {d: pathstr, stroke:"black", fill:"none", strokeWidth:1}; //instead of fill:"transparent"
        var newarc = getNode('path', attr);
        svg.appendChild(newarc);
    }
}



function svg_drawCircleMarks(svgid,N,x0,y0,R,extDis,circleScale=50,halfOpen=20){

    //get corresponding svg object
    var svg = document.getElementById(svgid);
    //check if current explorer support svg object, to avoid sytax error in some html5-unfriendly explorers.
    if(svg != null)
    {  
        if (N > 1000) circleScale = Math.ceil(N/1000)*50;
        else circleScale = Math.ceil(N/200)*10;

        //set font and style
        markFont = "normal";    //italic
        markSize = 10;

        offset = extDis/2;                // make numbers offset to left 
        var alpha;
        var p = new Object;
        var theta = halfOpen/360 * 2*Math.PI;
        for (var i=circleScale; i<N-1; i=i+circleScale)
        {
            alpha = i/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
            p.x = x0 + (R+extDis)*Math.sin(theta+alpha);//-offset;
            p.y = y0 - (R+extDis)*Math.cos(theta+alpha);
            angle = alpha*360/2/Math.PI+halfOpen;
            //if (angle > 90 && angle < 270) angle += 180;
            rotateattr = "rotate("+angle+" "+p.x+","+p.y+")";
            var newmark = getNode('text', {x: p.x, y:p.y, fontFamily:markFont, fontSize:markSize, transform:rotateattr});
            newmark.textContent = ''+(i+1);
            svg.appendChild(newmark);
        }

        // to draw the mark of 5'
        alpha = 0;
        p.x = x0 + (R+extDis)*Math.sin(theta+alpha)-2*offset;
        p.y = y0 - (R+extDis)*Math.cos(theta+alpha)+offset;
        var newmark = getNode('text', {x: p.x, y:p.y, fontFamily:markFont, fontSize:markSize});
        newmark.textContent = "5'";
        svg.appendChild(newmark);

        // to draw the mark of 3'
        alpha = (360-2*halfOpen)/360 * 2*Math.PI;
        p.x = x0 + (R+extDis)*Math.sin(theta+alpha)+1.5*offset;
        p.y = y0 - (R+extDis)*Math.cos(theta+alpha)+offset;
        var newmark = getNode('text', {x: p.x, y:p.y, fontFamily:markFont, fontSize:markSize});
        newmark.textContent = "3'";
        svg.appendChild(newmark);
    }
}

function svg_fillCircles(svgid,data,d,R,circleScale,halfOpen=20,beamsize=0){
    var a = R + d;
    var b = 3*R + 3*d;  //2*d is also ok
    //var data = loadInfo();
    var N = data[0];
    //var pairs;
    var l;  //line number
    if (beamsize < 0){      // show Ref
        l = 1658;
    }
    else if (beamsize <= 200){
        l= 8*beamsize+2;
    }else{
        l = (beamsize/100+198)*8+2;
    }
    //console.log(l+'+'+data.length);
    if (beamsize == 0){
        //fill circle top-left with cf_missing, cf_hit, cf_wrong
        svg_fillCircle(svgid,data[l],data[l+1],data[l+2],data[l+3],N,a,a+H_title,R,halfOpen);
        //fill circle bottom-left with vn_missing, vn_hit, vn_wrong
        svg_fillCircle(svgid,data[l+4],data[l+5],data[l+6],data[l+7],N,a,b+2*H_title,R,halfOpen);
    }else if (beamsize > 0){
        //fill circle top-right with linearcf_missing, linearcf_hit, linearcf_wrong
        svg_fillCircle(svgid,data[l],data[l+1],data[l+2],data[l+3],N,b,a+H_title,R,halfOpen);
        //fill circle bottom-right with linearvn_missing, linearvn_hit, linearvn_wrong
        svg_fillCircle(svgid,data[l+4],data[l+5],data[l+6],data[l+7],N,b,b+2*H_title,R,halfOpen);
    }else{
        //fill circle for show_ref with linearcf_missing, linearcf_hit, linearcf_wrong
        svg_fillCircle_ref(svgid,data[l],N,a,a+H_title,R,halfOpen);
    }
}


function svg_fillCircle(svgid,P_R_F,missing,hit,wrong,N,x0,y0,R,halfOpen=20){

    var missing_pair = missing.length;
    for (var i=0; i<missing_pair; i+=2){
        svg_drawArc(svgid,missing[i],missing[i+1],N,x0,y0,R,'LightGray',halfOpen); 
    }

    var hit_pair = hit.length;
    for (var i=0; i<hit_pair; i+=2){
        svg_drawArc(svgid,hit[i],hit[i+1],N,x0,y0,R,'blue',halfOpen);
    }

    var wrong_pair = wrong.length;
    for (var i=0; i<wrong_pair; i+=2){
        //svg_drawArc(wrong[i],wrong[i+1],N,x0,y0,R,'red',halfOpen);
        svg_drawArc(svgid,wrong[i],wrong[i+1],N,x0,y0,R,'red',halfOpen);
    }

    //get corresponding svg object
    var svg = document.getElementById(svgid);
    if(svg != null)
    {  
        //set font and style
        PRFont = "normal";    //italic
        PRSize = 18;
        var newmark = getNode('text', {x: x0-R/1.4, y:y0-R-H_title/2, fontFamily:PRFont, fontSize:PRSize, class:"titles"});
        newmark.textContent = "PPV="+(P_R_F[0]*100).toFixed(2)+      //(P_R_F[0]*100).toFixed(2).toString()
                     ", Sensitivity="+(P_R_F[1]*100).toFixed(2)+
                     " (F="+(P_R_F[2]*100).toFixed(2)+", Pair="+((hit_pair+wrong_pair)/2).toString()+")";
        svg.appendChild(newmark);    
    }   
}

function svg_fillCircle_ref(svgid,gold,N,x0,y0,R,halfOpen=20){
    colors = ['lime','mediumblue','orangered','fuchsia','dodgerblue','blueviolet'];
    brackets = ['()','[]','<>','{}'];
    var n_page = gold.length;
    var n_free_pairs=gold[0].length/2, n_pairs=0;
    var y1 = y0-R-0.5*H_title;

    //get corresponding svg object
    var svg = document.getElementById(svgid);
    for (var i = 0; i < n_page; i += 1){
        l = gold[i].length;
        n_pairs += l/2
        for (var j = 0; j < l; j += 2 )
            svg_drawArc(svgid,gold[i][j],gold[i][j+1],N,x0,y0,R,colors[i],halfOpen);
    }

    for (var i = 0; i < n_page; i += 1){
        var newmark = getNode('text', {x: x0+R/0.9, y:y1+R/3+i*H_title, fontFamily:'Courier', fontSize:18, fill:colors[i]});
        //newmark.innerHTML = brackets[i]+" Pairs: "+gold[i].length/2+" ("+(gold[i].length/n_pairs*50).toFixed(2)+"%)";
        newmark.innerHTML = brackets[i]+" Pairs: ";
        svg.appendChild(newmark);    
        newmark = getNode('text', {x: x0+R/0.65, y:y1+R/3+i*H_title, fontFamily:'Courier', fontSize:18});
        newmark.innerHTML = gold[i].length/2+" ("+(gold[i].length/n_pairs*50).toFixed(2)+"%)";
        svg.appendChild(newmark);    
    }


    if(svg != null)
    {  
        //set font and style
        PRFont = "normal";    //italic
        PRSize = 18;
        var newmark = getNode('text', {x: x0-R/2, y:y1, fontFamily:PRFont, fontSize:PRSize, class:"titles"});
        newmark.textContent = "Pairs: "+n_pairs+", Pseudoknot pairs: "+ ((n_pairs-n_free_pairs)/n_pairs*100).toFixed(2)+"%";
        svg.appendChild(newmark);    
    }   
    
}

function svg_drawArc(svgid,n1,n2,N,x0,y0,R,color,halfOpen=20){

    var p1 = new Object;
    var p2 = new Object;
    var theta = halfOpen/360 * 2*Math.PI;
    var alpha1 = n1/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
    var alpha2 = n2/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
    
    R -= 0.5;
    p1.x = x0 + R*Math.sin(theta+alpha1);
    p1.y = y0 - R*Math.cos(theta+alpha1);

    p2.x = x0 + R*Math.sin(theta+alpha2);
    p2.y = y0 - R*Math.cos(theta+alpha2);

    var arc = true;
    var r;
    var deltaAlpha = alpha2-alpha1;
    //if (Math.abs(n2-n1-(N-1)*90/(180-halfOpen)) < 2)
    if (Math.abs(n2-n1-(N-1)*90/(180-halfOpen)) < Math.round(N/1000))   //2 is enough for N<=3000, if N is up to 4000, we can use 3 instead of 2
    {
        arc = false;
    } else
    {
        r = R * Math.abs(Math.tan((deltaAlpha)/2)); 
    }
    //get svg object
    var svg = document.getElementById(svgid);
    //check if current explorer support svg object, to avoid sytax error in some html5-unfriendly explorers.
    if(svg != null)
    {  
        var clockwise = 0;
        var arcWidth = 1;
        if (N <= 500){arcWidth = 2.25-N/400.0;}//100: 2, 500: 1   -(x-100)/400+2=2.25-x/400
        if (N > 500){
            if (N <= 2100){   
                arcWidth = 1.25-N/2000.0;// 500: 1, 2100:0.2
                //300/N;//0.2;
            }else if(N < 4000) arcWidth = 0.2;
            else arcWidth = 800.0 / N;
        }
        //console.log('arcWidth: '+arcWidth);
        if (arc){
            if (deltaAlpha-Math.PI > 1e-4) clockwise = 1;
            //d="M x1 y1 A rx ry, x-axis-rotation, large-arc-flag,sweep-flag, x2 y2"
            //arc is a part of an eclipse with rx,ry and rotated, starts from (x1,y1) and ends at (x2,y2), small arc if large-arc-flag== 0, colockwise arc if sweep-flag == 1
            pathstr = 'M '+p1.x+' '+p1.y+' A '+r+' '+r+' 0 0 '+clockwise+' '+p2.x+' '+p2.y;
            arcid = 'd='+(n2-n1)+', ['+(n1+1)+', '+(n2+1)+']';
            var attr = {d: pathstr, stroke:color, fill:"none", strokeWidth:arcWidth, class:"tooltips-arcs arcs"+color, id:arcid};   //instead of fill:"transparent"
            var newarc = getNode('path', attr);
            svg.appendChild(newarc);
        } else {
            var newline = getNode('line', {x1: p1.x, y1:p1.y, x2: p2.x, y2:p2.y, stroke:color, strokeWidth:arcWidth});  // class:"arcs"
            svg.appendChild(newline);
        }
    }
}



var H_title = 20;
var seriesNo = "grp1";
var seqNo = "seq00";
var BeamFromBar = 100;
var titles = ["CONTRAfold MFE", "Vienna RNAfold", "LinearFold-C", "LinearFold-V", "Gold/Ref"];
var min_P_C, max_P_C, min_R_C, max_R_C; 
var min_P_V, max_P_V, min_R_V, max_R_V; 
//var slide_highlight_style_P = 'point { size: 7; shape-type: star; shape-dent:0.5 ; shape-sides: 5; fill-color: #6ca1f7; visible:true}';
var slide_highlight_style_P = 'point { size: 5; shape-type: circle; fill-color:#013ea0; visible:true}';
var slide_highlight_style_R = 'point { size: 5; shape-type: circle; fill-color:#bf0f0f; visible:true}';
var logView1 = true;
var logView2 = true;


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
    BeamFromBar = document.getElementById("beamslidebar").value;    // this is a string, instead of number...
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


function fillPage_go(d=40,R=250,circleScale=50,halfOpen=20){
    fillSeqText();                                  // fill sequence and pairing structures at bottom of page
    google.charts.load('current', {packages: ['corechart']});
    //google.charts.setOnLoadCallback(load_draw_go(d,R,circleScale,halfOpen));      // draw graphs and plots on the right
    google.charts.setOnLoadCallback(function(){svg_load_draw_go(d,R,circleScale,halfOpen)});    // draw graphs and plots on the right
}

function fillSeqText(){
    var seqFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/demo_rearranged_results/combine_"+seriesNo+"."+seqNo;
    //var seqFile = "./demo_data/demo_rearranged_results/combine_"+seriesNo+"."+seqNo;
    $.get(seqFile, function(data,status) {
        var lines = data.split("\n");
        //document.getElementById("seqName").innerHTML = 'seq: <br>'+lines[1];
        //document.getElementById("ref").innerHTML = 'ref: <br>' + lines[3];
        //document.getElementById("cf").innerHTML = 'CONTRAfold MFE: <br>' + lines[5];
        //document.getElementById("vn").innerHTML = 'Vienna RNAfold: <br>' + lines[7];
        document.getElementById("seqName0").innerHTML = 'seq: ';//<br>';
        document.getElementById("ref0").innerHTML = 'ref: ';//<br>';
        document.getElementById("cf0").innerHTML = 'CONTRAfold MFE: ';//<br>';
        document.getElementById("vn0").innerHTML = 'Vienna RNAfold: ';//<br>';
        document.getElementById("lcf0").innerHTML = 'LinearFold-C: ';//<br>';
        document.getElementById("lvn0").innerHTML = 'LinearFold-V: ';//<br>';

        //$("#seqName").text(lines[1]);
        //$("#ref").text(lines[3]);
        //$("#cf").text(lines[5]);
        //$("#vn").text(lines[7]);
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
        //document.getElementById("lcf").innerHTML = 'LinearFold-C: <br>' + lines[beamline];
        //document.getElementById("lvn").innerHTML = 'LinearFold-V: <br>' + lines[beamline+4];

        //DOM or jQuery
        document.getElementById("btn_copy_seq").innerText = 'Copy to clipboard';
        //$("#btn_copy_seq").text('Copy text to clipboard');
        $("#btn_copy_ref").text('Copy to clipboard');
        $("#btn_copy_cf").text('Copy to clipboard');
        $("#btn_copy_vn").text('Copy to clipboard');
        $("#btn_copy_lcf").text('Copy to clipboard');
        $("#btn_copy_lvn").text('Copy to clipboard');
        //$("#btn_copy_lvn").innerText = 'Copy text to clipboard';
    }); 
}


function disp_circle_legend(){

    var legendDiv = document.createElement('div');
    legendDiv.setAttribute('id',"circleLegend");
    var newSpan   = document.createElement('span');
    newSpan.setAttribute("style","font-family:Verdana;color:blue;");
    newSpan.textContent = ' ⌒ True Positive pairs(hit)       ';
    legendDiv.appendChild(newSpan);

    newSpan   = document.createElement('span');
    newSpan.setAttribute("style","font-family:Verdana;color:red;");
    newSpan.textContent = '⌒ False Positive pairs       ';
    legendDiv.appendChild(newSpan);

    newSpan   = document.createElement('span');
    newSpan.setAttribute("style","font-family:Verdana;color:LightGray;");
    newSpan.textContent = '⌒ False Negative pairs';
    legendDiv.appendChild(newSpan);

    //legendDiv.appendChild(newSpan);
    //newSpan   = document.createElement('span', {"style":"font-family:Verdana;color:LightGray;"},'⌒ False Negative pairs');
    //legendDiv.appendChild(newSpan);

    var legendHolder = document.getElementById("legendHolder");
    legendHolder.appendChild(legendDiv);
}

function copy_to_clipboard(text){
    var textArea = document.createElement("textarea");

    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    var successful = false;
    try {
      successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
    return successful;

}


function cp_seq(){
  /* Get the text field */
  var flag = copy_to_clipboard(document.getElementById("seqName").innerText);
  if (flag) $("#btn_copy_seq").text('copied');
  else $("#btn_copy_seq").text('not copied');
}

function cp_ref(){
  /* Get the text field */
  var flag = copy_to_clipboard(document.getElementById("ref").innerText);
  if (flag) $("#btn_copy_ref").text('copied');
  else $("#btn_copy_ref").text('not copied');
}

function cp_cf(){
  /* Get the text field */
  var flag = copy_to_clipboard(document.getElementById("cf").innerText);
  if (flag) $("#btn_copy_cf").text('copied');
  else $("#btn_copy_cf").text('not copied');
}

function cp_vn(){
  /* Get the text field */
  var flag = copy_to_clipboard(document.getElementById("vn").innerText);
  if (flag) $("#btn_copy_vn").text('copied');
  else $("#btn_copy_vn").text('not copied');
}

function cp_lcf(){
  /* Get the text field */
  var flag = copy_to_clipboard(document.getElementById("lcf").innerText);
  if (flag) $("#btn_copy_lcf").text('copied');
  else $("#btn_copy_lcf").text('not copied');
}

function cp_lvn(){
  /* Get the text field */
  var flag = copy_to_clipboard(document.getElementById("lvn").innerText);
  if (flag) $("#btn_copy_lvn").text('copied');
  else $("#btn_copy_lvn").text('not copied');
}





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
    data_C_1.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); // Use custom HTML content for the domain tooltip.
    data_C_1.addColumn('number', 'PPV');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    data_C_1.addColumn('number', 'Sensitivity');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    //data_C_1.addColumn('number', 'F-score');  
    data_C_1.addColumn('number', 'PPV_'+titles[0]);
    data_C_1.addColumn('number', 'Sensitivity_'+titles[0]);

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
      if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];     // pairingList[l][0] is P
      if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
      if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];     // pairingList[l][0] is R
      if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];
      P = Math.round(pairingList[l][0]*10000)/100;
      R = Math.round(pairingList[l][1]*10000)/100;
      data_C_1.addRow([beam, createCustomHTMLContent_1(beam, data_C_1.getColumnLabel(2), data_C_1.getColumnLabel(4), data_C_1.getColumnLabel(6), data_C_1.getColumnLabel(7), P, R, P_fix, R_fix), 
                             P, , R, , P_fix, R_fix]);
    }
    for (beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 2;  
      if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];     // pairingList[l][0] is P
      if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
      if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];     // pairingList[l][0] is R
      if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];      
      P = Math.round(pairingList[l][0]*10000)/100;
      R = Math.round(pairingList[l][1]*10000)/100;
      data_C_1.addRow([beam, createCustomHTMLContent_1(beam, data_C_1.getColumnLabel(2), data_C_1.getColumnLabel(4), data_C_1.getColumnLabel(6), data_C_1.getColumnLabel(7), P, R, P_fix, R_fix), 
                             P, , R, , P_fix, R_fix]);
    }

    // highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
    data_C_1.setValue(rowIndex-1, 3, slide_highlight_style_P);  //[beam, P, style, R, null, P_fix, R_fix],
    data_C_1.setValue(rowIndex-1, 5, slide_highlight_style_R);  //[beam, P, style, R, style, P_fix, R_fix],

    //var max_tmp = max_P_C, min_tmp = min_P_C;
    min_P_C = 5 * Math.floor(min_P_C*100/5);
    max_P_C = 5 * Math.ceil(max_P_C*100/5);
//    if ((max_P_C - min_P_C) % 10 != 0){
//      if (max_P_C - max_tmp < min_tmp - min_P_C) min_P_C -= 5;
//      else max_P_C += 5;
//    }
//    max_tmp = max_R_C, min_tmp = min_R_C;
    min_R_C = 5 * Math.floor(min_R_C*100/5);
    max_R_C = 5 * Math.ceil(max_R_C*100/5);
//    if ((max_R_C - min_R_C) % 10 != 0){
//      if (max_R_C - max_tmp < min_tmp - min_R_C) min_R_C -= 5;
//      else max_R_C += 5;
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
      //curveType: 'function',      // setting the curveType option to function can smooth the lines
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
    function to_data_log(data){ // x from [1,2,3,...,200,201,...,206] to [1,2,3,..,200,300,400,..,800]
        for (var i = 201; i <= 206; i++){
            data.setValue(i-1,0,(i-200)*100+200);
        }
        return data;
    }
// data_C_1_linear is data for linear view, use string as x label      
    function to_data_linear(data){  // x from [1,2,3,..,200,300,400,..,800] to [1,2,3,...,200,201,...,206]
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
        BeamFromBar = selectedItem.row + 1;                             // 1-206, need to be converted to 1-200,300,400,500,600,700,800
        document.getElementById("beamslidebar").value = BeamFromBar;    // update the position on beam size slide bar
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
    data_C_1.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    data_C_1.addColumn('number', 'Sensitivity');
    data_C_1.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    //data_C_1.addColumn('number', 'F-score');  
    data_C_1.addColumn('number', 'PPV_'+titles[0]);
    data_C_1.addColumn('number', 'Sensitivity_'+titles[0]);

    var l, beam = 1;
    min_P_C = pairingList[2][0]; //100;
    max_P_C = pairingList[2][0]; //0;
    min_R_C = pairingList[2][1]; //100;
    max_R_C = pairingList[2][1]; //0;
   
    for (beam=1; beam<=200; beam+=1){
      l = beam * 8 + 2;
      if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];     // pairingList[l][0] is P
      if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
      if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];     // pairingList[l][0] is R
      if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];
      data_C_1.addRow([beam, Math.round(pairingList[l][0]*10000)/100, ,
                             Math.round(pairingList[l][1]*10000)/100, ,
                             Math.round(pairingList[2][0]*10000)/100, 
                             Math.round(pairingList[2][1]*10000)/100]); 
    }
    for (beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 2;  
      if (pairingList[l][0] < min_P_C) min_P_C = pairingList[l][0];     // pairingList[l][0] is P
      if (pairingList[l][0] > max_P_C) max_P_C = pairingList[l][0];
      if (pairingList[l][1] < min_R_C) min_R_C = pairingList[l][1];     // pairingList[l][0] is R
      if (pairingList[l][1] > max_R_C) max_R_C = pairingList[l][1];      
      data_C_1.addRow([beam, Math.round(pairingList[l][0]*10000)/100, ,
                             Math.round(pairingList[l][1]*10000)/100, ,
                             Math.round(pairingList[2][0]*10000)/100, 
                             Math.round(pairingList[2][1]*10000)/100]); 
    }

    // highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
    data_C_1.setValue(rowIndex-1, 2, slide_highlight_style_P);  //[beam, P, style, R, null, P_fix, R_fix],
    data_C_1.setValue(rowIndex-1, 4, slide_highlight_style_R);  //[beam, P, style, R, style, P_fix, R_fix],

    //var max_tmp = max_P_C, min_tmp = min_P_C;
    min_P_C = 5 * Math.floor(min_P_C*100/5);
    max_P_C = 5 * Math.ceil(max_P_C*100/5);
//    if ((max_P_C - min_P_C) % 10 != 0){
//      if (max_P_C - max_tmp < min_tmp - min_P_C) min_P_C -= 5;
//      else max_P_C += 5;
//    }
//    max_tmp = max_R_C, min_tmp = min_R_C;
    min_R_C = 5 * Math.floor(min_R_C*100/5);
    max_R_C = 5 * Math.ceil(max_R_C*100/5);
//    if ((max_R_C - min_R_C) % 10 != 0){
//      if (max_R_C - max_tmp < min_tmp - min_R_C) min_R_C -= 5;
//      else max_R_C += 5;
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
      //curveType: 'function',      // setting the curveType option to function can smooth the lines
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
    function to_data_log(data){ // x from [1,2,3,...,200,201,...,206] to [1,2,3,..,200,300,400,..,800]
        for (var i = 201; i <= 206; i++){
            data.setValue(i-1,0,(i-200)*100+200);
        }
        return data;
    }
// data_C_1_linear is data for linear view, use string as x label      
    function to_data_linear(data){  // x from [1,2,3,..,200,300,400,..,800] to [1,2,3,...,200,201,...,206]
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
    data_C_2.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); // Use custom HTML content for the domain tooltip.
    data_C_2.addColumn('number', titles[2]);
    data_C_2.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    data_C_2.addColumn('number', titles[0]);
    var l;
    var P_tmp = Math.round(pairingList[2][0]*10000)/100;
    var R_tmp = Math.round(pairingList[2][1]*10000)/100;
    
    data_C_2.addRow([P_tmp, createCustomHTMLContent_2(0, titles[0], P_tmp, R_tmp), , , R_tmp]);   // row for fixed R-P(CONTRAfold MFE)

    for (var beam=1; beam<=200; beam=beam+1){
      l = beam * 8 + 2;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_C_2.addRow([P_tmp, createCustomHTMLContent_2(beam, titles[2], P_tmp, R_tmp), R_tmp, , null]);
    }
    
    for (var beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 2;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_C_2.addRow([P_tmp, createCustomHTMLContent_2(beam, titles[2], P_tmp, R_tmp), R_tmp, , null]);
    }

    // highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
    data_C_2.setValue(rowIndex, 3, slide_highlight_style_P);    //[P, tooltip, R, style, R_fix],

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
        BeamFromBar = selectedItem.row;                                 // 1-206, need to be converted to 1-200,300,400,500,600,700,800
        document.getElementById("beamslidebar").value = BeamFromBar;    // update the position on beam size slide bar
        if (BeamFromBar > 200) BeamFromBar = (BeamFromBar - 200) * 100 + 200;       
        change('   (selected from chart)');
        }
    }

    // Listen for the 'select' event, and call my function selectHandler() when the user selects something on the chart.
    google.visualization.events.addListener(chart, 'select', selectHandler);    
}



function plot_421(pairingList){
////// Figure 421, plot P/R-beam for LinearFold-C, data saved in data_V_1_log or data_V_1_linear, used in log/linear view
    var button = document.getElementById('change_chart_421');
    var chartDiv = document.getElementById('chart_div_421');
    //console.log('plot data generated');

// data_V_1 is data ready for log or linear view, to be transfered later
    var data_V_1 = new google.visualization.DataTable();
    data_V_1.addColumn('number', 'Beam');
    data_V_1.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); // Use custom HTML content for the domain tooltip.
    data_V_1.addColumn('number', 'PPV');
    data_V_1.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    data_V_1.addColumn('number', 'Sensitivity');
    data_V_1.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    //data_V_1.addColumn('number', 'F-score');  
    data_V_1.addColumn('number', 'PPV_'+titles[1]);
    data_V_1.addColumn('number', 'Sensitivity_'+titles[1]);

    var l, beam = 1;
    min_P_V = pairingList[6][0]; //100;
    max_P_V = pairingList[6][0]; //0;
    min_R_V = pairingList[6][1]; //100;
    max_R_V = pairingList[6][1]; //0;

    var P_fix = Math.round(pairingList[6][0]*10000)/100;
    var R_fix = Math.round(pairingList[6][1]*10000)/100;   
    var P, R;

    for (beam=1; beam<=200; beam+=1){
      l = beam * 8 + 6;
      if (pairingList[l][0] < min_P_V) min_P_V = pairingList[l][0];     // pairingList[l][0] is P
      if (pairingList[l][0] > max_P_V) max_P_V = pairingList[l][0];
      if (pairingList[l][1] < min_R_V) min_R_V = pairingList[l][1];     // pairingList[l][0] is R
      if (pairingList[l][1] > max_R_V) max_R_V = pairingList[l][1];
      P = Math.round(pairingList[l][0]*10000)/100;
      R = Math.round(pairingList[l][1]*10000)/100;
      data_V_1.addRow([beam, createCustomHTMLContent_1(beam, data_V_1.getColumnLabel(2), data_V_1.getColumnLabel(4), data_V_1.getColumnLabel(6), data_V_1.getColumnLabel(7), P, R, P_fix, R_fix), 
                             P, , R, , P_fix, R_fix]);
    }
    for (beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 6;
      if (pairingList[l][0] < min_P_V) min_P_V = pairingList[l][0];     // pairingList[l][0] is P
      if (pairingList[l][0] > max_P_V) max_P_V = pairingList[l][0];
      if (pairingList[l][1] < min_R_V) min_R_V = pairingList[l][1];     // pairingList[l][0] is R
      if (pairingList[l][1] > max_R_V) max_R_V = pairingList[l][1];      
      P = Math.round(pairingList[l][0]*10000)/100;
      R = Math.round(pairingList[l][1]*10000)/100;
      data_V_1.addRow([beam, createCustomHTMLContent_1(beam, data_V_1.getColumnLabel(2), data_V_1.getColumnLabel(4), data_V_1.getColumnLabel(6), data_V_1.getColumnLabel(7), P, R, P_fix, R_fix), 
                             P, , R, , P_fix, R_fix]);
    }

    // highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
    data_V_1.setValue(rowIndex-1, 3, slide_highlight_style_P);  //[beam, P, style, R, null, P_fix, R_fix],
    data_V_1.setValue(rowIndex-1, 5, slide_highlight_style_R);  //[beam, P, style, R, style, P_fix, R_fix],

    //var max_tmp = max_P_V, min_tmp = min_P_V;
    min_P_V = 5 * Math.floor(min_P_V*100/5);
    max_P_V = 5 * Math.ceil(max_P_V*100/5);
//    if ((max_P_V - min_P_V) % 10 != 0){
//      if (max_P_V - max_tmp < min_tmp - min_P_V) min_P_V -= 5;
//      else max_P_V += 5;
//    }
//    max_tmp = max_R_V, min_tmp = min_R_V;
    min_R_V = 5 * Math.floor(min_R_V*100/5);
    max_R_V = 5 * Math.ceil(max_R_V*100/5);
//    if ((max_R_V - min_R_V) % 10 != 0){
//      if (max_R_V - max_tmp < min_tmp - min_R_V) min_R_V -= 5;
//      else max_R_V += 5;
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
      //curveType: 'function',      // setting the curveType option to function can smooth the lines
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
          max: Math.max(max_P_V, max_R_V),
          min: Math.min(min_P_V, min_R_V),
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
// data_V_1_log is data for log view, use number as x label   
    function to_data_log(data){ // x from [1,2,3,...,200,201,...,206] to [1,2,3,..,200,300,400,..,800]
        for (var i = 201; i <= 206; i++){
            data.setValue(i-1,0,(i-200)*100+200);
        }
        return data;
    }
// data_V_1_linear is data for linear view, use string as x label      
    function to_data_linear(data){  // x from [1,2,3,..,200,300,400,..,800] to [1,2,3,...,200,201,...,206]
        for (var i = 201; i <= 206; i++){
            data.setValue(i-1,0,i);
        }
        return data;
    }
///////////*/
    //var chart = new google.visualization.LineChart(chartDiv);
    //chart.draw(data_V_1, options);
    var thisChart;
    function drawLogChart() {
        logView1 = true;
        var logChart = new google.visualization.LineChart(chartDiv);
        logChart.draw(data_V_1, logOptions);
        button.innerText = 'Switch to Linear Scale';
        button.onclick = drawLinearChart;
        thisChart = logChart;
    }    
    function drawLinearChart() {
        logView1 = false;
        var linearChart = new google.visualization.LineChart(chartDiv);
        linearChart.draw(data_V_1, linearOptions);
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
        BeamFromBar = selectedItem.row + 1;                             // 1-206, need to be converted to 1-200,300,400,500,600,700,800
        document.getElementById("beamslidebar").value = BeamFromBar;    // update the position on beam size slide bar
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
    data_V_2.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}}); // Use custom HTML content for the domain tooltip.
    data_V_2.addColumn('number', titles[3]);
    data_V_2.addColumn({'type': 'string', 'role': 'style'});    //Customizing individual points
    data_V_2.addColumn('number', titles[1]);
    var l;
    var P_tmp = Math.round(pairingList[6][0]*10000)/100;
    var R_tmp = Math.round(pairingList[6][1]*10000)/100;
    
    data_V_2.addRow([P_tmp, createCustomHTMLContent_2(0, titles[1], P_tmp, R_tmp), , , R_tmp]);   // row for fixed R-P(Vienna RNAfold)

    for (var beam=1; beam<=200; beam=beam+1){
      l = beam * 8 + 6;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_V_2.addRow([P_tmp, createCustomHTMLContent_2(beam, titles[3], P_tmp, R_tmp), R_tmp, , null]);
    }
    
    for (var beam=300; beam<=800; beam=beam+100){
      l = (beam/100+198) * 8 + 6;
      P_tmp = Math.round(pairingList[l][0]*10000)/100;
      R_tmp = Math.round(pairingList[l][1]*10000)/100;
      data_V_2.addRow([P_tmp, createCustomHTMLContent_2(beam, titles[3], P_tmp, R_tmp), R_tmp, , null]);
    }

    // highlight by customizing individual point   
    var rowIndex = BeamFromBar;
    if (rowIndex > 200) rowIndex = rowIndex / 100 + 198;
    data_V_2.setValue(rowIndex, 3, slide_highlight_style_P);    //[P, tooltip, R, style, R_fix],

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
      //  2: {curveType: 'function'}         // setting the curveType option to function can smooth the lines
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
        BeamFromBar = selectedItem.row;                                 // 1-206, need to be converted to 1-200,300,400,500,600,700,800
        document.getElementById("beamslidebar").value = BeamFromBar;    // update the position on beam size slide bar
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
/*  var customedHTML = '<p>' + legendLabel + '<br>' +
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
          1: {curveType: 'function'}      // setting the curveType option to function can smooth the lines
        }
      };

      var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
      chart.draw(data_C_1, options);
    }

*/

var btn = $('#return-to-top');

$(window).scroll(function() {
  if ($(window).scrollTop() > 200) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '200');
});