var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';
ctx.lineWidth = 3;

var Bounce = function( start, inc, min, max ){
    this.val = start;
    this.min = min;
    this.max = max;
    this._inc = inc;
};
Bounce.prototype = {
    inc : function(){
        if( this.val + this._inc < this.min || this.val + this._inc > this.max ){
            this._inc = this._inc * -1;
        }
        this.val += this._inc;
    }
};

var Loop = function( start, inc, min, max ){
    this.val = start;
    this.min = min;
    this.max = max;
    this._inc = inc;
};
Loop.prototype = {
    inc : function() {
        this.val += this._inc;
        if( this.val > this.max ){
            this.val = this.min;
        }
    }
};

var w = canvas.width / 2;

var target = new Point( 5, 5 );

var arm_p = new Path([
    new Point( w - 18, 150 ),
    new Point( w + 0, 150 ),
    new Point( w + 28, 142 ),
]);
var larm_offset = new Bounce(0.0, 0.01, 0.0, 1.0);
var rarm_offset = new Bounce(1.0, 0.01, 0.0, 1.0);

var pts = [];
for( var i = 0; i < saved.points.length; i++ ){
    pts.push(new Point( saved.points[i].x, saved.points[i].y ));
}
var leg_p = new Path( pts );

var lleg_offset = new Loop(0.5, 0.01, 0.0, 1.0);
var rleg_offset = new Loop(1.0, 0.01, 0.0, 1.0);

var head = new Point( w, 60 );
var shoulder = new Point( w, 90 );
var larm = [ 
    shoulder, 
    new Point( shoulder.x + 30, shoulder.y ), 
    new Point( shoulder.x + 60, shoulder.y ) 
];
var rarm = [
    shoulder,
    new Point( shoulder.x - 30, shoulder.y ),
    new Point( shoulder.x - 60, shoulder.y )
];

var hip = new Point( w, 150 );

var lleg = [ hip, new Point( hip.x + 30, hip.y ), new Point( hip.x + 60, hip.y ) ];
var rleg = [ hip, new Point( hip.x - 30, hip.y ), new Point( hip.x - 60, hip.y ) ];

function draw_path(p){
    if (p.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.points[0].x, p.points[0].y);
        for( var i = 1; i < p.points.length; i++ ){
            ctx.lineTo(p.points[i].x, p.points[i].y);
        }
        ctx.stroke();
   }
}

var playing = false;

AnimationLoop(function( deltaT ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    draw_path(arm_p);
    draw_path(leg_p);
    ctx.restore();

//    ik( larm, arm_p.pointAtOffset( larm_offset.val ) );
//    ik( rarm, arm_p.pointAtOffset( rarm_offset.val ) );
    larm_offset.inc();
    rarm_offset.inc();
    lleg_offset.inc();
    rleg_offset.inc();

    if( playing ){
        ik( lleg, leg_p.pointAtOffset( lleg_offset.val ) );
        ik( rleg, leg_p.pointAtOffset( rleg_offset.val ) );
    } else {
        ik( rleg, target );
        ik( lleg, target );
    }

/*
    ctx.beginPath();
    ctx.moveTo(larm[0].x, larm[0].y);
    ctx.lineTo(larm[1].x, larm[1].y);
    ctx.lineTo(larm[2].x, larm[2].y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rarm[0].x, rarm[0].y);
    ctx.lineTo(rarm[1].x, rarm[1].y);
    ctx.lineTo(rarm[2].x, rarm[2].y);
    ctx.stroke();
    */

    ctx.beginPath();
    ctx.arc(head.x, head.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(target.x, target.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.moveTo(canvas.width / 2, 70);
    ctx.lineTo(shoulder.x, shoulder.y);
    ctx.lineTo(hip.x, hip.y);
    ctx.stroke();

/*
    */
    ctx.beginPath();
    ctx.moveTo(lleg[0].x, lleg[0].y);
    ctx.lineTo(lleg[1].x, lleg[1].y);
    ctx.lineTo(lleg[2].x, lleg[2].y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rleg[0].x, rleg[0].y);
    ctx.lineTo(rleg[1].x, rleg[1].y);
    ctx.lineTo(rleg[2].x, rleg[2].y);
    ctx.stroke();
}, canvas );

document.getElementById('add').addEventListener('click', function(){
    leg_p.points.push( _.clone( target ) );
});
document.getElementById('play').addEventListener('click', function(){
    playing = true;
});
document.getElementById('stop').addEventListener('click', function(){
    playing = false;
});
document.getElementById('clear').addEventListener('click', function(){
    playing = false;
    leg_p.points = [];
});

var dragging = false;
document.getElementById('canvas').addEventListener('mousedown', function(e){
    dragging = true;
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= e.target.offsetLeft;
    y -= e.target.offsetTop;
    target.x = x;
    target.y = y;
});
document.getElementById('canvas').addEventListener('mousemove', function(e){
  if( dragging ){
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= e.target.offsetLeft;
    y -= e.target.offsetTop;
    target.x = x;
    target.y = y;
  }
});
document.getElementById('canvas').addEventListener('mouseup', function(e){
    dragging = false;
});
document.getElementById('now').addEventListener('change', function(){
    //timeline.now = parseInt(this.value);
    //scene.tick();
});
