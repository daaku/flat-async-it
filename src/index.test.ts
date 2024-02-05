import { expect, test } from 'bun:test'
import { flat } from '../src/index.js'

async function collect<T>(input: any): Promise<T[]> {
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

test('two levels of async iterators with promises', async () => {
  async function* one() {
    yield Promise.resolve(1)
    yield 2
  }
  async function* two() {
    yield one()
    yield 3
    yield Promise.resolve(4)
  }
  expect(await collect(flat(two()))).toEqual([1, 2, 3, 4])
})

test('mixed array 01', async () => {
  const thing = [
    1,
    Promise.resolve(2),
    [3, Promise.resolve(4)],
    Promise.resolve([5, Promise.resolve(6)]),
  ]
  expect(await collect(flat(thing))).toEqual([1, 2, 3, 4, 5, 6])
})
