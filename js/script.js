function expandMenu(){
	var navbar = document.getElementById("navbar");
	if(navbar.className == "expanded")
		navbar.className = "collapsed";
	else
		navbar.className = "expanded";
}

function collapseMenu(){
	navbar.className = "collapsed";
}

window.addEventListener('scroll', collapseMenu);


var skylinectx = document.getElementById("skyline").getContext("2d");
var devicePixelRatio = window.devicePixelRatio || 1;
var backingStoreRatio = skylinectx.webkitBackingStorePixelRatio ||
                            skylinectx.mozBackingStorePixelRatio ||
                            skylinectx.msBackingStorePixelRatio ||
                            skylinectx.oBackingStorePixelRatio ||
                            skylinectx.backingStorePixelRatio || 1;

var ratio = devicePixelRatio / backingStoreRatio;




skylinectx.canvas.width = window.innerWidth* ratio;
skylinectx.canvas.height = 200 * ratio;

skylinectx.scale(ratio,ratio);

skylinectx.fillStyle = "#09121a";

var dist = window.innerWidth/2-450;//450;
for(var i = 0; i < 15; i++){
	var height = Math.round(Math.random()*80) + 80;
	var width = Math.round(Math.random()*20) + 40;
	skylinectx.fillRect(dist,200 - height,width,height);
	
	var side = Math.floor(Math.random()*2);
	var slopeheight = Math.round(Math.random() * 40);
	
	if(side == 1){
		skylinectx.moveTo(dist, 200-height);
		skylinectx.quadraticCurveTo(dist+Math.random()*width, 200-height-Math.random()*slopeheight,dist+width, 200-height-slopeheight);
		skylinectx.lineTo(dist+width, 200 - height);
	}else{
		skylinectx.moveTo(dist, 200-height-slopeheight);
		skylinectx.quadraticCurveTo(dist+Math.random()*width, 200-height-Math.random()*slopeheight,dist+width, 200-height);
		skylinectx.lineTo(dist, 200 - height);
	}
	skylinectx.fill();
	
	dist += width + Math.round(Math.random()*2)+6;
}



var Tau = Math.PI * 2;

document.getElementById("logoholder").style.height = window.innerHeight + "px";

var logoctx = document.getElementById("logo").getContext("2d");
logoctx.canvas.width = 200 * ratio;
logoctx.canvas.height = 200 * ratio;


logoctx.scale(ratio,ratio);

var scale = 5;

var lineWidth = 4 * scale;
var innerRadius = 9 * scale;
var outerRadius = 16 * scale;

logoctx.translate(80,100);
logoctx.strokeStyle = "white";

var logo = new AnimatedLogo(logoctx, lineWidth, innerRadius, outerRadius, 0);
logo.animate(3000);



function reveal(but, id){
	
	var obj = document.getElementById(id);
	if(obj.style.display == "block"){
		obj.style.display = "none";
		but.innerHTML = "More Details";
	}else{
		obj.style.display = "block";
		but.innerHTML = "Hide Details";
	}
}


generateStars();
drawStars();
window.addEventListener("resize", resize);