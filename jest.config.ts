import nextJest from 'next/jest.js';
import type {Config} from 'jest';

const createJestConfig = nextJest({dir: './'});

const customJestConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@stores/(.*)$': '<rootDir>/src/stores/$1'
  }
};

export default createJestConfig(customJestConfig);
