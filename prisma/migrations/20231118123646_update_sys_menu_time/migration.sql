/*
  Warnings:

  - Added the required column `update_time` to the `sys_menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sys_menu` ADD COLUMN `create_by` VARCHAR(255) NULL,
    ADD COLUMN `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `update_by` VARCHAR(255) NULL,
    ADD COLUMN `update_time` DATETIME(3) NOT NULL;
