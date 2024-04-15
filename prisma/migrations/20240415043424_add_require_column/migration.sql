/*
  Warnings:

  - Made the column `file_name` on table `crosscheck` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_path` on table `crosscheck` required. This step will fail if there are existing NULL values in that column.
  - Made the column `admin_id` on table `crosscheck` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `crosscheck` MODIFY `file_name` VARCHAR(200) NOT NULL,
    MODIFY `file_path` VARCHAR(100) NOT NULL,
    MODIFY `admin_id` INTEGER NOT NULL;
