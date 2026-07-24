const swaggerJsdoc = require("swagger-jsdoc"); // library to generate swagger documentation

const options = { // swagger options

    definition: { // swagger definition
        openapi: "3.0.0", // swagger version

        info: { // api metadata
            title: "Roadmap Tracker API",
            version: "1.0.0",
            description:
                "Backend API for Roadmap Tracker"
        },

        servers: [ // api server
            {
                url:
                    "http://localhost:3000" // server url
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [
        "./src/routes/**/*.js" // ** means scan all nested folders
    ]
};

const swaggerSpec = swaggerJsdoc(options); // generate swagger

module.exports = swaggerSpec;