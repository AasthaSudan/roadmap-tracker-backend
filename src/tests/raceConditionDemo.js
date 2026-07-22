let counter = 0;

async function increment(name) {

    const current = counter;

    await new Promise(resolve =>
        setTimeout(resolve, 100)
    );

    counter = current + 1;

    console.log(`${name}: ${counter}`);
}

(async () => {

    await Promise.all([
        increment("A"),
        increment("B"),
    ]);

    console.log("Final Counter:", counter);

})();