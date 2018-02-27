// format of pairing file:
// key = "pairing"
// value = [len, beamsize, t1, t2, name, seq, lc, lv, PRF, hit_lc, _, _, PRF, hit_lv, _, _]

function getNode(n, v) {
    //console.log(v);
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
    //console.log(n);
  return n
}

svg_load_draw_go(d=40,R=250,circleScale=50,halfOpen=20, inFile=$("#path").text()); // draw graphs

//svg_go(d=40,R=250,circleScale=50,halfOpen=20);
function svg_load_draw_go(d=40,R=250,circleScale=50,halfOpen=20, inFile){
    //var pairingFile = "https://raw.githubusercontent.com/KaiboLiu/PairingWebDemo/master/demo_pairing_for_js/combine_pairing_"+seriesNo+"."+seqNo; //"16s.seq13";
    var pairingFile = "http://linearfold.eecs.oregonstate.edu/demo_data_run/" + inFile;
    //var pairingFile = "/demo_data_run/" + inFile;
    //console.log('beam size: '+BeamFromBar+', file read: '+seriesNo+"_"+seqNo);
    $.getJSON(pairingFile, function(data,status) {
        console.log('read successfully')
        fillSeqText(data.pairing);                                  // fill sequence and pairing structures at bottom of page
        $("#mySVG").empty();
        svg_draw_graphs(data.pairing, d,R,circleScale,halfOpen);
        insertForna(data.pairing);
    });
}

function svg_draw_graphs(pairingList, d,R,circleScale,halfOpen=20) {
        svg_drawFrame("mySVG",pairingList[0],d,R,circleScale,halfOpen,half="right");
        svg_fillCircles("mySVG",pairingList,d,R,circleScale,halfOpen,pairingList[1]);
}

