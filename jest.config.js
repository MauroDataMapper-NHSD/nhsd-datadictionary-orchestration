/*
Copyright 2021-2024 NHS England

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
*/

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/jestSetup.ts',
    '<rootDir>/node_modules/',
    '.module.ts',
    '.html'
  ],
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$'
    }
  },
  moduleNameMapper: {
    '^@mdm/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  },
  reporters: [
    'default',
    ['jest-junit',{outputDirectory: 'test-report'}],
    ['jest-html-reporter', { pageTitle: 'Test Report' }]
  ],
  watchPathIgnorePatterns: ['test-report/', 'test-report.html', 'junit.xml'],
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)' // Ignore files inside node_modules folder
  ]
};
