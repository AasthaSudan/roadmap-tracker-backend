const elasticsearchService = require("../services/elasticsearchService");

async function main() {

    await elasticsearchService.createIndex();

    await elasticsearchService.indexTopic({

        id: 1,

        title: "Learn Redis",

        description: "Introduction to Redis",

        difficulty: 2,

    });

}

main();