'use strict';

function Modifier($object, baseClass, modifierSeparator, valueSeparator) {
    this.$object = $object;
    this.baseClass = baseClass;

    this.sep = {
        mod: modifierSeparator === undefined ? '--': modifierSeparator,
        val: valueSeparator === undefined ? '_': valueSeparator
    };
}

Modifier.prototype.set = function(name, value) {
    var className = this.getClassName(name);

    this.removeClassesByPrefix(this.$object, className);

    if (value !== false && value !== undefined) {
        className = this.getClassName(name, value);
        this.$object.addClass(className);
    }

    return this;
};

Modifier.prototype.get = function(name) {
    var modifierClass = this.getClassName(name);

    var classes = this.getClassesByPrefix(this.$object, modifierClass);
    // Modifier not found
    if (classes.length === 0) {
        return false;
    }

    var value = classes[0].replace(modifierClass, '').split(this.sep.val);

    // Modifier found, but doesn't have a specific value
    if (value[1] === undefined) {
        return true;
    }

    // Modifier found with a value
    return value[1];
};

Modifier.prototype.on = function(name) {
    this.set(name, true);

    return this;
};

Modifier.prototype.off = function(name) {
    this.set(name, false);

    return this;
};

Modifier.prototype.toggle = function(name) {
    if (this.get(name)) {
        return this.set(name, false);
    }

    return this.set(name, true);
};

Modifier.prototype.getClassName = function(name, value) {
    var classNameArr = [
        this.baseClass,
        this.sep.mod,
        name
    ];

    if (typeof value === 'string') {
        classNameArr.push(this.sep.val);
        classNameArr.push(value);
    }

    return classNameArr.join('');
};

Modifier.prototype.getClassesByPrefix = function($object, prefix) {
    var classes = $object.attr('class');
    if (!classes) { // if "falsy", for ex: undefined or empty string
        return [];
    }

    classes = classes.split(' ');
    var matches = [];
    for (var i = 0; i < classes.length; i++) {
        var match = new RegExp('^(' + prefix + ')(.*)').exec(classes[i]);
        if (match != null) {
            matches.push(match[0]);
        }
    }

    return matches;
};

Modifier.prototype.removeClassesByPrefix = function($object, prefix) {
    var matches = this.getClassesByPrefix($object, prefix);
    matches = matches.join(' ');
    $object.removeClass(matches);
};

module.exports = Modifier;
