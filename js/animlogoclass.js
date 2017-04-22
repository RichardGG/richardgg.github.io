var Tau = Math.PI * 2;

function AnimatedLogo(ctx, lineWidth, innerRadius, outerRadius, extraLoops){
	
	this.ctx = ctx;
	this.lineWidth = lineWidth;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.extraLoops = extraLoops;

	this.prepareAnimation = function(){
		// This calculates the lengths of each segment for the logo and the animation
		// It also calculates for each segment, it's percentage of the total animation
		
		
		// Important arc sizes
		this.extraArcRadians = 7*Tau/16 + (this.extraLoops*Tau);
		this.rArcRadians = 5*Tau/16;
		this.gArcRadians = Tau/16;
		this.gSmallArcRadians = Tau/4;
		
		//  Origin point of circles
		this.originX = (this.outerRadius - this.innerRadius) / 2;
		this.originY = 0;
		
		// Line edges of logo
		this.leftEdge = this.originX - this.outerRadius;
		this.rightEdge = this.originX + this.innerRadius;
		this.topEdge = this.originY - this.outerRadius;
		this.bottomEdge = this.originY + this.outerRadius;
		
		// Arc lengths (only  used here)
		var extraArcLength = this.extraArcRadians * this.outerRadius;	// Extra arc length
		var rArcLength = this.rArcRadians * this.outerRadius;			// Logo R arc length
		var gArcLength = this.gArcRadians * this.outerRadius;			// Logo G arc length
		var gSmallArcLength = this.gSmallArcRadians * this.innerRadius;	// Logo G small arc length
		var gLoopLength = Tau * this.innerRadius;						// Logo G loop length
		
		// Line lengths
		this.extraDistLength = this.outerRadius*2; 				// Animations extra distance to outer circle
		this.rLineLength = this.innerRadius;					// Logo R line length
		this.gLineLength = this.outerRadius - this.innerRadius;	// Logo G line length
		this.animatedLineLength = 4*Tau/16 * this.outerRadius;	// Length of line to animate
		
		// Entire animation distance equals the distance R Head must travel
		this.rDistance = this.rLineLength + rArcLength + extraArcLength + this.extraDistLength; // not really used
		this.gDistance = gArcLength + gSmallArcLength + this.gLineLength + gLoopLength + extraArcLength + this.extraDistLength;
		
		
		
		
		// Calculate percentages of entire animation
		
		// head of snake
		this.extraDistPercent = this.extraDistLength / this.gDistance;
		
		// R head of snake animation
		this.rArcPercent = (extraArcLength + rArcLength) / this.gDistance;
		this.rLinePercent = this.rLineLength / this.gDistance;

		// G head of snake animation
		this.gArcPercent = (extraArcLength + gArcLength) / this.gDistance;
		this.gSmallArcPercent = gArcLength / this.gDistance;
		this.gLinePercent = this.gLineLength / this.gDistance;
		this.gLoopPercent = gLoopLength / this.gDistance;

		// Tail of snake animation (identical)
		this.tailLinePercent = (this.animatedLineLength + this.extraDistLength) / this.gDistance;					// Tail travel same speed as head
		this.tailArcPercent = (extraArcLength) / this.gDistance;
		//this.tailArcPercent = (this.gDistance - this.animatedLineLength - this.extraDistLength) / this.gDistance; // Slow down for final length (extend)
	}
	
	this.prepareAnimation();
	
	this.calculateProgress = function(progress, start, percent, distance){
		if(progress < start)
			return 0;
		else if(progress < start + percent)
			return (progress - start) / percent * distance;
		else
			return distance;
	};
	
	this.drawLine = function(startX, startY, endX, endY){
		this.ctx.beginPath();
		this.ctx.moveTo(startX, startY);
		this.ctx.lineTo(endX, endY);
		this.ctx.stroke();
	};
	
	this.drawArc = function(x, y, radius, start, end, anticlockwise){
		
		//fix chrome glitches caused by precise numbers
		start = Math.round(start*1000) / 1000;
		end = Math.round(end*1000) / 1000;
		
		this.ctx.beginPath();		
		this.ctx.arc(x, y, radius, start, end, anticlockwise);
		this.ctx.stroke();
	};
	
	this.drawLogoFrame = function(progress){
	
		// Clear previous frame
		this.ctx.clearRect(this.leftEdge-this.extraDistLength-this.animatedLineLength,this.topEdge,this.innerRadius+this.outerRadius,this.outerRadius+this.outerRadius+this.extraDistLength+this.animatedLineLength);
		
		this.ctx.clearRect(-1000,-1000,2000,2000);
		
		// Start fresh
		this.ctx.beginPath();
		
		// Set line thickness and end style
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.lineCap = "round";
		
		
		
		// Head of snake
		var headExtra = this.calculateProgress(progress, 0, this.extraDistPercent, this.extraDistLength);
		
		// r Head
		var rHeadArc = 	this.calculateProgress(progress, this.extraDistPercent, this.rArcPercent, this.extraArcRadians + this.rArcRadians);
		var rHeadLine = this.calculateProgress(progress, this.extraDistPercent + this.rArcPercent, this.rLinePercent, this.rLineLength);

		// G head of snake
		var gHeadArc = 		this.calculateProgress(progress, this.extraDistPercent , this.gArcPercent, this.extraArcRadians + this.gArcRadians);
		var gHeadSmallArc = this.calculateProgress(progress, this.extraDistPercent + this.gArcPercent , this.gSmallArcPercent, this.gSmallArcRadians);
		var gHeadLine = 	this.calculateProgress(progress, this.extraDistPercent + this.gArcPercent + this.gSmallArcPercent , this.gLinePercent, this.gLineLength);
		var gHeadLoop = 	this.calculateProgress(progress, this.extraDistPercent + this.gArcPercent + this.gSmallArcPercent + this.gLinePercent, this.gLoopPercent, Tau);
		
		// Tail of snakes (identical)
		var tailLine = 	this.calculateProgress(progress, 0, this.tailLinePercent, this.extraDistLength + this.animatedLineLength);
		var tailArc =	this.calculateProgress(progress, this.tailLinePercent, this.tailArcPercent, this.extraArcRadians);
		
	

		// R start line
		if(headExtra != tailLine)
		this.drawLine(this.originX - this.extraDistLength + headExtra, this.bottomEdge, this.originX - this.extraDistLength - this.animatedLineLength + tailLine, this.bottomEdge);
		// R arc
		if(rHeadArc != tailArc)
		this.drawArc(this.originX, this.originY, this.outerRadius, Tau/4 - rHeadArc, Tau/4 - tailArc);
		// R line
		this.drawLine(this.leftEdge, this.originY, this.leftEdge, this.originY + rHeadLine);

		// G start line
		this.drawLine(this.originX + this.extraDistLength - headExtra, this.topEdge, this.originX + this.extraDistLength + this.animatedLineLength - tailLine, this.topEdge);
		// G arc
		this.drawArc(this.originX, this.originY, this.outerRadius, 3*Tau/4 - gHeadArc, 3*Tau/4 - tailArc);
		// G small arc
		this.drawArc(this.originX, this.originY + this.gLineLength, this.innerRadius, Tau/4, Tau/4-gHeadSmallArc, true);
		// G line
		this.drawLine(this.rightEdge, this.originY + this.gLineLength, this.rightEdge, this.originY + this.gLineLength - gHeadLine);
		// G loop
		this.drawArc(this.originX, this.originY, this.innerRadius, 0, 0-gHeadLoop, true);
	};
	
	this.frame = 0;
	this.duration = 1;
	
	this.nextFrame = function(timestamp){
		
		
		
		if(!this.start)
			this.start = timestamp - this.begin;
		
		var change = this.frame;
		
		this.frame = (timestamp - this.start) / (this.duration);
		change = this.frame - change;
		
		// Animation Curve
		this.frame--;
		var adjustedFrame = change*(this.frame*this.frame*this.frame*this.frame*this.frame + 1);
		
		if(adjustedFrame < 1){
			this.drawLogoFrame(adjustedFrame);
			var logo = this; //possibly faster than .bind()
			//if(this.running)
				requestAnimationFrame(function(timestamp){logo.nextFrame(timestamp)});
		}
		else {
			//console.log(1 - (window.scrollY / this.ctx.canvas.height));
			this.drawLogoFrame(1 - (window.scrollY / ((window.innerHeight-200)/2)));

			//(1 - (window.scrollY / ((this.ctx.canvas.height/ratio)*(200/window.innerHeight)) / 1));
			//(1 - (window.scrollY / ((window.innerHeight-200)/2)));
			
			//this.running = false;
			var logo = this;
			requestAnimationFrame(function(timestamp){logo.nextFrame(timestamp)});
		}
	}
	
	this.animate = function(duration, start){
		if(start){
			this.begin = duration * start;
			
		}else{
			this.begin = 0;
		}
		this.start = null;
		this.duration = duration;
		if(!this.running){
			this.running = true;
			requestAnimationFrame(this.nextFrame.bind(this));
		}
	}
}