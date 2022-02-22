/*
  Warnings:

  - You are about to drop the column `todo_id` on the `todo` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `todo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_todo_id_fkey`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_user_id_fkey`;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `todo_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `todoOrderId` INTEGER NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_todoOrderId_fkey` FOREIGN KEY (`todoOrderId`) REFERENCES `TodoOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
