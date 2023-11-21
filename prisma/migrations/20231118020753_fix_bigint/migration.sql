/*
  Warnings:

  - The primary key for the `sys_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `tenant_id` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sys_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `dept_id` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Made the column `email` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `remark` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `create_time` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_time` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tenant_id` on table `sys_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sys_role` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `tenant_id` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sys_user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `email` VARCHAR(60) NOT NULL DEFAULT '',
    MODIFY `gender` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `status` CHAR(1) NOT NULL DEFAULT '0',
    MODIFY `remark` VARCHAR(500) NOT NULL DEFAULT 'null',
    MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `update_time` DATETIME(3) NOT NULL,
    MODIFY `dept_id` INTEGER NULL,
    MODIFY `phone_number` VARCHAR(11) NOT NULL DEFAULT '',
    MODIFY `tenant_id` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);
