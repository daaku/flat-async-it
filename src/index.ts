type Recursive<T> = T | Awaited<T> | Iterable<T> | AsyncIterable<T>

export async function* flat<T>(
  e: Recursive<T | Recursive<T>>,
): AsyncGenerator<T> {
  // await the promise, if any
  let v = await e

  if (v && typeof v === 'object') {
    if (Symbol.asyncIterator in v) {
      for await (const sub of v) {
        yield* flat(sub)
      }
      return
    }

    if (Symbol.iterator in v) {
      for (const sub of v) {
        yield* flat(sub)
      }
      return
    }
  }

  // otherwise itself
  yield v
}
