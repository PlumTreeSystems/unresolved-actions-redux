"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unresolvedActionMiddleware = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

exports.Resolver = Resolver;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UnresolvedAction = function () {
    function UnresolvedAction(resolver, args) {
        var dependencies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3.default)(this, UnresolvedAction);

        this.resolver = resolver;
        this.dependencies = dependencies;
        this.args = args;
    }

    (0, _createClass3.default)(UnresolvedAction, [{
        key: "resolveDependencies",
        value: function resolveDependencies(store, getDependency) {
            var _this = this;

            var resolved = {};
            (0, _keys2.default)(this.dependencies).forEach(function (dep) {
                resolved[dep] = getDependency(_this.dependencies[dep]);
            });
            resolved.getState = store.getState;
            resolved.dispatch = store.dispatch;
            return resolved;
        }
    }, {
        key: "execute",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dependencies) {
                var _resolver;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt("return", (_resolver = this.resolver).call.apply(_resolver, [dependencies].concat((0, _toConsumableArray3.default)(this.args))));

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