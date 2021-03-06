/**
 * approve.js 0.0.6
 * A simple validation library that doesn't interfere.
 * Author: Charl Gottschalk
 * @license: MIT
 */

/** @namespace approve */
;(function(root, factory) {    // eslint-disable-line no-extra-semi
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function() {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.approve = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is self)
        root.approve = factory();
    }
}(this, function(root) {
    /**
     * The result object returned by the <code>approve.value()</code> method.
     * @memberOf approve
     * @ignore
     */
    function Result() {
        this.approved = true;
        this.errors = [];
        // Provides easy access to the loop for the errors.
        this.each = function(fn) {
            var isFunc = fn && fn.constructor && fn.call && fn.apply,
                i = this.errors.length;
            while (i--) {
                if (isFunc) {
                    fn(this.errors[i]);
                }
            }
        };
    }

    /** @constructor */
    var approve = {};

    /** 
     * ApproveJs version
     * @memberOf approve
     * @ignore
     */
    approve.VERSION = '0.0.6';

    /**
     * Default tests.<br>
     * Each test has at least three members.<br>
     * <code>validate()</code> - the method which is called when testing a value.<br>
     * <code>message</code> - the property that holds the default error message.<br>
     * <code>expects</code> - the property that is either false if the test expects no parameters, or an array of strings representing the names of the expected parameters.<br>
     * Each test either returns a boolean or an object.
     * @memberOf approve
     * @namespace approve.tests
     */
    approve.tests = {
        /**
         * Checks if a value is present.
         * @example
         * approve.value('some value', {required: true});
         * @function required
         * @memberOf approve.tests
         * @inner
         */
        required: {
            validate: function(value) {
                return !!value;
            },
            message: '{title} is required',
            expects: false
        },
        /**
         * Checks if a value is a valid email address.
         * @example
         * approve.value('some value', {email: true});
         * @function email
         * @memberOf approve.tests
         * @inner
         */
        email: {
            regex: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} must be a valid email address',
            expects: false
        },
        /**
         * Checks if a value is a valid web address.
         * @example
         * approve.value('some value', {url: true});
         * @function url
         * @memberOf approve.tests
         * @inner
         */
        url: {
            regex: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} must be a valid web address',
            expects: false
        },
        /**
         * Checks if a value is a valid credit card number.
         * @example
         * approve.value('some value', {cc: true});
         * @function cc
         * @memberOf approve.tests
         * @inner
         */
        cc: {
            regex: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} must be a valid credit card number',
            expects: false
        },
        /**
         * Checks if a value contains both letters and numbers.
         * @example
         * approve.value('some value', {alphaNumeric: true});
         * @function alphaNumeric
         * @memberOf approve.tests
         * @inner
         */
        alphaNumeric: {
            regex: /^[A-Za-z0-9]+$/i,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} may only contain [A-Za-z] and [0-9]',
            expects: false
        },
        /**
         * Checks if a value contains only numbers.
         * @example
         * approve.value('some value', {numeric: true});
         * @function numeric
         * @memberOf approve.tests
         * @inner
         */
        numeric: {
            regex: /^[0-9]+$/,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} may only contain [0-9]',
            expects: false
        },
        /**
         * Checks if a value contains only letters.
         * @example
         * approve.value('some value', {alpha: true});
         * @function alpha
         * @memberOf approve.tests
         * @inner
         */
        alpha: {
            regex: /^[A-Za-z]+$/,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} may only contain [A-Za-z]',
            expects: false
        },
        /**
         * Checks if a value is a valid decimal.
         * @example
         * approve.value('some value', {decimal: true});
         * @function decimal
         * @memberOf approve.tests
         * @inner
         */
        decimal: {
            regex: /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} must be a valid decimal',
            expects: false
        },
        /**
         * Similar to 'decimal', but for currency values.
         * @example
         * approve.value('some value', {currency: true});
         * @function currency
         * @memberOf approve.tests
         * @inner
         */
        currency: {
            regex: /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/,
            validate: function(value) {
                return this.regex.test(value);
            },
            message: '{title} must be a valid currency value',
            expects: false
        },
        /**
         * Checks if a value is a valid ipv4 or ipv6 address.
         * @example
         * approve.value('some value', {ip: true});
         * @function ip
         * @memberOf approve.tests
         * @inner
         */
        ip: {
            regex: {
                ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
                ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
            },
            validate: function(value) {
                return this.regex.ipv4.test(value) || this.regex.ipv6.test(value);
            },
            message: '{title} must be a valid IP address',
            expects: false
        },
        /**
         * Checks if a value is a minimum of n characters.
         * @param {Integer} min - The minimum allowed length.
         * @example
         * approve.value('some value', {min: 5});
         * @function min
         * @memberOf approve.tests
         * @inner
         */
        min: {
            validate: function(value, pars) {
                return typeof value === 'string' && value.length >= pars.min;
            },
            message: '{title} must be a minimum of {min} characters',
            expects: ['min']
        },
        /**
         * Checks if a value is a maximum of n characters.
         * @param {Integer} max - The maximum allowed length.
         * @example
         * approve.value('some value', {max: 20});
         * @function max
         * @memberOf approve.tests
         * @inner
         */
        max: {
            validate: function(value, pars) {
                return typeof value === 'string' && value.length <= pars.max;
            },
            message: '{title} must be a maximum of {max} characters',
            expects: ['max']
        },
        /**
         * Checks if a value's length is between a minimum and maximum.
         * @param {Integer} min - The minimum allowed length.
         * @param {Integer} max - The maximum allowed length.
         * @example
         * var rule = {
         *     range: {
         *         min: 5,
         *         max: 20
         *     }
         * };
         * approve.value('some value', rule);
         * @function range
         * @memberOf approve.tests
         * @inner
         */
        range: {
            validate: function(value, pars) {
                return typeof value === 'string' && value.length >= pars.min && value.length <= pars.max;
            },
            message: '{title} must be a minimum of {min} and a maximum of {max} characters',
            expects: ['min', 'max']
        },
        /**
         * Checks if a value is the same as the value of another.
         * This test gets the value from a DOM &lt;input/&gt; element.
         * @param {String} field - The id of the DOM &lt;input/&gt; element to test against.
         * @example
         * var rule = {
         *     equal: 'password'
         * };
         * approve.value('some value', rule);
         * @function equal
         * @memberOf approve.tests
         * @inner
         */
        equal: {
            validate: function(value, pars) {
                return '' + value === '' + pars.value;
            },
            message: '{title} must be equal to {field}',
            expects: ['value', 'field']
        },
        /**
         * Checks if a value passes a given regular expression.
         * @param {RegExp} regex - The regular expression to test against. <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp" target="_blank">MDN</a>
         * @example
         * var rule = {
         *     format: /^[A-Za-z0-9]+$/i
         * };
         * approve.value('some value', rule);
         * @function format
         * @memberOf approve.tests
         * @inner
         */
        format: {
            validate: function(value, pars) {
                if (Object.prototype.toString.call(pars.regex) === '[object RegExp]') {
                    return pars.regex.test(value);
                }
                throw 'approve.value(): [format] - regex is not a valid regular expression.';
            },
            message: '{title} did not pass the [{regex}] test',
            expects: ['regex']
        }
    };

    /** 
     * A helper function for formatting strings:
     * @example
     * this._format('i can speak {language} since i was {age}', {language:'javascript',age:10});
     * @example
     * this._format('i can speak {0} since i was {1}', 'javascript',10});
     * @return {String} The formatted string.
     * @memberOf approve
     * @ignore
     */
    approve._format = function(text, col) {
        col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);
        return text.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
            if (m === "{{") { return "{"; }
            if (m === "}}") { return "}"; }
            return col[n];
        }).trim();
    };

    /** 
     * The start of the validation process:
     * @example
     * var result = this._start(value, rules);
     * @param {Object} value - The value to test.
     * @param {Object} rules - The object containing the test constraints.
     * @return {Object} The result of the test.
     * @memberOf approve
     * @ignore
     */
    approve._start = function(value, rules) {
        // Loop through given rules.
        for (var rule in rules) {
            if (rules.hasOwnProperty(rule) && rule !== 'title') {
                // This is used to format the message with the value title.
                var title = '',
                    // Set a pointer to the current rule's constraint.
                    constraint = rules[rule];
                // Check if the rule has a title property?
                if (rules.hasOwnProperty('title')) {
                    title = rules.title;
                }                
                // Check if rule exists in tests.
                if (this.tests.hasOwnProperty(rule)) {
                    // Set a pointer to the current test.
                    var params = {
                        constraint: constraint,
                        rule: rule,
                        title: title,
                        test: this.tests[rule],
                        value: value
                    };
                    return this._test(params);
                } else {
                    throw 'approve.value(): ' + rule + ' test not defined.';
                }
            }
        }
    };

    /** 
     * Performs the actual testing of the value and returns the result including any errors.
     * @example
     * var result = this._test(params);
     * @param {Object} params - The parameters required for testing.
     * @return {Object} The result of the test.
     * @memberOf approve
     * @ignore
     */
    approve._test = function(params) {
        // Instantiate a new result object.
        var result = new Result(),
            // Create an args object for required parameters.
            args = this._getArgs(params),
            // Test the value.
            ret = params.test.validate(params.value, args);
        // Check if the returned value is an object.
        if(typeof ret === 'object')
        {
            // An object was returned.
            // Check if the test was successful.
            result.approved = !ret.valid ? false : result.approved;
            // Add the error messages returned by the resluting object.
            result.errors = result.errors.concat(this._formatMessages(ret.errors, params));
            // Merge any properties from the resulting object with the main result to be returned.
            for (var prop in ret) {
                if (ret.hasOwnProperty(prop)) {
                    result[prop] = ret[prop];
                }
            }
        } else if (typeof ret !== 'boolean') {
            // We don't process if it's not a boolean or object.
            throw 'approve.value(): ' + params.rule + ' returned an invalid value';
        } else {
            result.approved = !ret ? false : result.approved;
        }
        if (!result.approved) {
            result.errors.push(this._formatMessage(params));
        }
        return result;
    };

    /** 
     * Helper method to loop over expected test parameters.
     * @example
     * this._eachExpected(params, function(expected) {
     *     // Do something with expected.
     * });
     * @param {Object} params - The parameters required for testing.
     * @param {Function} fn - The callback function called during loop.
     * @return {Void}
     * @memberOf approve
     * @ignore
     */
    approve._eachExpected = function(params, fn) {
        if (Array.isArray(params.test.expects)) {
            var expectsLength = params.test.expects.length,
                i = expectsLength;
            // This test expects paramaters.
            // Loop through the test's expected parameters and call the given function.
            while (i--) {
                fn(params.test.expects[i], expectsLength);
            }
        }
    };

    /** 
     * Returns an object containing the arguments for a test's expected parameters.
     * @example
     * var pars = this._getArgs(params);
     * @param {Object} params - The parameters required for testing.
     * @return {Object} The object containing the arguments.
     * @memberOf approve
     * @ignore
     */
    approve._getArgs = function(params) {
        var pars = {};
        // Does the test for this rule expect any paramaters?
        this._eachExpected(params, function(expects, expectsLength) {
            // Check if the rule object has the required parameter.
            if (params.constraint.hasOwnProperty(expects)) {
                // Add the expected parameter value to the pars object.
                pars[expects] = params.constraint[expects];
            } else if (expectsLength <= 1 && /^[A-Za-z0-9]+$/i.test(params.constraint)) {
                // Set the parameter to the rule's value.
                pars[expects] = params.constraint;      
            } else {
                throw 'approve.value(): ' + params.rule + ' expects the ' + expects + ' parameter.';
            }
        });
        
        // Does the rule have config?
        if (params.constraint.hasOwnProperty('config')) {
            // Add the config to the pars object.
            pars.config = params.constraint.config;
        }
        // Return the parameters object
        return pars;
    };

    /**
     * Returns an object containing placholder values to correctly format an error message.
     * @example
     * var format = this._getFormat(params);
     * @param {Object} params - The parameters required for testing.
     * @return {Object} The object used to format an error message.
     * @memberOf approve
     * @ignore
     */
    approve._getFormat = function(params) {
        var format = {};
        // Does the test for the rule expect parameters?
        this._eachExpected(params, function(expects) {
            // Check if the rule object has the required parameter.
            if (params.constraint.hasOwnProperty(expects)) {
                // Add the expected parameter's format to the parameter value.
                format[expects] = params.constraint[expects];
            }
            // Expected parameter not present, is the constraint formattable?
            if (/^[A-Za-z0-9]+$/i.test(params.constraint)) {
                format[expects] = params.constraint;
            }
        });
        format.title = params.title;
        // Return the formatted message.
        return format;
    };

    /**
     * Returns an array of formatted error messages returned by tests that return objects instead of booleans.
     * @example
     * var errors = this._formatMessages(['array', 'of', 'errors'], params);
     * @param {Array} errors - The array of unformatted errors returned by the test's result.
     * @param {Object} params - The parameters required for testing.
     * @return {Array} The formatted errors
     * @memberOf approve
     * @ignore
     */
    approve._formatMessages = function(errors, params) {
        var format = this._getFormat(params),
            i = errors.length;
        while (i--) {
            errors[i] = this._format(errors[i], format);
        }
        return errors;  
    };

    /**
     * Returns the correctly formatted message representing the current test's failure.
     * @example
     * this._message(rule, rules, title);
     * @param {Object} params - The parameters required for testing.
     * @return {String} The correctly formatted error message
     * @memberOf approve
     * @ignore
     */
    approve._formatMessage = function(params) {
        // Does the provided rule have a custom message?
        if (params.constraint.hasOwnProperty('message')) {
            // The rule has a custom message, return it.
            return params.constraint.message;
        }
        else {
            // The rule does not have a custom message.
            // Get the default message from the tests.
            var message = params.test.message,
                format = this._getFormat(params);
            return this._format(message, format);
        }        
    };

    /**
     * Executes the tests based on given rules to validate a given value.<br><br>
     * Returns an object with at least two properties:<br>
     * <code>approved</code> : Boolean - <code>true</code> if test succeeded, otherwise <code>false</code>.<br>
     * <code>errors</code> : Array of String - holds a list of formatted errors.
     * @example
     * var result = approve.value('some value', {test: constraints});
     * if (result.approved) {
     *    // Value is approved - do something
     * } else {
     *    // Do something with the errors
     *    result.each(function(error) {
     *       console.log(error);
     *    });
     * }
     * @param {Object} value - The value to test against the rules.
     * @param {Object} rules - The constraints for the value being tested.
     * @return {Object} The object containing the result of the tests performed.
     * @memberOf approve
     */
    approve.value = function(value, rules) {

        // If rules is not an object, we cannot continue.
        if (typeof rules !== 'object') {
            throw 'approve.value(value, rules): rules is not a valid object.';
        }
        // Return the result object.
        return this._start(value, rules);
    };

    /**
     * Used to add custom tests.
     * @example
     * var test = {
     *    expects: false,
     *    message: '{title} did not pass the test.',
     *    validate: function(value) {
     *        return this.strength(value);
     *    },
     * };
     * approve.addTest(test, 'test_name');
     * @param {Object} obj - The test object to add.
     * @param {String} name - The name of the test.
     * @return void
     * @memberOf approve
     */
    approve.addTest = function(obj, name) {
        // If obj is not a valid object, we cannot continue.
        if (typeof obj !== 'object') {
            throw 'approve.addTest(obj, name): obj is not a valid object.';
        }
        try {
            // Check if the test name already exists.
            if (!this.tests.hasOwnProperty(name)) {
                // The name does not exist, add it to the tests.
                this.tests[name] = obj;
            }
        } catch (e) {
            throw 'approve.addTest(): ' + e.message;
        }
    };

    /**
     * The result object containing the outcome of the strength test.
     * @param {string} message - The initial strength message.
     * @param {integer} min - The minimum length.
     * @param {integer} bonus - The minimum length before earning a bonus point.
     */
    function Score(message, min, bonus) {
        this.message = message;
        this.minimum = min;
        this.minimumBonus = bonus;
        this.score = {
            value: 0,
            isMinimum: false,
            hasLower: false,
            hasUpper: false,
            hasNumber: false,
            hasSpecial: false,
            isBonus: false,
            strength: 0
        };
        this.valid = false;
        this.errors = [];
    }
    /** 
     * Checks if a value is a strong password string.
     * @example
     * var rule = {
     *     strength: {
     *         min: 8,
     *         bonus: 10
     *     }
     * };
     * approve.value('some value', rule);
     * @return {Object} An object with various properties relating to the value's score.
     * @function strength
     * @memberOf approve.tests
     * @inner
     */
    var strength = {
        /**
         * The minimum length a password must be.
         */
        minimum: 8,
        /**
         * The minimum length a password must be for a bonus point.
         */
        minimumBonus: 10,
        /**
         * The text representing the strength of a password.
         */
        messages: {
            0: 'Very Weak',
            1: 'Weak',
            2: 'Better',
            3: 'Almost',
            4: 'Acceptable',
            5: 'Strong',
            6: 'Very Strong'
        },
        /**
         * The default error message.
         */
        message: '{title} did not pass the strength test.',
        /**
         * Expects the 'min' and 'bonus' parameters.
         */
        expects: ['min', 'bonus'],
        /**
         * Default error messages
         * @type {Object}
         */
        errors: {
            isMinimum: '{title} must be at least {min} characters',
            hasLower: '{title} must have at least 1 lower case character',
            hasUpper: '{title} must have at least 1 upper case character',
            hasNumber: '{title} must have at least 1 number',
            hasSpecial: '{title} must have at least 1 special character'
        },
        /**
         * Returns an object containing the score of a value.
         * @param {String} text - The text to score.
         * @return {Object} The score of the text.
         */
        score: function(text) {
            // Create the object that represents the score of the text
            var result = new Score(this.messages[0], this.minimum, this.minimumBonus);
            // If text is longer than minimum give 1 point.
            // If text is longer than minimumBonus give another 1 point.
            if (text.length > this.minimumBonus) {
                result.score.value += 2;
                result.score.isBonus = true;
                result.score.isMinimum = true;
            } else if (text.length > this.minimum){
                result.score.value++;
                result.score.isMinimum = true;
            } else {
                result.score.value = 1;
                result.score.isMinimum = false;
            }
            // If text has lowercase characters give 1 point.
            result.score.hasLower = text.match(/[a-z]/);
            if(result.score.isMinimum) {
                result.score.value++;
            }
            // If text has uppercase characters give 1 point.
            result.score.hasUpper = text.match(/[A-Z]/);
            if(result.score.isMinimum) {
                result.score.value++;
            }
            // If text has at least one number give 1 point.
            result.score.hasNumber = text.match(/\d+/);
            if(result.score.isMinimum) {
                result.score.value++;
            }
            // If text has at least one special caracther give 1 point.
            result.score.hasSpecial = text.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/);
            if(result.score.isMinimum) {
                result.score.value++;
            }
            // Set the percentage value.
            result.score.strength = Math.ceil((result.score.value / 6) * 100);
            // Return the score object.
            return result;
        },
        /**
         * Returns an object containing the score and validation of a value.
         * @param {String} text - The text to score.
         * @return {Object} The score and validation of the text.
         */
        strength: function (text) {
            var result = this.score(text);
            result.message = this.messages[result.score.value];
            if (!result.score.isMinimum) {
                result.errors.push(this.errors.isMinimum);
            }
            if (!result.score.hasLower) {
                result.errors.push(this.errors.hasLower);
            }
            if (!result.score.hasUpper) {
                result.errors.push(this.errors.hasUpper);
            }
            if (!result.score.hasSpecial) {
                result.errors.push(this.errors.hasSpecial);
            }
            if (!result.score.hasNumber) {
                result.errors.push(this.errors.hasNumber);
            }
            if (result.score.value > 4) {
              result.valid = true;
            } 
            return result;
        },
        /**
         * The method that is called by ApproveJs to perform the test.
         * @param {String} value - The value to test.
         * @return {Object} The result object of the test.
         */
        validate: function(value, pars) {
            this.minimum = pars.min || this.minimum;
            this.minimumBonus = pars.bonus || this.minimumBonus;
            if (pars.hasOwnProperty('config') && pars.config.hasOwnProperty('messages')) {
                for (var message in pars.config.messages) {
                    if (pars.config.messages.hasOwnProperty(message)) {
                        this.errors[message] = pars.config.messages[message];
                    }
                }
            }
            return this.strength(value);
        },
    };
    approve.tests.strength = strength;

    /*
     * Return the main ApproveJs object.
     */
    return approve;
}));