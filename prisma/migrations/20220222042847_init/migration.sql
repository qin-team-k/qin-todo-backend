/*
  Warnings:

  - You are about to drop the column `todo_ids` on the `todo` table. All the data in the column will be lost.
  - Added the required column `todo_id` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_todo_ids_fkey`;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `todo_ids`,
    ADD COLUMN `todo_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_todo_id_fkey` FOREIGN KEY (`todo_id`) REFERENCES `TodoOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
