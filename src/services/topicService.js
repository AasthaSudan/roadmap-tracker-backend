const prisma = require('../config/prisma');
const topicRepository = require('../repositories/topicRepository');

const ALLOWED_TOPIC_STATUSES = [
    'NOT_STARTED',
    'DONE',
    'STUCK'
];

async function validateAndNormalizeTopicInput(body, isUpdate = false) {

    const {
        title,
        description,
        roadmapId,
        dayNumber,
        status,
        stuckReason
    } = body;

    const updates = {};


    // ===== title =====

    if (!isUpdate || title !== undefined) {

        if (title === undefined) {
            throw {
                statusCode: 400,
                message: 'Title is required'
            };
        }


        if (typeof title !== 'string') {
            throw {
                statusCode: 400,
                message: 'Title must be a string'
            };
        }


        const cleanTitle = title.trim();


        if (!cleanTitle) {
            throw {
                statusCode: 400,
                message: 'Title cannot be empty'
            };
        }


        updates.title = cleanTitle;
    }

    // ===== roadmapId =====

    if (!isUpdate || roadmapId !== undefined) {

        if (roadmapId === undefined) {

            throw {
                statusCode: 400,
                message: 'Roadmap id is required'
            };
        }


        if (
            typeof roadmapId !== 'number' ||
            !Number.isInteger(roadmapId) ||
            roadmapId <= 0
        ) {

            throw {
                statusCode: 400,
                message: 'Roadmap id must be valid integer'
            };
        }


        const roadmap =
            await prisma.roadmap.findUnique({
                where: {
                    id: roadmapId
                }
            });


        if (!roadmap) {

            throw {
                statusCode: 404,
                message: `Roadmap with id ${roadmapId} not found`
            };
        }


        updates.roadmapId = roadmapId;
    }

    // ===== dayNumber =====

    if (!isUpdate || dayNumber !== undefined) {

        if (dayNumber === undefined) {
            throw {
                statusCode: 400,
                message: "Day number is required"
            };
        }

        if (
            typeof dayNumber !== "number" ||
            !Number.isInteger(dayNumber) ||
            dayNumber <= 0
        ) {
            throw {
                statusCode: 400,
                message: "Day number must be a positive integer"
            };
        }

        updates.dayNumber = dayNumber;
    }

    // ===== status =====

    if (status !== undefined) {

        if (typeof status !== 'string') {

            throw {
                statusCode: 400,
                message: 'Status must be string'
            };
        }


        const cleanStatus =
            status.trim().toUpperCase();


        if (!ALLOWED_TOPIC_STATUSES.includes(cleanStatus)) {

            throw {
                statusCode: 400,
                message:
                    `Status must be one of ${ALLOWED_TOPIC_STATUSES.join(', ')}`
            };
        }


        updates.status = cleanStatus;

    }
    else if (!isUpdate) {

        updates.status = "NOT_STARTED";
    }

    // ===== stuckReason =====

    if (stuckReason !== undefined) {

        if (typeof stuckReason !== 'string') {

            throw {
                statusCode: 400,
                message: 'stuckReason must be string'
            };
        }


        updates.stuckReason =
            stuckReason.trim();

    }
    else if (!isUpdate) {

        updates.stuckReason = null;
    }

    // STUCK validation

    if (
        updates.status === "STUCK" &&
        !updates.stuckReason
    ) {

        throw {
            statusCode: 400,
            message: 'stuckReason is required when status is STUCK'
        };
    }

    return updates;
}

// CREATE

async function createTopic(body) {

    const data =
        await validateAndNormalizeTopicInput(
            body,
            false
        );

    return topicRepository.createTopic(data);
}

// GET ALL

async function getTopics(roadmapIdQuery) {

    if (!roadmapIdQuery) {

        return topicRepository.getAllTopics();
    }


    const roadmapId =
        Number(roadmapIdQuery);



    if (!Number.isInteger(roadmapId)) {

        throw {
            statusCode: 400,
            message: 'Invalid roadmapId'
        };
    }


    return topicRepository.getTopicsByRoadmapId(
        roadmapId
    );
}

// GET BY ID

async function getTopicById(id) {

    console.log("Incoming id:", id);

    const topicId = Number(id);

    console.log("Converted id:", topicId);

    if (!Number.isInteger(topicId)) {

        throw {
            statusCode: 400,
            message: 'Invalid topic id'
        };
    }

    const topic =
        await topicRepository.getTopicById(topicId);

    console.log("Topic from DB:", topic);

    if (!topic) {
        throw {
            statusCode: 404,
            message: `Topic ${topicId} not found`
        };
    }


    return topic;
}

// UPDATE

async function updateTopic(id, body) {

    const topicId = Number(id);


    const existing =
        await topicRepository.getTopicById(topicId);



    if (!existing) {

        throw {
            statusCode: 404,
            message: `Topic ${topicId} not found`
        };
    }



    const updates =
        await validateAndNormalizeTopicInput(
            body,
            true
        );


    return topicRepository.updateTopic(
        topicId,
        updates
    );
}

// DELETE

async function deleteTopic(id) {

    const topicId = Number(id);

    try {

        return await topicRepository.deleteTopic(topicId);

    }
    catch (error) {

        if (error.code === "P2025") {

            throw {
                statusCode: 404,
                message: `Topic ${topicId} not found`
            };
        }


        throw error;
    }
}

module.exports = {
    createTopic,
    getTopics,
    getTopicById,
    updateTopic,
    deleteTopic
};