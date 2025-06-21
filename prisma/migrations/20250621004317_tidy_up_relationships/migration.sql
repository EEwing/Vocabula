/*
  Warnings:

  - You are about to drop the column `entrolledAt` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_ownerId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Copy entrolledAt to enrolledAt
UPDATE "Enrollment" SET "enrolledAt" = "entrolledAt";

-- Drop the invalid entrolledAt column
ALTER TABLE "Enrollment" DROP COLUMN "entrolledAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- CreateIndex
CREATE INDEX "Lesson_chapterId_idx" ON "Lesson"("chapterId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
