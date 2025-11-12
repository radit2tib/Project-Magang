/*
  Warnings:

  - You are about to alter the column `password` on the `Mahasiswa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password_hash` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Mahasiswa" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "password_hash" SET DATA TYPE VARCHAR(255);
