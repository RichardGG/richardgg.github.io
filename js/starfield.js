
var starctx = document.getElementById("starfield").getContext("2d");
var stars;



//width of canvas and height of canvas (height is slightly taller than screen)
var previouswidth;
var calculatedheight;

var gradients;


//Done at start
function generateStars(){

	console.log(ratio);

	starctx.canvas.width = window.innerWidth;// * ratio;
	starctx.canvas.height = window.innerHeight;//starctx.canvas.clientHeight * ratio;	
	
	starctx.scale(ratio,ratio);
	
	previouswidth = starctx.canvas.width;
	calculatedheight = starctx.canvas.height;//;(starctx.canvas.height + 20);
	
	stars = new Array();
	for(var i=0; i<30; i++){
		var star = new Object();
		star.x = Math.round(Math.random()*starctx.canvas.width+1);
		star.y = Math.round(Math.random()*calculatedheight+1);
		star.rot = Math.random()*Math.PI*2;
		star.size = Math.floor(Math.random()*5+1);
		star.depth = Math.round(Math.random()*5+1);
		stars.push(star);
	}
	

}

function resize(){
	if(window.innerWidth == previouswidth && window.innerHeight < calculatedheight){
		starctx.canvas.height = starctx.canvas.clientHeight;
	}else{
		generateStars();
	}
}

var meteor = null;

// done every now and then
function generateMeteor(){
	meteor = new Object();
	
	var invert = Math.round(Math.random()*2);
	var startrot = Math.floor(Math.random()*2);
	startrot = 0;
	meteor.rot = Math.random()*Math.PI/4 + Math.PI/4 + ((Math.PI + Math.PI/4)*startrot);
	meteor.rot = 2*Math.PI/6;
	meteor.x = Math.round(Math.random()*starctx.canvas.width/2); 
	if(meteor.x > starctx.canvas.width/4)
		meteor.x+= starctx.canvas.width/2;
	meteor.y = window.scrollY + Math.round(Math.random()*starctx.canvas.height/2);
	meteor.dist = 0;
	
	meteor.r = 150+Math.round(Math.random()*105);
	meteor.g = 150+Math.round(Math.random()*105);
	meteor.b = 150+Math.round(Math.random()*105);
}

// Every frame from creation
function drawMeteor(){
	var start = (meteor.dist < 300)? meteor.dist:300;
	var end = (meteor.dist > 300)? meteor.dist-300:0;
	
	var grd = starctx.createLinearGradient(0,end,0,300);
	
	
	
	grd.addColorStop(0, "rgba("+meteor.r+","+meteor.g+","+meteor.b+", 0)");
	grd.addColorStop(1, "rgba("+meteor.r+","+meteor.g+","+meteor.b+", 0.3)");
	//grd.addColorStop(1, "rgba(255,255,255, 0)");
	
	starctx.fillStyle = grd;
	starctx.save();
	starctx.translate(meteor.x, meteor.y-window.scrollY);
	starctx.rotate(meteor.rot);
	
	
	
	starctx.fillRect(0,end,5,start-end);
	meteor.dist+= 15;
	if(meteor.dist > 600){
		meteor = null;
		mincounter = 0;
	}
	starctx.restore();
}

var mincounter = 0;


	

// Done every frame
function drawStars(){
	
	window.scrollY = window.pageYOffset;
	
	starctx.clearRect(0,0,starctx.canvas.width,starctx.canvas.height);

	starctx.fillStyle = "rgba(255,255,255,0.1)";
	starctx.fillRect(0,0,starctx.canvas.width,starctx.canvas.height);

	
	//var grd = starctx.createRadialGradient(0.5,0.5,1, 0.5,0.5,4);
	//grd.addColorStop(0, "rgba(255,255,255,0.1)");
	//grd.addColorStop(1, "rgba(0,0,0, 0)");
	
	for(var i=0; i<stars.length; i++){
		
		var star = stars[i];
		starctx.save();
		
		var height = ( star.y+(star.depth*window.scrollY*calculatedheight*0.25/calculatedheight) ) % calculatedheight;

		starctx.translate(star.x,calculatedheight - height);
		starctx.rotate(star.rot);
		starctx.scale(star.size, star.size);
		
		//starctx.fillStyle = grd;
		//starctx.fillRect(-4, -4, 8, 8);
		
		starctx.fillStyle = "white";
		starctx.fillRect(0,0,1, 1);
		
		
		starctx.restore();
	}
	
	mincounter++;
	
	if(meteor){
		drawMeteor();
	}else if(mincounter>100 && Math.round(Math.random()*50)==1){
		generateMeteor();
	}
	
	requestAnimationFrame(drawStars);
}