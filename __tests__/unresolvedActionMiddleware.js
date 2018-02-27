var redux = require('redux');
var unresolvedActionMiddleware = require('../dist/index.js').unresolvedActionMiddleware;
describe('Middleware', function(){
    it('should be accepted by redux store', function(){
        var middleware = unresolvedActionMiddleware(function(){return null;});
        var store = redux.createStore(function(store){return store || {};}, redux.applyMiddleware(middleware));
        expect(store).not.toBeNull();
    })
});