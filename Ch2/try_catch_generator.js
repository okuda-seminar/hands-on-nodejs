function* tryCatchGeneratorFunc() {
    while(true) {
        // yield 1
        try {
            yield 1
        } catch(err) {
            console.error('inside', err)
            yield 2
        }
    }

}

const g = tryCatchGeneratorFunc()
console.log(g.next())
try {
    console.log(g.throw(new Error('dummy error')))
} catch(err) {
    console.error('outside', err)
}
console.log(g.next())