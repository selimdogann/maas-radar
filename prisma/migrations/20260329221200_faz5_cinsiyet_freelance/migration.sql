-- AlterTable
ALTER TABLE "Salary" ADD COLUMN "cinsiyet" TEXT;

-- CreateTable
CREATE TABLE "FreelanceRate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pozisyon" TEXT NOT NULL,
    "sektor" TEXT NOT NULL,
    "sehir" TEXT NOT NULL,
    "gunlukUcret" INTEGER,
    "saatlikUcret" INTEGER,
    "deneyimYil" INTEGER NOT NULL,
    "calismaSekli" TEXT NOT NULL,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
