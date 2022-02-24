/*
  Warnings:

  - You are about to alter the column `status` on the `todo` table. The data in that column could be lost. The data in that column will be cast from `Enum("todo_status")` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `todo` MODIFY `status` BOOLEAN NOT NULL DEFAULT false;
