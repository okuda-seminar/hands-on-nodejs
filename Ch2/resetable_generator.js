function* resetableGeneratorFunc() {
    let count = 0
    while(true) {
        if (yield count++) {
            count = 0
        }
    }
}

const g = resetableGeneratorFunc()
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next(true))
console.log(g.next())