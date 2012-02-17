define(['domReady', 'Point', 'IKChain', 'raphael'], function(domReady, Point, IKChain) {

  domReady(function() {
      var paper = Raphael(document.getElementById("test"), 200, 200);

      function Dude() {
          var shoulder = new Point(100, 30);
          var hip = new Point(100, 70);

          this.rarm = [shoulder, new Point(120, 30), new Point(140, 30)];
          this.larm = [shoulder, new Point(80, 30), new Point(60, 30)];
          
          this.rleg = [hip, new Point(120, 70), new Point(140, 70)];
          this.lleg = [hip, new Point(80, 70), new Point(60, 70)];
      }

      var d = new Dude();

      var arm_dots = [];
      for( var i = 0; i < d.rarm.length; i++ ){

          var c = paper.circle( d.rarm[i].x, d.rarm[i].y, 3 );
          c.attr('fill', 'green');
          arm_dots.push(c);
      }

      function update_arm() {
          for( var i = 0; i < d.rarm.length; i++ ){

              arm_dots[i].attr('cx', d.rarm[i].x);
              arm_dots[i].attr('cy', d.rarm[i].y);
          }
      }

      var ik_rarm = new IKChain( d.rarm );
      var target = new Point( 170, 40 );

      var inc = -1;
      /*
      setInterval(function() {
          if( target.x < 10 || target.x > 170 ) {
              inc = inc * -1;
          }
          target.x += inc;
          c.attr('cx', target.x);
          ik_rarm.solve(target);
          update_arm();
      }, 10);
      */
      var p = paper.path("M 60, 10 L 90, 10 L 60, 60");
      var len = p.getTotalLength();

      paper.customAttributes.along = function( v ){
          var point = p.getPointAtLength(v * len);
          return {
              cx: point.x,
              cy: point.y
          };
      };

      var c = paper.circle( target.x, target.y , 2 );
      c.attr('fill', 'red');

      c.drag(function(dx, dy, x, y){
          c.attr('cx', x);
          c.attr('cy', y);
          target.x = x;
          target.y = y;
          ik_rarm.solve(target);
          update_arm();
      });

      c.attr({along: 0});
      c.onAnimation(function() { 
          target.x = this.attr('cx');
          target.y = this.attr('cy');
          ik_rarm.solve(target);
          update_arm();
      });

      var backward = Raphael.animation({ along: 0 }, 1000, function() {
          c.animate(forward);
      });
      var forward = Raphael.animation({ along: 1 }, 1000, function() {
          c.animate(backward);
      });

      c.animate(forward);

      // shoulder mark
      var s = paper.circle( 100, 30, 2 );
      s.attr('fill', 'red');
  });
});
