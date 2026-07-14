-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "difficulty" INTEGER,
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "stuckReason" TEXT,
    "timeStarted" TIMESTAMP(3),
    "timeEnded" TIMESTAMP(3),
    "roadmapId" INTEGER NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
