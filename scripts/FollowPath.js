var FollowPath = function( target, obj ){
    this.path = path;
    this.obj = obj;
};
FollowPath.prototype = {
    tick: function( timeline ){

        var start = V3.$(0, 0, 0);
        var end = V3.$(timeline.length, 100, 0);

        var s = V3.sub(end, start);
        var o = V3.scale(s, timeline.now / timeline.length)[1];
        
        var v = this.path.getPointAt( o / 100 );
        this.obj.position.x = v[0];
        this.obj.position.y = v[1];
    }
};
