"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.Resolver = Resolver;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnresolvedAction = function () {
    function UnresolvedAction(resolver, args) {
        var dependencies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, UnresolvedAction);

        this.resolver = resolver;
        this.dependencies = dependencies;
        this.args = args;
    }

    _createClass(UnresolvedAction, [{
        key: "resolveDependencies",
        value: function resolveDependencies(store, getDependency) {
            var _this = this;

            var resolved = {};
            Object.keys(this.dependencies).forEach(function (dep) {
                resolved[dep] = getDependency(_this.dependencies[dep]);
            });
            resolved.getState = store.getState;
            resolved.dispatch = store.dispatch;
            return resolved;
        }
    }, {
        key: "execute",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dependencies) {
                var _resolver;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", (_resolver = this.resolver).call.apply(_resolver, [dependencies].concat(_toConsumableArray(this.args))));

                            case 1:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function execute(_x2) {
                return _ref.apply(this, arguments);
            }

            return execute;
        }()
    }]);

    return UnresolvedAction;
}();

var unresolvedActionMiddleware = exports.unresolvedActionMiddleware = function unresolvedActionMiddleware(getDependency) {
    return function (store) {
        return function (next) {
            return function (action) {
                if (!action || !(action instanceof UnresolvedAction)) return next(action);
                return action.execute(action.resolveDependencies(store, getDependency));
            };
        };
    };
};

function Resolver(dependencies) {
    return function (resolver) {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new UnresolvedAction(resolver, args, dependencies);
        };
    };
}