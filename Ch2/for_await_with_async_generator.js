async function* asyncGenerator() {
    let i = 0
    while (i <= 3) {
        await new Promise(resolve => setTimeout(resolve, 100))
        yield i++
    }   
}

async function main() {
    for await (const element of asyncGenerator()) {
        console.log(element)
    }
}

main()