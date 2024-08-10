-- CreateTable
CREATE TABLE "testformdata" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL,

    CONSTRAINT "testformdata_pkey" PRIMARY KEY ("id")
);
