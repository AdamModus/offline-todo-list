'use strict';

// If all the files are successfully cached, then the service worker is installed.
self.addEventListener('install', function (event) {
    // Perform install steps
    console.log('Service worker was installed!');
});

// After the service worker is installed, it is then activated, meaning it can start controlling what the user gets!
self.addEventListener('activate', function (event) {
    console.log(`You're good to go!`);
});


self.addEventListener('fetch', function (event) {
    console.log("Intercepted a fetch: " + event.request);    // Hello World!
    event.respondWith(new Response(helloWorldResponse, {
        headers: {'Content-Type': 'text/html'}
    }));
});


// For the hello world purposes
var helloWorldResponse = `
<h1>Hey there! It seems like this nasty service worker intercepted your request!</h1>
<h1>Don't fret, to compensate I will tell you the time :D</h1>
<title>SVG clock animation</title>
<style>
  /* any custom styles live here */
  line {
  stroke-width: 3px;
  stroke: black;
  }      
</style>
<article>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" >
        <g>
          <circle id="circle" style="stroke: black; fill: #f8f8f8;" cx="100" cy="100" r="100"/>
          <line id="hour0" x1="100" y1="10"  x2="100" y2="0"/>
          <line id="hour1" x1="150" y1="13"  x2="145" y2="22"/>
          <line id="hour2" x1="187" y1="50"  x2="178" y2="55"/>
          <line id="hour3" x1="190" y1="100" x2="200" y2="100"/>
          <line id="hour4" x1="187" y1="150" x2="178" y2="145"/>
          <line id="hour5" x1="150" y1="187" x2="145" y2="178"/>
          <line id="hour6" x1="100" y1="190" x2="100" y2="200"/>
          <line id="hour7" x1="50"  y1="187" x2="55"  y2="178"/>
          <line id="hour8" x1="13"  y1="150" x2="22"  y2="145"/>
          <line id="hour9" x1="0"   y1="100" x2="10"  y2="100"/>
          <line id="hour10" x1="13"  y1="50"  x2="22"  y2="55" />
          <line id="hour11" x1="50"  y1="13"  x2="55"  y2="22" />
        </g>
        <g>
          <line x1="100" y1="100" x2="100" y2="45" style="stroke-width: 6px; stroke: green;" id="hourhand"/>
          <line x1="100" y1="100" x2="100" y2="15" style="stroke-width: 4px; stroke: blue;"  id="minutehand"/>
          <line x1="100" y1="100" x2="100" y2="5"  style="stroke-width: 2px; stroke: red;"   id="secondhand"/>
        </g>
      </svg>
    </div>
    <h2 id="timeText" style="padding-left: 100px;"></h2>

</article>
<script>
var CLOCK = (function() {
    var drawClock = function() {
	var INITIAL_R = 100;
	var zoom = 2;
	
	var r = INITIAL_R * zoom;
	// Draw Circle
	var circle = document.getElementById("circle");
	circle.setAttribute('r', r);
	circle.setAttribute('cx', r);
	circle.setAttribute('cy', r);
	// Draw Hours
	for(var i = 0; i < 12; i++) {
	    var hour = document.getElementById("hour"+i);
	    var degrees = i * 30;
	    hour.setAttribute('x1', getX(degrees, r, 0.9)); // 90% of radio's length.
	    hour.setAttribute('y1', getY(degrees, r, 0.9)); // 90% of radio's length.
	    hour.setAttribute('x2', getX(degrees, r));
	    hour.setAttribute('y2', getY(degrees, r));
	}
	// Draw hands
	drawHands();
    };
    var drawHands = function() {
	// Constants for hand's sizes.
	var SECONDS_HAND_SIZE = 0.95,
	MINUTES_HAND_SIZE = 0.85,
	HOURS_HAND_SIZE = 0.55;
	var circle = document.getElementById("circle");
	// Clock Circle's Properties
	var r = circle.getAttribute('r'),
	cx = parseInt(circle.getAttribute('cx')),
	cy = parseInt(circle.getAttribute('cy'));
	// Current time.
	var currentTime = new Date();
	document.getElementById("timeText").innerHTML = currentTime.toISOString().split('T')[0] + ' ' + currentTime.toISOString().split('T')[1].substring(0, 8);
	// Draw Hands
	drawHand(document.getElementById("secondhand"),
		 currentTime.getSeconds(),
		 SECONDS_HAND_SIZE,
		 6);
	drawHand(document.getElementById("minutehand"),
		 currentTime.getMinutes(),
		 MINUTES_HAND_SIZE,
		 6);
	drawHand(document.getElementById("hourhand"),
		 currentTime.getHours(),
		 HOURS_HAND_SIZE,
		 30);
	
	function drawHand(hand, value, size, degrees) {
	    var deg = degrees * value;
	    x2 = getX(deg, r, size, cx),
	    y2 = getY(deg, r, size, cy);
	    
	    hand.setAttribute('x1', cx);
	    hand.setAttribute('y1', cy); 
	    hand.setAttribute('x2', x2);
	    hand.setAttribute('y2', y2); 
	}
    };
    /*
     * Get a Point X value.
     * degress. Angle's degrees.
     * r. Circle's radio.
     * adjust. Percent of length.
     * x. Start of X point.
     */
    function getX(degrees, r, adjust, x) {
	var x = x || r, 
	adj = adjust || 1;
	return x + r * adj * Math.cos(getRad(degrees));
    }
    /*
     * Get a Point Y value.
     * degress. Angle's degrees.
     * r. Circle's radio.
     * adjust. Percent of length.
     * x. Start of Y point.
     */   
    function getY(degrees, r, adjust, y) {
	var y = y || r,
	adj = adjust || 1;
	return y + r * adj * Math.sin(getRad(degrees));
    }
    // Convert from degrees to radians.
    function getRad(degrees) {
	var adjust = Math.PI / 2;
	return (degrees * Math.PI / 180) - adjust;
    }
        
    return {
	init: function() {
	    drawClock();
	    setInterval(drawHands, 1000);
	}
    };
})();
CLOCK.init();
</script>
`;