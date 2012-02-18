define(['domReady', 'ik', 'paper'], function(domReady, ik) {

  domReady(function() {
      var canvas = document.getElementById('canvas');
      paper.setup(canvas);


      var path = new paper.Path();
      path.strokeColor = 'black';
      path.add([10, 40], [50, 40], [90, 40]);


      var a = new paper.Point(25, 30);

      ik( path, a );

      var c = new paper.Path.Circle(a, 2);
      c.fillColor = 'red';

      var tool = new paper.Tool();
      tool.onMouseMove = function( e ){
          ik( path, e.point );
          c.position = e.point;
      }

      var maxPoint = new paper.Point( 200, 200 );
      paper.view.onFrame = function() {
      }
  });
});
