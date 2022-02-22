/*
  Warnings:

  - You are about to drop the column `todoOrderId` on the `todo` table. All the data in the column will be lost.
  - Made the column `userId` on table `todo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_todoOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_userId_fkey`;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `todoOrderId`,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
