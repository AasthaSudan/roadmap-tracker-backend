const roadmapService = require("../src/services/roadmapService");

const roadmapRepository = require("../src/repositories/roadmapRepository");

const redisClient = require("../src/config/redis");


// Mock dependencies
jest.mock("../src/repositories/roadmapRepository");

jest.mock("../src/config/redis");


describe("Roadmap Service", () => {


    beforeEach(() => {

        jest.clearAllMocks();

    });



    test("should create roadmap with valid data", async () => {


        const roadmapData = {

            title: "Backend Roadmap",
            description: "Node.js learning path",
            difficulty: 3

        };


        const mockRoadmap = {

            id: 1,
            ...roadmapData

        };


        roadmapRepository.createRoadmap
            .mockResolvedValue(mockRoadmap);



        redisClient.del
            .mockResolvedValue();



        const result =
            await roadmapService.createRoadmap(roadmapData);



        expect(result)
            .toEqual(mockRoadmap);



        expect(roadmapRepository.createRoadmap)
            .toHaveBeenCalledWith({

                title: "Backend Roadmap",
                description: "Node.js learning path",
                difficulty: 3

            });



        expect(redisClient.del)
            .toHaveBeenCalledWith("roadmaps");


    });



    test("should throw error when title is missing", async () => {


        const roadmapData = {

            description: "Testing roadmap"

        };


        await expect(
            roadmapService.createRoadmap(roadmapData)
        )
            .rejects
            .toThrow("Title is required");


    });



    test("should throw error when title is not string", async () => {


        const roadmapData = {

            title: 123

        };


        await expect(
            roadmapService.createRoadmap(roadmapData)
        )
            .rejects
            .toThrow("Title must be a string");


    });



    test("should throw error when title is empty", async () => {


        const roadmapData = {

            title: "     "

        };


        await expect(
            roadmapService.createRoadmap(roadmapData)
        )
            .rejects
            .toThrow("Title cannot be empty");


    });



    test("should throw error when difficulty is invalid", async () => {


        const roadmapData = {

            title: "DSA Roadmap",
            difficulty: 6

        };


        await expect(
            roadmapService.createRoadmap(roadmapData)
        )
            .rejects
            .toThrow(
                "Difficulty must be an integer between 1 and 5"
            );


    });

});