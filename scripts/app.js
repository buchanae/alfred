var IKAnim = function( timeline, chain, track ){
    this.timeline = timeline;
    this.chain = chain;
    this.track = track;
    this.path = new Path([]);
};
IKAnim.prototype = {
    add_keyframe : function(){
        this.path.points.push( _.clone( _.last( this.chain ) ) );
    },
    update : function(){
        // TODO think of a better way to do this?
        // maybe use a thrown exception
        if( this.path.points.length > 1 ){
            var p = this.timeline.now / this.timeline.length;
            var y = this.track.pointAtOffset( p ).y;
            ik( this.chain, this.path.pointAtOffset( y ) );
        }
    }
};

var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';
ctx.lineWidth = 3;

var w = canvas.width / 2;

var alfred = new Alfred( new Point( w, 60 ) );
var timeline = new Timeline();

var dragging = false;

var hit_targets = [];
var saved = {};

/*
    new Path([
        new Point( 0, 1.0 ),
        new Point( timeline.length / 2, 0.0 ),
        new Point( timeline.length, 1.0 ),
    ]),
    new Path([
        new Point( 0, 0 ),
        new Point( timeline.length, 1.0 ),
    ]),
    new Path([
        new Point( 0, 0.5 ),
        new Point( timeline.length / 2, 1.0 ),
        new Point( timeline.length / 2 + 0.01, 0.0 ),
        new Point( timeline.length, 0.5 ),
    ]),
    */

var targets = [
    { circle: new Circle( _.last( alfred.lleg ), 5 ), chain: alfred.lleg },
    { circle: new Circle( _.last( alfred.rleg ), 5 ), chain: alfred.rleg },
    { circle: new Circle( _.last( alfred.larm ), 5 ), chain: alfred.larm },
    { circle: new Circle( _.last( alfred.rarm ), 5 ), chain: alfred.rarm },
];

var tracks = [
    new IKAnim( timeline, alfred.lleg, new Path([
        new Point( 0, 0 ),
        new Point( timeline.length / 2, 1.0 ),
        new Point( timeline.length, 0 ),
    ]) ),
    new IKAnim( timeline, alfred.rleg, new Path([
        new Point( 0, 0 ),
        new Point( timeline.length / 2, 1.0 ),
        new Point( timeline.length, 0 ),
    ]) ),
    new IKAnim( timeline, alfred.larm, new Path([
        new Point( 0, 0 ),
        new Point( timeline.length / 2, 1.0 ),
        new Point( timeline.length, 0 ),
    ]) ),
    new IKAnim( timeline, alfred.rarm, new Path([
        new Point( 0, 0 ),
        new Point( timeline.length / 2, 1.0 ),
        new Point( timeline.length, 0 ),
    ]) ),
];


if( localStorage.saved != undefined ){
    saved = JSON.parse( localStorage.saved );
}

AnimationLoop(function( deltaT ) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TODO does scene updating belong in Timeline class?
    timeline.tick();

    if( timeline.playing ){
        for( var i = 0; i < tracks.length; i++ ){
            tracks[i].update();
        }
    }

    for( var i = 0; i < targets.length; i++ ){
        targets[i].circle.draw( ctx );
    }

    alfred.draw( ctx );

}, canvas );

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

document.getElementById('add').addEventListener('click', function(){
    for( var i = 0; i < tracks.length; i++ ){
        tracks[i].add_keyframe();
    }
});
document.getElementById('play').addEventListener('click', function(){
    timeline.playing = true;
});
document.getElementById('stop').addEventListener('click', function(){
    timeline.now = 0;
    timeline.playing = false;
});

document.getElementById('canvas').addEventListener('mousedown', function(e){

    var p = getPos( e );

    dragging = true;
    for( var i = 0; i < targets.length; i++ ){
        var t = targets[i];
        // TODO sucks
        t.circle.selected = t.circle.hit_test( p );
    }
});

document.getElementById('canvas').addEventListener('mousemove', function(e){
  var p = getPos( e );
  if( dragging ){
      for( var i = 0; i < targets.length; i++ ){
          var t = targets[i];
          // TODO sucks
          if( t.circle.selected ){
              ik( t.chain, p );
              t.circle.position = _.last( t.chain );
          }
      }
  }
  last = p;
});

document.getElementById('canvas').addEventListener('mouseup', function(e){
    dragging = false;
});

document.getElementById('now').addEventListener('change', function(){
    timeline.rate = parseFloat(this.value);
});

document.getElementById('save').addEventListener('click', function(){
});

document.getElementById('save-as').addEventListener('click', function(){
    var name = document.getElementById('save-as-name').value;
    //saved[ name ] = { paths: paths, animations: animations };
    //localStorage.saved = JSON.stringify( saved );
});
