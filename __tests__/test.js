import { readFileSync } from 'fs';
import genDiff from '../src';

const jsonPathBefore = './__tests__/__fixtures__/before.json';
const jsonPathAfter = './__tests__/__fixtures__/after.json';

test('json test', () => {
    expect(genDiff(jsonPathBefore, jsonPathAfter)).toBe(readFileSync('__tests__/__fixtures__/expected.txt', 'utf-8'));
});