/*
  Warnings:

  - You are about to drop the column `aiCredits` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `maxAutomations` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "maxAutomations" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "aiCredits",
ADD COLUMN     "accountsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "automationsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "creditsUsed" INTEGER NOT NULL DEFAULT 0;
