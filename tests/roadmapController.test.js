const roadmapController = require("../src/controllers/roadmapController");
const roadmapService = require("../src/services/roadmapService");

jest.mock("../src/services/roadmapService");


describe("Roadmap Controller", () => {


    test("should return all roadmaps", async () => {

        // Fake database response
        const mockRoadmaps = [
            {
                id: 1,
                title: "DSA Roadmap"
            },
            {
                id: 2,
                title: "Backend Roadmap"
            }
        ];


        // Mock service function
        roadmapService.getAllRoadmaps
            .mockResolvedValue(mockRoadmaps);



        // Mock Express response object
        const req = {};

        const res = {

            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };



        await roadmapController.getAllRoadmaps(
            req,
            res
        );



        expect(
            roadmapService.getAllRoadmaps
        )
            .toHaveBeenCalled();



        // Controller sends wrapped response
        expect(
            res.json
        )
            .toHaveBeenCalledWith({

                message:
                    "All roadmaps fetched successfully",

                data:
                    mockRoadmaps,

                total:
                    2
            });

    });



    test("should create roadmap", async () => {


        // Fake created roadmap
        const mockRoadmap = {

            id: 1,

            title: "Node Roadmap"

        };



        // Mock service response
        roadmapService.createRoadmap
            .mockResolvedValue(mockRoadmap);



        const req = {

            body: {

                title: "Node Roadmap"

            }

        };



        const res = {

            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };



        await roadmapController.createRoadmap(
            req,
            res
        );



        expect(
            roadmapService.createRoadmap
        )
            .toHaveBeenCalledWith(
                req.body
            );



        // Controller sends wrapped response
        expect(
            res.json
        )
            .toHaveBeenCalledWith({

                message:
                    "Roadmap created successfully",

                data:
                    mockRoadmap

            });

    });

});