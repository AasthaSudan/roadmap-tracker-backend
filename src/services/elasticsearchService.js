const client = require("../config/elasticsearch");

const INDEX_NAME = "topics";

// Create Topics Index
async function createIndex() {
    const exists = await client.indices.exists({
        index: INDEX_NAME,
    });

    if (exists) {
        console.log("Topics index already exists.");
        return;
    }

    await client.indices.create({
        index: INDEX_NAME,
    });

    console.log("Topics index created successfully.");
}

// Index a Topic
async function indexTopic(topic) {
    await client.index({
        index: INDEX_NAME,

        id: topic.id.toString(),

        document: {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            difficulty: topic.difficulty,
        },
    });

    await client.indices.refresh({ index: INDEX_NAME });

    console.log(`Topic ${topic.id} indexed successfully.`);
}

// Search Topics
async function searchTopics(query) {
    const response = await client.search({
        index: INDEX_NAME,
        query: {
            multi_match: {
                query,
                fields: [
                    "title",
                    "description"
                ],
                fuzziness: "AUTO"
            }
        }
    });

    return response.hits.hits.map(hit => hit._source);
}

//Update Topic
async function updateTopic(topic) {
    await client.index({
        index: INDEX_NAME,

        id: topic.id.toString(),

        document: {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            difficulty: topic.difficulty,
        },
    });

    await client.indices.refresh({ index: INDEX_NAME });

    console.log(`Topic ${topic.id} updated in Elasticsearch.`);
}

//Delete Topic from Elasticsearch
async function deleteTopic(id) {
    try {
        await client.delete({
            index: INDEX_NAME,
            id: id.toString(),
        });

        console.log(`Topic ${id} removed from Elasticsearch.`);
    } catch (error) {
        console.log("Elasticsearch delete skipped:", error.message);
    }
}

//Delete Entire Index
async function deleteIndex() {

    const exists = await client.indices.exists({
        index: INDEX_NAME,
    });

    if (!exists) return;

    await client.indices.delete({
        index: INDEX_NAME,
    });

    console.log("Topics index deleted.");
}

module.exports = {
    createIndex,
    indexTopic,
    searchTopics,
    updateTopic,
    deleteTopic,
    deleteIndex,
};