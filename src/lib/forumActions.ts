"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export async function forumPostEkle(formData: FormData) {
  const baslik = formData.get("baslik") as string;
  const icerik = formData.get("icerik") as string;
  const sektor = formData.get("sektor") as string;

  if (!baslik?.trim() || !icerik?.trim() || !sektor) {
    throw new Error("Tüm alanları doldurun.");
  }

  await prisma.forumPost.create({ data: { baslik, icerik, sektor } });
  revalidatePath("/forum");
}

export async function forumYorumEkle(formData: FormData) {
  const icerik = formData.get("icerik") as string;
  const postId = parseInt(formData.get("postId") as string);

  if (!icerik?.trim() || !postId) throw new Error("Geçersiz yorum.");

  await prisma.forumYorum.create({ data: { icerik, postId } });
  revalidatePath("/forum");
}

export async function mulakatEkle(formData: FormData) {
  const sirket = formData.get("sirket") as string;
  const pozisyon = formData.get("pozisyon") as string;
  const zorluk = formData.get("zorluk") as string;
  const sonuc = formData.get("sonuc") as string;
  const surec = formData.get("surec") as string;
  const sorular = formData.get("sorular") as string;
  const olumlu = formData.get("olumlu") === "true";

  if (!sirket || !pozisyon || !zorluk || !sonuc || !surec) {
    throw new Error("Zorunlu alanları doldurun.");
  }

  await prisma.interview.create({
    data: { sirket, pozisyon, zorluk, sonuc, surec, sorular: sorular || null, olumlu },
  });
  revalidatePath("/mulakat");
}

export async function sirketYorumuEkle(formData: FormData) {
  const sirket = formData.get("sirket") as string;
  const pozisyon = formData.get("pozisyon") as string;
  const kultur = parseInt(formData.get("kultur") as string);
  const isYasamDengesi = parseInt(formData.get("isYasamDengesi") as string);
  const yonetim = parseInt(formData.get("yonetim") as string);
  const kariyer = parseInt(formData.get("kariyer") as string);
  const maasYanHaklar = parseInt(formData.get("maasYanHaklar") as string);
  const tavsiyeEder = formData.get("tavsiyeEder") === "true";
  const olumluYon = formData.get("olumluYon") as string;
  const olumsuzYon = formData.get("olumsuzYon") as string;

  if (!sirket || !pozisyon) throw new Error("Şirket ve pozisyon zorunludur.");

  await prisma.companyReview.create({
    data: {
      sirket, pozisyon, kultur, isYasamDengesi, yonetim, kariyer,
      maasYanHaklar, tavsiyeEder,
      olumluYon: olumluYon || null,
      olumsuzYon: olumsuzYon || null,
    },
  });
  revalidatePath("/sirketler");
}
