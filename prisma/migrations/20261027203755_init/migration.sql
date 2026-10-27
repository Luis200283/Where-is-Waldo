-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "timeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Score_timeMs_idx" ON "Score"("timeMs");
