/*
  Warnings:

  - You are about to drop the `syncaccuratefailed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `syncfrappefailed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `syncaccuratefailed`;

-- DropTable
DROP TABLE `syncfrappefailed`;

-- CreateTable
CREATE TABLE `sync_accurate_failed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `request` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_frappe_failed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_accurate` VARCHAR(191) NOT NULL,
    `id_frappe` VARCHAR(191) NOT NULL,
    `request` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
