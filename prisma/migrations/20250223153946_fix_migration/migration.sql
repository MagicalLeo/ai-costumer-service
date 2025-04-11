/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Message` MODIFY `content` LONGTEXT NOT NULL;

-- DropTable
DROP TABLE `User`;
