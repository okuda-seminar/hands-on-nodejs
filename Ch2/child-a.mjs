console.log('child-a 1')
await new Promise(resolve => setTimeout(resolve, 100)) 
console.log('child-a 2')