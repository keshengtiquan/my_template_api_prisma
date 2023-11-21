/*
  Warnings:

  - You are about to drop the column `userName` on the `sys_user` table. All the data in the column will be lost.
  - Added the required column `user_name` to the `sys_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sys_user` DROP COLUMN `userName`,
    ADD COLUMN `user_name` VARCHAR(30) NOT NULL;
