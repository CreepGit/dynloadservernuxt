-- DropForeignKey
ALTER TABLE "testformdata" DROP CONSTRAINT "testformdata_byUserId_fkey";

-- AlterTable
ALTER TABLE "testformdata" ALTER COLUMN "byUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "testformdata" ADD CONSTRAINT "testformdata_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
