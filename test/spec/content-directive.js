'use strict';

describe('content-directive', function() {
    var sandbox = sinon.sandbox.create();
    var angular;
    var $compile;
    var $rootScope;

    beforeEach(function(done) {
        require(['angular', 'content-directive'], function(_angular) {
            sandbox.stub(chrome.runtime, 'sendMessage');
            angular = _angular;
            done();
        });
    });
    beforeEach(module('app'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function() {
        sandbox.restore();
    });

    it('should send message', function() {
        var element = angular.element('<div provider="somewhere" content="something" content-id="contentID" result="result"></div>');

        $rootScope.contentID = 'SOME_ID';
        $compile(element)($rootScope);
        $rootScope.$digest();

        expect(chrome.runtime.sendMessage).to.have.been.calledWith({ msg: 'data', provider: 'somewhere', content: 'something', id: 'SOME_ID' }, sinon.match.func);
    });

    it('should set scope result to message response', function() {
        var element = angular.element('<div provider="somewhere" content="something" content-id="contentID" result="result"></div>');

        $rootScope.contentID = 'SOME_ID';
        $compile(element)($rootScope);
        $rootScope.$digest();

        chrome.runtime.sendMessage.yield({ some:    'attribute',
                                           another: 'thing' });
        $rootScope.$digest();

        expect($rootScope.result).to.deep.equal({ some:    'attribute',
                                                  another: 'thing' });
    });
});
