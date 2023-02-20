const asyncIterable = {
    [Symbol.asyncIterator]() {
        let i = 0
        return {
            next() {
                if(i > 3) {
                    return Promise.resolve({done: true})
                }
                return new Promise(resolve => setTimeout(
                    () => resolve({value: i++, done: false}),
                    100
                ))
            }
        }
    }
}

async function main() {
    for await (const element of asyncIterable) {
        console.log(element)
    }
}
main()