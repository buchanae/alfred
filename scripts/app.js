var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';
ctx.lineWidth = 3;

var w = canvas.width / 2;

var PLAYBACK_RATE = 0.5;
var END_TIME = 100;
var LOOP = true;
var playing = false;

var alfred = new Alfred( new Point( w, 60 ) );
var time = 0;
var scene = [ alfred.lleg, alfred.rleg, alfred.larm, alfred.rarm ];
var animations = [];
var paths, hit_targets;
var saved = {};

var tracks = [
    new Path([
        new Point( 0, 0 ),
        new Point( END_TIME / 2, 1.0 ),
        new Point( END_TIME, 0 ),
    ]),
    new Path([
        new Point( 0, 1.0 ),
        new Point( END_TIME / 2, 0.0 ),
        new Point( END_TIME, 1.0 ),
    ]),
    new Path([
        new Point( 0, 0 ),
        new Point( END_TIME, 1.0 ),
    ]),
    new Path([
        new Point( 0, 0.5 ),
        new Point( END_TIME / 2, 1.0 ),
        new Point( END_TIME / 2 + 0.01, 0.0 ),
        new Point( END_TIME, 0.5 ),
    ]),
];


var load_paths = function( p ){

    paths = [];
    hit_targets = [];

    for( var i = 0; i < p.length; i++ ){
        paths[i] = load_path( p[i] );
    }

    for( var i = 0; i < paths.length; i++ ){
        for( var j = 0; j < paths[i].points.length; j++ ){
            hit_targets.push( paths[i].points[j] );
        }
    }
};

if( localStorage.paths != undefined ){
    load_paths( JSON.parse( localStorage.paths ) );
} else {
    load_paths( [] );
}

if( localStorage.animations != undefined ){
    animations = JSON.parse( localStorage.animations );
}

if( localStorage.saved != undefined ){
    saved = JSON.parse( localStorage.saved );
}

AnimationLoop(function( deltaT ) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'red';

    for( var i = 0; i < paths.length; i++ ){
        paths[i].draw( ctx );
    }

    ctx.restore();

    if( playing ){

        if( time > END_TIME && LOOP ){
            time = 0;
        }
        var p = time / END_TIME;
        time += PLAYBACK_RATE;

        for( var i = 0; i < animations.length; i++ ){
            var anim = animations[i];
            var y = tracks[anim.track].pointAtOffset( p ).y;
            ik( scene[anim.target], paths[anim.target_path].pointAtOffset( y ) );
        }
    }

    alfred.draw( ctx );

}, canvas );

document.getElementById('add').addEventListener('click', function(){
    //leg_p.points.push( _.clone( target.position ) );
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
var new_path_tool_on = false;
document.getElementById('canvas').addEventListener('mousedown', function(e){

    var p = getPos( e );
    if( new_path_tool_on ){
        var q = new Point( p.x + 10, p.y + 10 );
        hit_targets.push( p );
        hit_targets.push( q );
        paths.push( new Path([ p, q ]) );

    } else {
        dragging = true;
        for( var i = 0; i < hit_targets.length; i++ ){
            var t = hit_targets[i];
            t.selected = t.hit_test( p );
        }
    }

});
document.getElementById('canvas').addEventListener('mousemove', function(e){
  var p = getPos( e );
  if( dragging ){
      for( var i = 0; i < hit_targets.length; i++ ){
          var t = hit_targets[i];
          if( t.selected ){
              t.move( p );
          }
      }
  }
  last = p;
});

document.getElementById('canvas').addEventListener('mouseup', function(e){
    dragging = false;
});

document.getElementById('now').addEventListener('change', function(){
    PLAYBACK_RATE = parseFloat(this.value);
});

document.getElementById('save').addEventListener('click', function(){
    localStorage.paths = JSON.stringify(paths);
    localStorage.animations = JSON.stringify(animations);
});

document.getElementById('save-as').addEventListener('click', function(){
    var name = document.getElementById('save-as-name').value;
    saved[ name ] = { paths: paths, animations: animations };
    localStorage.saved = JSON.stringify( saved );
});

var load_saved = function( name ){
    if( localStorage.saved != undefined ){
        var parsed = JSON.parse(localStorage.saved);
        load_paths( parsed[name].paths );
        animations = parsed[name].animations;
    }
};
