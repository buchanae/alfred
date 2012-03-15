var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';
ctx.lineWidth = 3;

var Circle = function( p, r ){
    this.position = p;
    this.r = r;
    this.selected = false;
};
Circle.prototype = {
    draw : function(){
        ctx.save();
        ctx.beginPath();
        if (this.selected){
            ctx.fillStyle = 'red';
        }
        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
};

var hit_targets = [];

var w = canvas.width / 2;

var END_TIME = 100;
var bounce_p = new Path([
    new Point( 0, 0 ),
    new Point( END_TIME / 2, 1.0 ),
    new Point( END_TIME, 0 ),
]);

var loop_p = new Path([
    new Point( 0, 0 ),
    new Point( END_TIME, 1.0 ),
]);

var arm_p = new Path([
    new Point( w - 18, 150 ),
    new Point( w + 0, 150 ),
    new Point( w + 28, 142 ),
]);

var pts = [];
for( var i = 0; i < saved.points.length; i++ ){
    pts.push(new Point( saved.points[i].x, saved.points[i].y ));
}
var leg_p = new Path( pts );

var head = new Circle( new Point( w, 60 ), 15 );
var shoulder = new Point( w, 90 );
var larm = [ 
    shoulder, 
    new Point( shoulder.x + 30, shoulder.y ), 
    new Point( shoulder.x + 60, shoulder.y ) 
];
var rarm = [
    shoulder,
    new Point( shoulder.x + 30, shoulder.y ),
    new Point( shoulder.x + 60, shoulder.y )
];

var hip = new Point( w, 150 );

var lleg = [ hip, new Point( hip.x + 30, hip.y ), new Point( hip.x + 60, hip.y ) ];
var rleg = [ hip, new Point( hip.x + 30, hip.y ), new Point( hip.x + 60, hip.y ) ];

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
var time = 0;

var y = loop_p.pointAtOffset( time ).y;
var target = new Circle( leg_p.pointAtOffset( y ), 5 );
hit_targets.push( target );
hit_targets.push( head );

var LOOP = true;

AnimationLoop(function( deltaT ) {

    var p = time / END_TIME;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'red';
    draw_path(arm_p);
    draw_path(leg_p);
    ctx.restore();

    if( playing ){

        if( time == END_TIME && LOOP ){
            time = 0;
        }
        if( time < END_TIME ){
            time++;
        }

        var y = loop_p.pointAtOffset( p ).y;
        ik( lleg, leg_p.pointAtOffset( y ) );
        ik( rleg, leg_p.pointAtOffset( y ) );

        var y = bounce_p.pointAtOffset( p ).y;
        ik( larm, arm_p.pointAtOffset( y ) );
        ik( rarm, arm_p.pointAtOffset( y ) );
    } else {
        ik( rleg, target.position );
        ik( lleg, target.position );
    }

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

    head.draw();

    target.draw()

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 70);
    ctx.lineTo(shoulder.x, shoulder.y);
    ctx.lineTo(hip.x, hip.y);
    ctx.stroke();

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
    leg_p.points.push( _.clone( target.position ) );
});
document.getElementById('play').addEventListener('click', function(){
    playing = true;
});
document.getElementById('stop').addEventListener('click', function(){
    time = 0;
    playing = false;
});
document.getElementById('clear').addEventListener('click', function(){
    playing = false;
    leg_p.points = [];
});

var getPos = function( e ){
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
    return new Point( x, y );
};

var dragging = false;
document.getElementById('canvas').addEventListener('mousedown', function(e){
    dragging = true;
    var p = getPos( e );
    for( var i = 0; i < hit_targets.length; i++ ){
        var t = hit_targets[i];
        if( p.x >= t.position.x - t.r && p.x <= t.position.x + t.r &&
            p.y >= t.position.y - t.r && p.y <= t.position.y + t.r ){

            t.selected = true;
        } else {
            t.selected = false;
        }
    }
});
document.getElementById('canvas').addEventListener('mousemove', function(e){
  if( dragging ){
  }
});
document.getElementById('canvas').addEventListener('mouseup', function(e){
    dragging = false;
});
document.getElementById('now').addEventListener('change', function(){
    //timeline.now = parseInt(this.value);
    //scene.tick();
});
