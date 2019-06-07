export const sequentiallyResolvePromises = <T = any>(promiseFactories: Array<() => Promise<T>>): Promise<T[]> =>
    promiseFactories.reduce<Promise<T[]>>((acc, fac) =>
        acc.then(previousResults => fac().then(currentResult => [...previousResults, currentResult])),
        Promise.resolve([])
	);