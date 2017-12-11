function myFunction()
{
    document.getElementById("demo").innerHTML="我的第一个 JavaScript 函数";
}


function drawarc(n1,n2,N,R,x0,y0,halfOpen=20)
{
	var p1 = new Object;
	var p2 = new Object;
	var theta = halfOpen/360 * 2*Math.PI;
	var alpha1 = n1/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
	var alpha2 = n2/(N-1) * (360-2*halfOpen)/360 * 2*Math.PI;
	
	p1.x = x0 + R*sin(theta+alpha1);
	p1.y = y0 - R*cos(theta+alpha1);

	p2.x = x0 + R*sin(theta+alpha2);
	p2.y = y0 - R*cos(theta+alpha2);

	var r = R*tan((alpha2-alpha1)/2);
}