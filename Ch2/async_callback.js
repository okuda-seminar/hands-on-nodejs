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
parseJsonAsync('tmp', (err, result) => {
    console.log(err, result)
})