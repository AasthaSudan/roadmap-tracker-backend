const jwt = require("jsonwebtoken");

const authMiddleware = require("../src/middleware/authMiddleware");

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {

    test("should allow request with valid token", () => {

        const mockUser = {
            id: 101,
            email: "test@gmail.com"
        };

        jwt.verify
            .mockReturnValue(mockUser);

        const req = {
            headers: {
                authorization:
                    "Bearer valid_token"

            }

        };

        const res = {

            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };

        const next = jest.fn();

        authMiddleware(
            req,
            res,
            next
        );

        expect(jwt.verify)
            .toHaveBeenCalled();

        expect(req.user)
            .toEqual(mockUser);

        expect(next)
            .toHaveBeenCalled();
    });

    test("should reject request without token", () => {
        const req = {
            headers: {}
        };

        const res = {

            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };

        const next = jest.fn();

        authMiddleware(
            req,
            res,
            next
        );

        expect(res.status)
            .toHaveBeenCalledWith(401);

        expect(res.json)
            .toHaveBeenCalledWith({

                message:
                    "Access denied. No token provided."

            });

        expect(next)
            .not
            .toHaveBeenCalled();

    });

    test("should reject invalid token", () => {
        jwt.verify
            .mockImplementation(() => {

                throw new Error(
                    "Invalid token"
                );

            });

        const req = {

            headers: {

                authorization:
                    "Bearer invalid_token"

            }

        };

        const res = {

            status: jest.fn()
                .mockReturnThis(),

            json: jest.fn()

        };

        const next = jest.fn();

        authMiddleware(
            req,
            res,
            next
        );

        expect(res.status)
            .toHaveBeenCalledWith(401);

        expect(res.json)
            .toHaveBeenCalledWith({

                message:
                    "Invalid or expired token."

            });

        expect(next)
            .not
            .toHaveBeenCalled();

    });
});