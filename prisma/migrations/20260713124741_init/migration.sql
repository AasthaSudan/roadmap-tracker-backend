-- CreateTable
CREATE TABLE "Roadmap" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" INTEGER,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);
