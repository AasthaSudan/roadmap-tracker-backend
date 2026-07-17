const elasticsearchService = require("./services/elasticsearchService");

async function main() {

    const results = await elasticsearchService.searchTopics("Redis");

    console.log(results);

}

main();