/*
  Warnings:

  - The values [PAYMENT_ENTRY] on the enum `sync_frappe_failed_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [PAYMENT_ENTRY] on the enum `sync_frappe_failed_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `sync_accurate_failed` MODIFY `type` ENUM('PRODUCT', 'SUPPLIER', 'PURCHASE_ORDER', 'PURCHASE_INVOICE') NOT NULL DEFAULT 'PRODUCT';

-- AlterTable
ALTER TABLE `sync_frappe_failed` MODIFY `type` ENUM('PRODUCT', 'SUPPLIER', 'PURCHASE_ORDER', 'PURCHASE_INVOICE') NOT NULL DEFAULT 'PRODUCT';
