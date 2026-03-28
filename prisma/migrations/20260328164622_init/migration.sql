-- CreateTable
CREATE TABLE "Salary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sirket" TEXT NOT NULL,
    "pozisyon" TEXT NOT NULL,
    "sektor" TEXT NOT NULL,
    "sehir" TEXT NOT NULL,
    "deneyimYil" INTEGER NOT NULL,
    "maasAylik" INTEGER NOT NULL,
    "bonusYillik" INTEGER,
    "calismaSekli" TEXT NOT NULL,
    "egitimSeviyesi" TEXT NOT NULL,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
