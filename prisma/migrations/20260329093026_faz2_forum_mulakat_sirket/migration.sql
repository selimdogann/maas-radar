-- CreateTable
CREATE TABLE "ForumPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baslik" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "sektor" TEXT NOT NULL,
    "begeni" INTEGER NOT NULL DEFAULT 0,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ForumYorum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "icerik" TEXT NOT NULL,
    "begeni" INTEGER NOT NULL DEFAULT 0,
    "postId" INTEGER NOT NULL,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumYorum_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sirket" TEXT NOT NULL,
    "pozisyon" TEXT NOT NULL,
    "zorluk" TEXT NOT NULL,
    "sonuc" TEXT NOT NULL,
    "surec" TEXT NOT NULL,
    "sorular" TEXT,
    "olumlu" BOOLEAN NOT NULL DEFAULT true,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CompanyReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sirket" TEXT NOT NULL,
    "pozisyon" TEXT NOT NULL,
    "kultur" INTEGER NOT NULL,
    "isYasamDengesi" INTEGER NOT NULL,
    "yonetim" INTEGER NOT NULL,
    "kariyer" INTEGER NOT NULL,
    "maasYanHaklar" INTEGER NOT NULL,
    "tavsiyeEder" BOOLEAN NOT NULL,
    "olumluYon" TEXT,
    "olumsuzYon" TEXT,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
