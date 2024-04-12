-- CreateTable
CREATE TABLE `crosscheck` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(200) NULL,
    `file_path` VARCHAR(100) NULL,
    `total_trans` INTEGER NULL DEFAULT 0,
    `admin_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `product_name` VARCHAR(100) NOT NULL,
    `product_type` ENUM('packagemobile', 'card', 'datacode', 'sim') NULL,
    `package_register_type` ENUM('otp', 'sms') NULL,
    `order_status` ENUM('success', 'pending', 'fail') NOT NULL,
    `provider` ENUM('mobifone', 'vinaphone', 'viettel') NOT NULL,
    `total_price` FLOAT NULL,
    `commission_agent` FLOAT NULL,
    `commission_sub_agent` FLOAT NULL,
    `agent_id` INTEGER NULL,
    `sub_agent_id` INTEGER NULL,
    `date` TIMESTAMP(0) NULL,
    `success_date` TIMESTAMP(0) NULL,
    `cross_check_id` INTEGER NULL,
    `cross_check_status` ENUM('0', '1') NULL DEFAULT '0',
    `cross_check_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_crosscheck`(`cross_check_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `fk_crosscheck` FOREIGN KEY (`cross_check_id`) REFERENCES `crosscheck`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
