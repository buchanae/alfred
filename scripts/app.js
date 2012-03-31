var IKAnim = function( chain, track ){
    this.chain = chain;
    this.track = track;
    this.path = new Path([]);
};
IKAnim.prototype = {
    add_keyframe : function(){
        this.path.points.push( _.clone( _.last( this.chain.points ) ) );
    },
    draw : function( ctx ){
        if( this.chain.selected ){
            ctx.save();
            ctx.lineWidth = 0.5;
            this.path.draw( ctx );
            ctx.restore();
        }
    },
    update : function( p ){
        if( this.path.points.length > 1 ){
            var y = this.track.pointAtOffset( p ).y;
            this.chain.solve( this.path.pointAtOffset( y ) );
        }
    },
};

var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.strokeStyle = 'black';
ctx.lineWidth = 3;
ctx.lineJoin = 'round';

var w = canvas.width / 2;

var alfred = new Alfred( new Point( w, 60 ) );
var timeline = new Timeline();

var dragging = false;

var saved = {};

var loop = new Path([
    new Point( 0, 0 ),
    new Point( timeline.length, 1.0 ),
]);

timeline.tracks = [
    new IKAnim( alfred.lleg, loop ),
    new IKAnim( alfred.rleg, loop ),
    new IKAnim( alfred.larm, loop ),
    new IKAnim( alfred.rarm, loop ),
];

var selectables = [ alfred ];

if( localStorage.saved != undefined ){
    saved = JSON.parse( localStorage.saved );
}

var TrackModel = Backbone.Model.extend({
    defaults: {
        path: loop,
    },
});

var lleg_track_model = new TrackModel({
    name: 'Left Leg',
    chain: alfred.lleg,
});
var rleg_track_model = new TrackModel({
    name: 'Right Leg',
    chain: alfred.rleg,
});
var larm_track_model = new TrackModel({
    name: 'Left Arm',
    chain: alfred.larm,
});
var rarm_track_model = new TrackModel({
    name: 'Right Arm',
    chain: alfred.rarm,
});

var TestView = Backbone.View.extend({
  className: 'track',
  initialize: function(){
      $('#timeline').append(this.el);
      this.render();
  },
  render: function(){
      this.$el.html(ich.track(this.model.toJSON()));
      var canvas = this.$('canvas').get(0);
      var ctx = canvas.getContext('2d');

      ctx.save();

      var path = this.model.get('path');
      var points = path.points;

      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      ctx.beginPath();

      var xscale = canvas.width / _.last(points).x;
      var yscale = canvas.height / _.max(path.points, function(p){ return p.y }).y;

      ctx.moveTo(xscale * points[0].x, yscale * points[0].y);
      for( var i = 1; i < points.length; i++ ){
          ctx.lineTo(xscale * points[i].x, yscale * points[i].y);
      }
      ctx.stroke();
      //for( var i = 0; i < points.length; i++ ){
      //    points[i].draw( ctx );
      //}

      ctx.restore();
      return this;
  },
});

$(document).ready(function(){

  new TestView({
      model: lleg_track_model,
  });
  new TestView({
      model: rleg_track_model,
  });
  new TestView({
      model: larm_track_model,
  });
  new TestView({
      model: rarm_track_model,
  });

});

AnimationLoop(function( deltaT ) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.lineTo(canvas.height, 210);
    ctx.stroke();

    timeline.tick();

    for( var i = 0; i < timeline.tracks.length; i++ ){
        timeline.tracks[i].draw( ctx );
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
    for( var i = 0; i < timeline.tracks.length; i++ ){
        timeline.tracks[i].add_keyframe();
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
    for( var i = 0; i < selectables.length; i++ ){
        selectables[i].select_tool(p);
    }
    dragging = true;
});

document.getElementById('canvas').addEventListener('mousemove', function(e){
    var p = getPos( e );
    if( dragging ){
        for( var i = 0; i < selectables.length; i++ ){
            selectables[i].drag(p);
        }
    }
    last = p;
});

document.getElementById('canvas').addEventListener('mouseup', function(e){
    dragging = false;
});

document.getElementById('save').addEventListener('click', function(){
});

document.getElementById('save-as').addEventListener('click', function(){
    var name = document.getElementById('save-as-name').value;
    //saved[ name ] = { paths: paths, animations: animations };
    //localStorage.saved = JSON.stringify( saved );
});

document.addEventListener('keyup', function(e){
    if(e.keyCode == 65){
        for( var i = 0; i < timeline.tracks.length; i++ ){
            timeline.tracks[i].add_keyframe();
        }
    }
});
