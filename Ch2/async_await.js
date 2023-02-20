function parseJsonAsync(json) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(JSON.parse(json))
            } catch(err) {
                reject(err)
            }
        }, 10)
    })
}

async function asyncFunc(json) {
    try {
        const result = await parseJsonAsync(json)
        console.log('result', result)
    } catch(err) {
        console.error('error', err)
    }
}

asyncFunc('{ "foo": 1 }')