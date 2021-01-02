const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const filter = (predicate, ...tasks) => (predicate ? tasks : []);
const isType = (...types) => env.TYPE === undefined || types.includes(env.TYPE);

module.exports = {
    build: ['clean:build', 'sh:build-es2019', 'sh:build-es5'],
    lint: ['sh:lint-config', 'sh:lint-src', 'sh:lint-test'],
    test: [...filter(isType('integration'), 'sh:test-integration'), ...filter(isType('unit'), 'sh:test-unit')]
};
