const elasticsearchService = require("../services/elasticsearchService");
const logger = require("../utils/logger");

async function main() {

    const results = await elasticsearchService.searchTopics("Redis");

    logger.info(results);

}

main();