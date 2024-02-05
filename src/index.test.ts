import { expect, test } from 'bun:test'
import { flat } from '../src/index.js'

test('empty array', () => {
  expect(flat([])).toEqual([])
})
