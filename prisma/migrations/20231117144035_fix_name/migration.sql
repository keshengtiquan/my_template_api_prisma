/*
  Warnings:

  - You are about to drop the column `role_name_en` on the `sys_role` table. All the data in the column will be lost.
  - You are about to alter the column `create_time` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `update_time` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to drop the column `deptId` on the `sys_user` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `sys_user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `sys_user` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `sys_user` table. All the data in the column will be lost.
  - You are about to alter the column `create_time` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `update_time` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - Added the required column `role_key` to the `sys_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nick_name` to the `sys_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sys_role` DROP COLUMN `role_name_en`,
    ADD COLUMN `role_key` VARCHAR(100) NOT NULL,
    MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `update_time` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `deptId`,
    DROP COLUMN `nickName`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `tenantId`,
    ADD COLUMN `dept_id` BIGINT NULL,
    ADD COLUMN `nick_name` VARCHAR(30) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(11) NOT NULL DEFAULT '',
    ADD COLUMN `tenant_id` BIGINT NOT NULL DEFAULT 0,
    MODIFY `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `update_time` DATETIME(3) NOT NULL;
