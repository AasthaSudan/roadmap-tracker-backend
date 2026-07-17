const elasticsearchService = require("./services/elasticsearchService");

async function main() {
    await elasticsearchService.createIndex();
}

main();