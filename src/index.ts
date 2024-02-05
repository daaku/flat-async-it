type Recursive<T> = T | Awaited<T> | Iterable<T> | AsyncIterable<T>

export async function* flat<T>(
  r: AsyncIterable<Recursive<T>>,
): AsyncGenerator<T> {
  for await (const e of r) {
    // await the promise, if any
    let v = await e

    // async iterable or iterable
    if (v?.[Symbol.asyncIterator] || v?.[Symbol.iterator]) {
      for (const sub of v) {
        yield flat(await sub)
      }
      return
    }

    // otherwise itself
    yield v
  }
}
