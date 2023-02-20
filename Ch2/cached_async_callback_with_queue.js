function parseJsonAsync(json, callback) {
    setTimeout(() => {
        try {
            callback(JSON.parse(json))
        } catch(err) {
            console.log('catch')
            callback(err)
        }
    }, 10)
}

const cache = {}
function parseJsonAsyncWithCache(json, callback) {
    const cached = cache[json]
    if (cached) {
        process.nextTick(() => callback(cached.err, cached.result), 0)
        return
    }
    parseJsonAsync(json, (err, result) => {
        cache[json] = {err, result}
        callback(err, result)
    })
}

parseJsonAsyncWithCache('{"message": "Hello", "to": "World"}', (err, result) => {
    console.log('1', err, result)
    parseJsonAsyncWithCache('{"message": "Hello", "to": "World"}', (err, result) => {
        console.log('2', err, result)
    })
    console.log('2;')
})
console.log('1;')