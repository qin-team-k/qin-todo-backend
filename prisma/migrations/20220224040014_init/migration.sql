-- AlterTable
ALTER TABLE `todo` ADD COLUMN `status` ENUM('TODAY', 'TOMORROW', 'NEXT') NOT NULL DEFAULT 'TODAY';
