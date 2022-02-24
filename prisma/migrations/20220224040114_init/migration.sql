/*
  Warnings:

  - You are about to alter the column `status` on the `todo` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum("todo_status")`.

*/
-- AlterTable
ALTER TABLE `todo` MODIFY `status` ENUM('TODAY', 'TOMORROW', 'NEXT') NOT NULL DEFAULT 'TODAY';
