const errorMiddleware = require("../src/middleware/errorMiddleware");

describe("Error Middleware", () => {

    test("should handle default server error", () => {

        const error = new Error(
            "Something went wrong"
        );

        const req = {};
        const res = {
            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };

        const next = jest.fn();

        errorMiddleware(
            error,
            req,
            res,
            next
        );

        expect(res.status)
            .toHaveBeenCalledWith(500);

        expect(res.json)
            .toHaveBeenCalledWith({
                success: false,
                message:
                    "Something went wrong"

            });
    });

    test("should handle custom error status", () => {

        const error = new Error(
            "Roadmap not found"
        );

        error.statusCode = 404;

        const req = {};

        const res = {

            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };

        const next = jest.fn();

        errorMiddleware(
            error,
            req,
            res,
            next
        );

        expect(res.status)
            .toHaveBeenCalledWith(404);

        expect(res.json)
            .toHaveBeenCalledWith({
                success: false,
                message:
                    "Roadmap not found"

            });
    });
});