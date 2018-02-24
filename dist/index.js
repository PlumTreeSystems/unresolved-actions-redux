function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class UnresolvedAction {
    constructor(resolver, args, dependencies = {}) {
        this.resolver = resolver;
        this.dependencies = dependencies;
        this.args = args;
    }

    resolveDependencies(store, getDependency) {
        const resolved = {};
        Object.keys(this.dependencies).forEach(dep => {
            resolved[dep] = getDependency(this.dependencies[dep]);
        });
        resolved.getState = store.getState;
        resolved.dispatch = store.dispatch;
        return resolved;
    }

    execute(dependencies) {
        var _this = this;

        return _asyncToGenerator(function* () {
            return _this.resolver.call(dependencies, ..._this.args);
        })();
    }
}

export const unresolvedActionMiddleware = getDependency => store => next => action => {
    if (!action || !(action instanceof UnresolvedAction)) return next(action);
    return action.execute(action.resolveDependencies(store, getDependency));
};

export function Resolver(dependencies) {
    return resolver => (...args) => new UnresolvedAction(resolver, args, dependencies);
}