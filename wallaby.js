module.exports = function(wallaby) {
  const testPathExp = 'src/**/*.test.ts?(x)';

  process.env.NODE_ENV = 'test';

  return {
    files: [
      'tsconfig.json',
      'tsconfig.test.json',
      'src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg|graphql)',
      `!${testPathExp}`,
      '!src/**/*.d.ts'
    ],

    tests: [testPathExp],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.ts?(x)': wallaby.compilers.babel({
        presets: ['@babel/react', '@babel/typescript'],
        plugins: ['module:jsx-control-statements',  '@babel/proposal-class-properties']
      })
    },

    setup: wallaby => {
      const jestConfig = require('react-scripts/scripts/utils/createJestConfig')(
        p => require.resolve('react-scripts/' + p),
        '.',
        ['src']
      );
      Object.keys(jestConfig.transform || {}).forEach(
        k => ~k.indexOf('^.+\\.(ts|tsx|js|jsx)') && void delete jestConfig.transform[k]
      );
      console.log(jestConfig);
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest'
  };
};