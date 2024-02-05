import { expect, test } from 'bun:test'
import { flat } from '../src/index.js'

async function collect<T>(input: any): T[] {
  const output = []
  for await (const i of input) {
    output.push(i)
  }
  return output
}

test('empty array', async () => {
  expect(await collect(flat([]))).toEqual([])
})

test('resolved promises', async () => {
  expect(await collect(flat([Promise.resolve(1), 2]))).toEqual([1, 2])
})
