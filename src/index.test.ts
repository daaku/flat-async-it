import { expect, test } from 'bun:test'
import { flat } from '../src/index.js'

async function collect<T>(input: any): Promise<T[]> {
  const output = []
  for await (const i of input) {
    output.push(i)
  }
  return output
}

function flatTest(name: string, v: Parameters<typeof flat>[0]) {
  test(name, async () => {
    expect(await collect(flat(v))).toMatchSnapshot()
  })
}

flatTest('empty array', [])

flatTest('multiple empty arrays', [[], [[]]])

flatTest('resolved promises', [Promise.resolve(1), 2])

flatTest(
  'two levels of async iterators with promises',
  (() => {
    async function* one() {
      yield Promise.resolve(1)
      yield 2
    }
    async function* two() {
      yield one()
      yield 3
      yield Promise.resolve(4)
    }
    return two()
  })(),
)

flatTest('array of arrays, literals and promises', [
  1,
  Promise.resolve(2),
  [3, Promise.resolve(4)],
  Promise.resolve([5, Promise.resolve(6)]),
])

flatTest('array of function literals', [
  1,
  (async () => 2)(),
  [3, Promise.resolve(4)],
  (async function* () {
    yield 5
    yield Promise.resolve(6)
    yield [7, 8]
    yield* [9, 10]
  })(),
])
