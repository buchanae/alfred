define(['domReady', 'chain', 'qunit'], 
       function(domReady, Chain) {

    domReady(function() {

        test("foo", function() {
            var c = new Chain( 1, 2 );
            equals( c.root.x, 1 );
            equals( c.root.y, 2 );
            equals( c.root.next, null );
            equals( c.root.prev, null );
            equals( c.end, c.root );
            equals( c.length(), 0 );
            equals( c.reachable( 1, 2 ), true );
            equals( c.reachable( 1, 3 ), false);

        });

    });
});
