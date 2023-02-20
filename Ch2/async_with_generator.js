function parseJsonAsync(json) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                console.log('resolve')
                resolve(JSON.parse(json))
            } catch(err) {
                reject(err)
            }
        }, 10)
    })
}

function* asyncWithGeneratorFunc(json) {
    try {
        const result = yield parseJsonAsync(json)
        console.log('result', result)
    } catch(err) {
        console.error('error', err)
    }
}

function handleAsyncWithGenerator(generator, resolved) {
    console.log(resolved)
    const {done, value} = generator.next(resolved)
    console.log(done, value)
    if (done) {
        return Promise.resolve(value)
    }
    return value.then(
        resolved => handleAsyncWithGenerator(generator, resolved),
        err => generator.throw(err)
    )
}

handleAsyncWithGenerator(asyncWithGeneratorFunc('{"foo": 1}'))