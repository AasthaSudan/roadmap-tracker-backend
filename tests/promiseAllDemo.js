function task(name, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${name} completed`);
            resolve();
        }, delay);
    });
}

async function sequential() { //tasks are executed one after the other, one task must complete before the next one starts

    console.time("Sequential");

    await task("Task 1", 1000);
    await task("Task 2", 1000);
    await task("Task 3", 1000);

    console.timeEnd("Sequential");
}

async function parallel() { //all tasks start at the same time and run in parallel

    console.time("Parallel");

    await Promise.all([ //Promise.all() takes an array of promises and returns a new promise that resolves when all the promises in the array have resolved
        task("Task 1", 1000),
        task("Task 2", 1000),
        task("Task 3", 1000),
    ]); //await pauses the execution of parallel() until all the promises in the array have resolved

    console.timeEnd("Parallel");
}

(async () => {

    await sequential();

    console.log("----------------");

    await parallel();

})();