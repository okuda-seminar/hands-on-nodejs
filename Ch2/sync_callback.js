function parseJsonSync(json) {
    try {
        return JSON.parse(json)
    } catch(err) {
        console.error('catch', err)
    }
}
parseJsonSync('tmp')