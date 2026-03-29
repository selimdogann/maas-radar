"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export async function maasEkle(formData: FormData) {
  const sirket = formData.get("sirket") as string;
  const pozisyon = formData.get("pozisyon") as string;
  const sektor = formData.get("sektor") as string;
  const sehir = formData.get("sehir") as string;
  const deneyimYil = parseInt(formData.get("deneyimYil") as string);
  const maasAylik = parseInt(formData.get("maasAylik") as string);
  const bonusYillik = formData.get("bonusYillik")
    ? parseInt(formData.get("bonusYillik") as string)
    : null;
  const calismaSekli = formData.get("calismaSekli") as string;
  const egitimSeviyesi = formData.get("egitimSeviyesi") as string;
  const cinsiyet = (formData.get("cinsiyet") as string) || null;

  if (!sirket || !pozisyon || !sektor || !sehir || !calismaSekli || !egitimSeviyesi) {
    throw new Error("Tüm zorunlu alanları doldurun.");
  }

  await prisma.salary.create({
    data: {
      sirket,
      pozisyon,
      sektor,
      sehir,
      deneyimYil,
      maasAylik,
      bonusYillik,
      calismaSekli,
      egitimSeviyesi,
      cinsiyet,
    },
  });

  revalidatePath("/");
  revalidatePath("/maaslar");
}

export async function getMaaslar(filters: {
  sektor?: string;
  sehir?: string;
  sirket?: string;
}) {
  return prisma.salary.findMany({
    where: {
      sektor: filters.sektor || undefined,
      sehir: filters.sehir || undefined,
      sirket: filters.sirket
        ? { contains: filters.sirket }
        : undefined,
    },
    orderBy: { olusturuldu: "desc" },
    take: 100,
  });
}

export async function getIstatistikler() {
  const toplam = await prisma.salary.count();
  const ortalama = await prisma.salary.aggregate({
    _avg: { maasAylik: true },
    _max: { maasAylik: true },
    _min: { maasAylik: true },
  });
  const sektorler = await prisma.salary.groupBy({
    by: ["sektor"],
    _count: { sektor: true },
    orderBy: { _count: { sektor: "desc" } },
    take: 5,
  });
  return { toplam, ortalama, sektorler };
}
