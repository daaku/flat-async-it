type Recursive<T> = T | Awaited<T> | Iterable<T> | AsyncIterable<T>

export async function* flat<T>(e: Recursive<T>): AsyncGenerator<T> {
  // await the promise, if any
  let v = await e

  if (v?.[Symbol.asyncIterator]) {
    for await (const sub of v) {
      yield* flat(sub)
    }
    return
  }

  if (v?.[Symbol.iterator]) {
    for (const sub of v) {
      yield* flat(sub)
    }
    return
  }

  // otherwise itself
  yield v
}
