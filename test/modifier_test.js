var Modifier = require('../Modifier');
var clone    = require('clone');
var jsdom    = require('jsdom');
var fs       = require('fs');
var expect   = require('chai').expect;

describe('Modifier.js', function () {
    var window, document, $, modifier, $module;

    beforeEach(function(done) {
        jsdom.env(
            fs.readFileSync(__dirname + '/fixtures/index.html', 'utf-8'),
            function (err, windowObj) {
                window = windowObj;
                document = windowObj.document;
                $ = require('jquery')(window);
                $module = $('#module');
                modifier = new Modifier($module, 'module');

                done();
            }
        );
    });

    describe('#on', function () {
        it('should switch on a modifier by adding the proper class to the element', function() {
            modifier.on('modifier');
            expect($module.hasClass('module--modifier')).to.be.true;
            modifier.on('modifier-separated-by-dashes');
            expect($module.hasClass('module--modifier-separated-by-dashes')).to.be.true;
        });

        it('should overwrite a previously set modifier with the same name', function() {
            modifier.set('modifier', 'value');
            modifier.on('modifier');
            expect($module[0].className.split(/\s+/)).to.deep.equal([
                'module--modifier'
            ]);
        });
    });

    describe('#off', function () {
        it('should remove a modifier from an element', function() {
            modifier.on('modifier');
            modifier.off('modifier');
            expect($module.hasClass('module--modifier')).to.be.false;
        });

        it('should remove a specific modifier from an element even if there are multiple other modifiers present', function() {
            modifier.on('modifier1');
            modifier.on('modifier2');
            modifier.on('modifier3', 'value');
            modifier.off('modifier3');
            expect($module[0].className).to.equal('module--modifier1 module--modifier2');
        });
    });

    describe('#toggle', function () {
        it('should toggle a modifier from an element', function() {
            modifier.toggle('modifier');
            expect($module.hasClass('module--modifier')).to.be.true;
            modifier.toggle('modifier');
            expect($module.hasClass('module--modifier')).to.be.false;
        });
    });

    describe('#set', function () {
        it('should add a modifier if `true` was given as a value', function() {
            modifier.set('modifier', true);
            expect($module[0].className.split(/\s+/)).to.deep.equal([
                'module--modifier'
            ]);
        });

        it('should remove a modifier if `false` was given as a value', function() {
            modifier.on('modifier');
            modifier.set('modifier', false);
            expect($module[0].className).to.equal('');
        });

        it('should add a modifier with the given string value', function() {
            modifier.set('modifier1', 'value1');
            expect($module[0].className).to.equal('module--modifier1_value1');
            modifier.set('modifier2', 'value2');
            expect($module[0].className).to.equal('module--modifier1_value1 module--modifier2_value2');
        });

        it('should fall back to a "true" value, if the value given is neither a boolean nor a string', function() {
            modifier.set('modifier', {something: 'neither boolean nor string'});
            expect($module[0].className).to.equal('module--modifier');
        });
    });

    describe('#get', function () {
        it('should return true if a modifier is set without value, or false if a modifier is not set at all', function() {
            modifier.on('modifier');
            expect(modifier.get('modifier')).to.be.true;
            modifier.off('modifier');
            expect(modifier.get('modifier')).to.be.false;
        });

        it('should return a modifier\'s value', function() {
            modifier.set('modifier', 'value');
            expect(modifier.get('modifier')).to.equal('value');
        });
    });

    describe('#getClassName', function () {
        it('should return a properly formatted classname', function() {
            expect(modifier.getClassName('modifier')).to.equal('module--modifier');
            expect(modifier.getClassName('modifier', 'value')).to.equal('module--modifier_value');
        });

        it('should return a properly formatted classname even with the default separators changed', function() {
            modifier = new Modifier($module, 'module', '__', '-');
            expect(modifier.getClassName('modifier')).to.equal('module__modifier');
            expect(modifier.getClassName('modifier', 'value')).to.equal('module__modifier-value');

            modifier = new Modifier($module, 'module__hook', '__', '-');
            expect(modifier.getClassName('modifier')).to.equal('module__hook__modifier');
            expect(modifier.getClassName('modifier', 'value')).to.equal('module__hook__modifier-value');
        });
    });

    describe('#getClassesByPrefix', function () {
        beforeEach(function() {
            $module.addClass('prefix_1 prefix_2 something else');
        });

        it('should return every class by a given prefix', function() {
            expect(Modifier.prototype.getClassesByPrefix($module, 'prefix_')).to.deep.equal([
                'prefix_1', 'prefix_2'
            ]);
        });

        it('should remove every class with a given prefix', function() {
            Modifier.prototype.removeClassesByPrefix($module, 'prefix_');
            expect($module[0].className.split(/\s+/)).to.deep.equal([
                'something', 'else'
            ]);
        });
    });
});
