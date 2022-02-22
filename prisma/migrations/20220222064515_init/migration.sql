/*
  Warnings:

  - Added the required column `status` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todo` ADD COLUMN `done` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `status` VARCHAR(20) NOT NULL;
