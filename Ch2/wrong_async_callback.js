function parseJsonAsync(json, callback) {
    try {
        setTimeout(() => {
            callback(JSON.parse(json))
        }, 10)
    } catch(err) {
        // cannot reach here
        console.error('catch', err)
        callback({})
    }
}
parseJsonAsync('tmp', result => {
    console.log(result)
})