function svg_drawFrame(svgid,N,d,R,circleScale,halfOpen=20,half="left"){
    var a = R+d;
    var b =3.5*R + 3*d;   //2*d is also ok
    var extDis = d/2.8;
    
    //get corresponding svg object
    var svg = document.getElementById(svgid);
    //set font and style
    titleFont = "Courier";  
    legendFont = "Arial";    
    titleSize = 30;

    //display legend for shared pairs
        var x1 = 1.92*R, x2 = 3.24*R, y1 = 11, y2 = 90;
        var boxstr = 'M '+x1+' '+y1+' L '+x2+' '+y1+' L '+x2+' '+y2+' L '+x1+' '+y2+' L '+x1+' '+y1;
        var attr = {d: boxstr, stroke:"LightGray", fill:"none", strokeWidth:1}; // instead of fill:"transparent"
        svg.appendChild(getNode('path', attr));
        //        svg1.append(getNode('path', attr));
        var legend = getNode('text', {x: 1.96*R, y:34, fontFamily:legendFont, fontSize:18, fill:'blue'});
        legend.innerHTML = "⌒ both LinearFold-C and LinearFold-V";
        svg.appendChild(legend);  
        var legend = getNode('text', {x: 1.96*R, y:56, fontFamily:legendFont, fontSize:18, fill:'red'});
        legend.innerHTML = "⌒ LinearFold-C only";
        svg.appendChild(legend);  
        var legend = getNode('text', {x: 1.96*R, y:78, fontFamily:legendFont, fontSize:18, fill:'green'});
        legend.innerHTML = "⌒ LinearFold-V only";
        svg.appendChild(legend);  
        /*
        var legend = getNode('text', {x: 1.8*R, y:30, fontFamily:titleFont, fontSize:18, fill:'blue'});
        legend.innerHTML = "⌒ Shared pairs(both predicted)";
        svg.appendChild(legend);  
        var legend = getNode('text', {x: 1.8*R, y:55, fontFamily:titleFont, fontSize:18, fill:'red'});
        legend.innerHTML = "⌒";
        svg.appendChild(legend);  
        var legend = getNode('text', {x: 2.1*R, y:55, fontFamily:titleFont, fontSize:18, fill:'black'});
        legend.innerHTML = "Exclusive pairs";
        svg.appendChild(legend);  
        var legend = getNode('text', {x: 3*R, y:55, fontFamily:titleFont, fontSize:18, fill:'orange'});
        legend.innerHTML = "⌒";
        svg.appendChild(legend);  
        */
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
        //var newtext = getNode('text', {x:b-2.7*d, y: d-0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"}); //Linear CONTRAfold
        //var newtext = getNode('text', {x:b-2.7*d, y: a+a+d+0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"});  //Linear Vienna
        var newtext = getNode('text', {x: R-1.8*d,   y:d-0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"});//LinearFold-C
        newtext.textContent = titles[2];
        svg.appendChild(newtext);
        var newtext = getNode('text', {x:b-2.7*d, y: d-0.5*H_title, fontFamily:titleFont, fontSize:titleSize, class:"titles"});//LinearFold-V
        newtext.textContent = titles[3];
        svg.appendChild(newtext);

        svg_drawCircle(svgid,a,a+H_title,R,halfOpen);
        svg_drawCircle(svgid,b,a+H_title,R,halfOpen);
        svg_drawCircleMarks(svgid,N,a,a+H_title,R,extDis,circleScale,halfOpen);
        svg_drawCircleMarks(svgid,N,b,a+H_title,R,extDis,circleScale,halfOpen);
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
        for (var i=circleScale-1; i<N-1; i=i+circleScale)
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
    var b = 3.5*R + 3*d;  //2*d is also ok
    //var data = loadInfo();
    var N = data[0];
    //var pairs;
    //console.log(l+'+'+data.length);
    //fill circle top-right with linearcf_missing, linearcf_hit, linearcf_wrong
    svg_fillCircle(svgid,data[2],data[8],data[9],data[10],data[11],N,a,a+H_title,R,halfOpen);
    //fill circle bottom-right with linearvn_missing, linearvn_hit, linearvn_wrong
    svg_fillCircle(svgid,data[3],data[12],data[13],data[14],data[15],N,b,a+H_title,R,halfOpen);
}


function svg_fillCircle(svgid,t,P_R_F,missing,hit,wrong,N,x0,y0,R,halfOpen=20){

    var missing_pair = missing.length;
    for (var i=0; i<missing_pair; i+=2){
        //svg_drawArc(svgid,missing[i],missing[i+1],N,x0,y0,R,'LightGray',halfOpen); 
        svg_drawArc(svgid,missing[i],missing[i+1],N,x0,y0,R,'green',halfOpen); 
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
        if (x0 < 400){
             var newmark = getNode('text', {x: x0-71-P_R_F[2].length*3.5, y:y0-R-H_title/2, fontFamily:PRFont, fontSize:PRSize, class:"titles"});
             newmark.textContent = "time="+t+"s,  Score="+P_R_F[2];
        } else {
             var newmark = getNode('text', {x: x0-94-P_R_F[2].length*4, y:y0-R-H_title/2, fontFamily:PRFont, fontSize:PRSize, class:"titles"});
             newmark.textContent = "time="+t+"s,  \u0394G="+P_R_F[2]+"kcal/mol";
        }
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
var titles = ["CONTRAfold MFE", "Vienna RNAfold", "LinearFold-C", "LinearFold-V", "Gold/Ref"];

function fillSeqText(data){
        //document.getElementById("seqName").innerHTML = 'seq: <br>'+lines[1];
        //document.getElementById("ref").innerHTML = 'ref: <br>' + lines[3];
        //document.getElementById("cf").innerHTML = 'CONTRAfold MFE: <br>' + lines[5];
        //document.getElementById("vn").innerHTML = 'Vienna RNAfold: <br>' + lines[7];
        document.getElementById("nameEcho").innerHTML = data[4]+' (len:'+data[0]+')';
        document.getElementById("beamEcho").innerHTML = data[1];
        document.getElementById("timeLCEcho").innerHTML = data[2];
        document.getElementById("timeLVEcho").innerHTML = data[3];//(''+data[3]).slice(0,-5);

        document.getElementById("seq0").innerHTML = 'seq: ';//<br>';
        document.getElementById("lcf0").innerHTML = 'LinearFold-C: ';//<br>';
        document.getElementById("lvn0").innerHTML = 'LinearFold-V: ';//<br>';

        document.getElementById("seq").innerHTML = data[5];
        document.getElementById("lcf").innerHTML = data[6];
        document.getElementById("lvn").innerHTML = data[7];        
        //document.getElementById("lcf").innerHTML = 'LinearFold-C: <br>' + lines[beamline];
        //document.getElementById("lvn").innerHTML = 'LinearFold-V: <br>' + lines[beamline+4];

        //DOM or jQuery
        $("#btn_copy_seq").text('Copy to clipboard');
        $("#btn_copy_lcf").text('Copy to clipboard');
        $("#btn_copy_lvn").text('Copy to clipboard');
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
  var flag = copy_to_clipboard(document.getElementById("seq").innerText);
  if (flag) $("#btn_copy_seq").text('copied');
  else $("#btn_copy_seq").text('not copied');
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


function insertForna(data){
//  document.getElementById('forna1').src = "http://nibiru.tbi.univie.ac.at/forna/forna.html?id=fasta&file=>header%5Cn"+document.getElementById    ('seqEcho').innerHTML+"%5Cn"+document.getElementById('lcEcho').innerHTML;
//  document.getElementById('forna2').src = "http://nibiru.tbi.univie.ac.at/forna/forna.html?id=fasta&file=>header%5Cn"+document.getElementById    ('seqEcho').innerHTML+"%5Cn"+document.getElementById('lvEcho').innerHTML;
  var fornaDomain = "http://nibiru.tbi.univie.ac.at/forna/forna.html?id=fasta&file=>header%5Cn";
  var fornaURL1 = fornaDomain+data[5]+"%5Cn"+data[6];
  var fornaURL2 = fornaDomain+data[5]+"%5Cn"+data[7];
  if (data[0] <= 1000){
    document.getElementById('fornaInfo').innerHTML = "<a href='http://rna.tbi.univie.ac.at/forna/'>forna</a> (Kerpedjiev et al 2015) display: ";
    document.getElementById('forna1').src = fornaURL1; 
    document.getElementById('forna2').src = fornaURL2;
  } else {
    document.getElementById('forna').remove(); 
    document.getElementById('fornaInfo').innerHTML = "sequence is too long for <a href='http://rna.tbi.univie.ac.at/forna/'>forna</a> (Kerpedjiev et al 2015) display here, click to continue in a new window/tab:  ";
    var a1 = document.getElementById('fornalink1');
    var a2 = document.getElementById('fornalink2');
    //console.log(fornaURL1);
    a1.innerHTML = "forna for LinearFold-C"; 
    a2.innerHTML = "forna for LinearFold-V"; 
    a1.setAttribute("href",fornaURL1); 
    a2.setAttribute("href",fornaURL2); 
    //document.getElementById('forna').style = "display: none"; 
    //document.getElementById('forna2').style = "display: none"; 
  }
  //window.location.hash = 'pageTitle';    
}

document.getElementById("forna1").addEventListener("load", function() {
  console.log('scroll from iframe 1 to top');
  window.scrollTo(0, 0);
}, false);
document.getElementById("forna2").addEventListener("load", function() {
  console.log('scroll from iframe 2 to top');
  window.scrollTo(0, 0);
}, false);
//function setFocus(){
//    document.getElementById('pageTitle').focus();
//}

// prevent scrollTo() from jumping to iframes
//window.scrollTo = function () {};
//window.onload = function(){ window.scrollTo(0,0); }
//document.addEventListener("DOMContentLoaded", function(){ window.scrollTo(0,0); }, false )
//window.addEventListener('load', function() {
//  window.scrollTo(0, 0);
//});


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


