import "server-only";
import { connection } from "next/server";
import { prisma } from "./prisma";
import { getCurrentUser } from "./current-user";
import { toItem } from "./products";
import type { Item } from "@/types";

export interface PublicSeller {
  id: string;
  name: string;
  initials: string;
  location: string;
  bio: string;
  rating: number;
  sales: number;
  verified: boolean;
  memberSince: string;
  activeListings: number;
  totalBids: number;
  followersCount: number;
  isFollowing: boolean;
  isSelf: boolean;
}

export async function getSellerById(id: string): Promise<PublicSeller | null> {
  await connection();
  const me = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      sellerProfile: true,
      products: { select: { id: true, bidsCount: true } },
      followers: { select: { userId: true } },
    },
  });
  if (!user || !user.sellerProfile) return null;

  const activeListings = await prisma.product.count({
    where: { sellerId: id, endsAt: { gt: new Date() } },
  });

  const totalBids = user.products.reduce((s, p) => s + p.bidsCount, 0);

  return {
    id: user.id,
    name: user.name,
    initials: user.sellerProfile.initials ?? user.name.slice(0, 2).toUpperCase(),
    location: user.sellerProfile.location ?? "",
    bio: user.sellerProfile.bio ?? "",
    rating: user.sellerProfile.rating,
    sales: user.sellerProfile.sales,
    verified: user.sellerProfile.verified,
    memberSince: user.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    activeListings,
    totalBids,
    followersCount: user.followers.length,
    isFollowing: me ? user.followers.some((f) => f.userId === me.id) : false,
    isSelf: me ? me.id === user.id : false,
  };
}

export async function getSellerLots(sellerId: string): Promise<Item[]> {
  await connection();
  const rows = await prisma.product.findMany({
    where: { sellerId },
    include: {
      category: true,
      seller: true,
      images: { orderBy: [{ isPrimary: "desc" }, { order: "asc" }] },
    },
    orderBy: [{ endsAt: "asc" }],
  });
  return rows.map(toItem);
}

export async function listAllSellers(): Promise<PublicSeller[]> {
  await connection();
  const me = await getCurrentUser();

  const users = await prisma.user.findMany({
    where: { sellerProfile: { isNot: null } },
    include: {
      sellerProfile: true,
      products: { select: { id: true, bidsCount: true } },
      followers: { select: { userId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return users.map((user) => {
    const activeListings = user.products.length;
    const totalBids = user.products.reduce((s, p) => s + p.bidsCount, 0);
    return {
      id: user.id,
      name: user.name,
      initials: user.sellerProfile?.initials ?? user.name.slice(0, 2).toUpperCase(),
      location: user.sellerProfile?.location ?? "",
      bio: user.sellerProfile?.bio ?? "",
      rating: user.sellerProfile?.rating ?? 0,
      sales: user.sellerProfile?.sales ?? 0,
      verified: user.sellerProfile?.verified ?? false,
      memberSince: user.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      activeListings,
      totalBids,
      followersCount: user.followers.length,
      isFollowing: me ? user.followers.some((f) => f.userId === me.id) : false,
      isSelf: me ? me.id === user.id : false,
    };
  });
}

export async function getMyFollowingCount(): Promise<number> {
  await connection();
  const me = await getCurrentUser();
  if (!me) return 0;
  return prisma.follow.count({ where: { userId: me.id } });
}