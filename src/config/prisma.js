const { PrismaClient } = require('@prisma/client'); //imports the generated PrismaClient class

const prisma = new PrismaClient(); //Creates a single instance of PrismaClient, our database gateway

module.exports = prisma; //exporting the prisma client so our repositories can use it

//Singleton pattern: Only one prisma client instance for the entire application