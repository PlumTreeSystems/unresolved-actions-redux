
class UnresolvedAction {
    constructor(resolver, args, dependencies = {}) {
        this.resolver = resolver;
        this.dependencies = dependencies;
        this.args = args;
    }

    resolveDependencies(store, getDependency) {
        const resolved = {};
        Object.keys(this.dependencies).forEach((dep) => {
            resolved[dep] = getDependency(this.dependencies[dep]);
        });
        resolved.getState = store.getState;
        resolved.dispatch = store.dispatch;
        return resolved;
    }

    async execute(dependencies) {
        return this.resolver.call(
            dependencies,
            ...this.args,
        );
    }
}

export const unresolvedActionMiddleware = getDependency => store => next => (action) => {
    if (!action || !(action instanceof UnresolvedAction)) return next(action);
    return action.execute(action.resolveDependencies(store, getDependency));
};

export function Resolver(dependencies) {
    return resolver => (...args) => new UnresolvedAction(resolver, args, dependencies);
}