define(['domReady', 'ik', 'paper'], function(domReady, ik) {

  domReady(function() {
      var canvas = document.getElementById('canvas');
      paper.setup(canvas);

      var path = new paper.Path();
      path.strokeColor = 'black';
      path.add([50, 40], [80, 40], [110, 40]);

      var animPaths = [
          new paper.Path(),
          new paper.Path()
      ];

      var a = new paper.Point(25, 30);

      //ik( path, a );

      var c = new paper.Path.Circle(a, 5);
      c.fillColor = 'red';

      var tool = new paper.Tool();
      tool.onMouseDown = function( e ){
          if (c.hitTest(e.point)) {
              c.selected = true;
              path.selected = true;
          } else {
              c.selected = false;
              path.selected = false;
          }
      }

      tool.onMouseDrag = function( e ){
          ik( path, e.point );
          c.position = e.point;
      }

      var ref = new paper.Point([1, 0]).subtract([0, 0]);
      var playing = false;
      var animProgress = 0;
      paper.view.onFrame = function() {
          if (playing) {

              var offset = animPaths[0].length * (animProgress / 100);
              var p = animPaths[0].getPointAt(offset);

              var rot = ref.rotate(p.x, [0, 0]);
              var d = path.segments[0].point.getDistance(path.segments[1].point);
              var g = rot.normalize(d);
              path.segments[1].point = path.segments[0].point.add(g);

              if (animProgress === 100) {
                  playing = false;
                  animProgress = 0;
              } else {
                  animProgress += 1;
              }
          }
      }

      var time = 0;

      var a = path.segments[1].point.subtract(path.segments[0].point);
      var ang = ref.getDirectedAngle(a);
      animPaths[0].add([ang, time]);

      document.getElementById('add').addEventListener('click', function(){
          var a = path.segments[1].point.subtract(path.segments[0].point);
          var ang = ref.getDirectedAngle(a);
          animPaths[0].add([ang, time]);
          time += 10;
      });
      document.getElementById('play').addEventListener('click', function(){
          playing = true;
      });
      document.getElementById('clear').addEventListener('click', function(){
          animPaths[0].removeSegments();
          animPaths[1].removeSegments();
      });
  });
});
