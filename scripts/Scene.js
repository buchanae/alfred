define( function(){

    var Scene = function( ctx ){
        this.ctx = ctx;
        this.nodes = [];
    };
    Scene.prototype = {

        tick: function(){
            scene.ctx.clearRect(0, 0, 400, 400);
            for( var i = 0; i < scene.nodes.length; i++ ){
                scene.nodes[i].tick( this );
            }
        }
    };

    return Scene;
});
