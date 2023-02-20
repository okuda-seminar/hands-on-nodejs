async function pauseAndResume(pausePeriod) {
    console.log('start pauseAndResume')
    await new Promise(resolve => setTimeout(resolve, pausePeriod))
    console.log('finish pauseAndResume')
}

pauseAndResume(10)
console.log('main')