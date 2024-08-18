/*
  Warnings:

  - Added the required column `byUserId` to the `testformdata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testformdata" ADD COLUMN     "byUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "testformdata" ADD CONSTRAINT "testformdata_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
