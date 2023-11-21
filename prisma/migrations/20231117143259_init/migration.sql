-- CreateTable
CREATE TABLE `sys_role` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenant_id` BIGINT NOT NULL DEFAULT 0,
    `role_name_cn` VARCHAR(30) NOT NULL,
    `role_name_en` VARCHAR(100) NOT NULL,
    `role_sort` INTEGER NOT NULL,
    `data_scope` CHAR(1) NOT NULL DEFAULT '1',
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `remark` VARCHAR(500) NULL,
    `create_by` VARCHAR(255) NULL,
    `update_by` VARCHAR(255) NULL,
    `create_time` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_time` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tenantId` BIGINT NOT NULL DEFAULT 0,
    `deptId` BIGINT NULL,
    `userName` VARCHAR(30) NOT NULL,
    `nickName` VARCHAR(30) NOT NULL,
    `email` VARCHAR(60) NOT NULL DEFAULT '',
    `phoneNumber` VARCHAR(11) NOT NULL DEFAULT '',
    `gender` CHAR(1) NOT NULL DEFAULT '0',
    `avatar` VARCHAR(255) NULL,
    `password` VARCHAR(100) NOT NULL DEFAULT '',
    `status` CHAR(1) NOT NULL DEFAULT '0',
    `remark` VARCHAR(500) NOT NULL DEFAULT 'null',
    `create_by` VARCHAR(255) NULL,
    `update_by` VARCHAR(255) NULL,
    `create_time` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_time` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
