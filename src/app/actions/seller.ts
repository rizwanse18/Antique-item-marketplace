"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { saveUploadedImage } from "@/lib/upload";

export interface SellerState { error?: string }
export interface ListingState { error?: string }

export async function becomeSellerAction(_prev: SellerState, formData: FormData): Promise<SellerState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };
  const bio = String(formData.get("bio") || "").trim();
  const location = String(formData.get("location") || "").trim();
  if (bio.length < 20) return { error: "Please describe your business in at least 20 characters." };
  if (location.length < 2) return { error: "Please enter your location." };
  await prisma.user.update({ where: { id: user.id }, data: { role: "seller" } });
  const initials = user.name.trim().split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()??"").join("");
  await prisma.sellerProfile.upsert({
    where: { userId: user.id },
    update: { bio, location, initials, verified: true },
    create: { userId: user.id, bio, location, initials, verified: true },
  });
  revalidatePath("/dashboard");
  revalidatePath("/seller");
  redirect("/seller");
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-").slice(0,80);
}

export async function createListingAction(_prev: ListingState, formData: FormData): Promise<ListingState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };
  if (user.role !== "seller" && user.role !== "admin") return { error: "Only sellers can create listings." };

  const title = String(formData.get("title") || "").trim();
  const categorySlug = String(formData.get("categorySlug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const era = String(formData.get("era") || "").trim();
  const origin = String(formData.get("origin") || "").trim();
  const condition = String(formData.get("condition") || "").trim();
  const material = String(formData.get("material") || "").trim();
  const dims = String(formData.get("dims") || "").trim();
  const provenance = String(formData.get("provenance") || "").trim();
  const maker = String(formData.get("maker") || "").trim();
  const saleType = String(formData.get("saleType") || "auction") as "auction" | "buynow" | "both";
  const startingBid = Number(formData.get("startingBid") || 0);
  const buyNowRaw = Number(formData.get("buyNowPrice") || 0);
  const buyNowPrice = buyNowRaw > 0 ? buyNowRaw : null;
  const durationHours = Number(formData.get("durationHours") || 24);
  const primaryIndex = Number(formData.get("primaryImageIndex") || 0);

  const images = formData.getAll("images").filter((v): v is File => v instanceof File && v.size > 0);

  if (title.length < 5) return { error: "Title must be at least 5 characters." };
  if (!categorySlug) return { error: "Please select a category." };
  if (description.length < 20) return { error: "Description must be at least 20 characters." };
  if (!era) return { error: "Please enter the period or date." };
  if (!origin) return { error: "Please enter the origin." };
  if (!condition) return { error: "Please select a condition." };
  if (!startingBid || startingBid <= 0) return { error: "Please enter a valid starting price." };
  if (images.length === 0) return { error: "Please upload at least one photo of the item." };
  if (images.length > 10) return { error: "You can upload up to 10 photos." };

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return { error: "Invalid category." };

  const savedUrls: string[] = [];
  try {
    for (const file of images) {
      const url = await saveUploadedImage(file);
      savedUrls.push(url);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save image." };
  }

  let slug = slugify(title);
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug } })) slug = slugify(title) + "-" + suffix++;

  const PLATES = [
    {from:"#231a13",to:"#43331f"},{from:"#1c2429",to:"#33474d"},{from:"#2c1d22",to:"#4a2f38"},
    {from:"#202719",to:"#3b4630"},{from:"#292219",to:"#453a2c"},{from:"#1b2130",to:"#334061"},
    {from:"#2a1f16",to:"#4d3a22"},{from:"#1f2724",to:"#33453c"},
  ];
  const plate = PLATES[Math.floor(Math.random()*PLATES.length)];
  const endsAt = new Date(Date.now() + durationHours*3600*1000);

  await prisma.product.create({
    data: {
      slug, title, description, categoryId: category.id, sellerId: user.id,
      saleType, startingBid, currentBid: startingBid, buyNowPrice,
      era, origin, condition, material: material || null, dims: dims || null,
      maker: maker || null, provenance: provenance || null,
      plateFrom: plate.from, plateTo: plate.to, endsAt,
      images: {
        create: savedUrls.map((url, i) => ({
          url,
          isPrimary: i === primaryIndex,
          order: i,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/auctions");
  revalidatePath("/seller");
  revalidatePath("/seller/listings");
  redirect("/seller/listings");
}

export async function deleteListingAction(productId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!product || product.sellerId !== user.id) return { error: "Not authorized." };
  const { deleteUploadedImage } = await import("@/lib/upload");
  for (const img of product.images) await deleteUploadedImage(img.url);
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/seller/listings");
  revalidatePath("/discover");
  revalidatePath("/auctions");
  return { ok: true };
}