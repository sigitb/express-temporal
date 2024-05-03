-- AlterTable
ALTER TABLE `sync_accurate_failed` ADD COLUMN `type` ENUM('PRODUCT', 'SUPPLIER') NOT NULL DEFAULT 'PRODUCT';

-- AlterTable
ALTER TABLE `sync_frappe_failed` ADD COLUMN `type` ENUM('PRODUCT', 'SUPPLIER') NOT NULL DEFAULT 'PRODUCT';
