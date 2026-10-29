export type SaleType = "auction" | "buynow" | "both";

export interface BidEntry {
  user: string;
  amount: number;
  ts: number;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
}

export interface Seller {
  id: string;
  name: string;
  location: string;
  initials: string;
  rating: number;
  sales: number;
  verified: boolean;
}

export interface ItemImage {
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface Item {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  era: string;
  origin: string;
  description: string;
  saleType: SaleType;
  startingBid: number;
  currentBid: number;
  buyNowPrice?: number;
  bidsCount: number;
  endsAt: string;
  sellerId: string;
  watchers: number;
  plate: { from: string; to: string };
  images?: ItemImage[];
  historicalBackground?: string;
  conditionReport?: string;
  material?: string;
  dims?: string;
  weight?: string;
  maker?: string;
  provenance?: string;
  certificate?: string;
  authenticity?: string;
  shippingFrom?: string;
  shippingTo?: string;
  shippingCost?: string;
  returnPolicy?: string;
  bidHistory?: BidEntry[];
}