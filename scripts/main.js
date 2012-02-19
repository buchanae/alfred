define(['domReady', 'ik', 'paper'], function(domReady, ik) {

  domReady(function() {
      var canvas = document.getElementById('canvas');
      paper.setup(canvas);

      var path = new paper.Path();
      path.strokeColor = 'black';
      path.add([10, 40], [50, 40], [90, 40]);

      var animPath = new paper.Path();
      animPath.strokeColor = 'red';

      var a = new paper.Point(25, 30);

      ik( path, a );

      var c = new paper.Path.Circle(a, 5);
      c.fillColor = 'red';

      var tool = new paper.Tool();
      tool.onMouseDrag = function( e ){
          ik( path, e.point );
          c.position = e.point;
      }

      var playing = false;
      var animProgress = 0;
      paper.view.onFrame = function() {
          if (playing) {
              var offset = animPath.length * (animProgress / 100);
              var p = animPath.getPointAt(offset);
              ik( path, p );

              if (animProgress === 100) {
                  playing = false;
                  animProgress = 0;
              } else {
                  animProgress += 1;
              }
          }
      }

      document.getElementById('add').addEventListener('click', function(){
          animPath.add(path.lastSegment.point.clone());
      });
      document.getElementById('play').addEventListener('click', function(){
          playing = true;
      });
      document.getElementById('clear').addEventListener('click', function(){
          animPath.removeSegments();
      });
  });
});
