import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const H = 3600 * 1000;
const D = 24 * H;
const now = Date.now();
const iso = (ms: number) => new Date(ms);

const CATEGORIES = [
  { slug: "furniture", name: "Furniture", count: 1284 },
  { slug: "jewelry", name: "Jewelry", count: 942 },
  { slug: "watches", name: "Watches", count: 617 },
  { slug: "paintings", name: "Paintings", count: 511 },
  { slug: "sculptures", name: "Sculptures", count: 348 },
  { slug: "coins", name: "Coins & Medals", count: 826 },
  { slug: "books", name: "Rare Books", count: 402 },
  { slug: "ceramics", name: "Ceramics", count: 739 },
  { slug: "glassware", name: "Glassware", count: 271 },
  { slug: "textiles", name: "Textiles & Rugs", count: 198 },
  { slug: "military", name: "Military", count: 156 },
  { slug: "instruments", name: "Instruments", count: 127 },
  { slug: "decorative", name: "Decorative Arts", count: 389 },
  { slug: "historical", name: "Historical Objects", count: 244 },
];

const SELLERS = [
  { id: "s1", name: "Maison Verrier",   email: "verrier@antiqua.com",  initials: "MV", location: "Paris, France",   rating: 4.9, sales: 412, bio: "Parisian estate specialists since 1974." },
  { id: "s2", name: "Holland & Sons",   email: "holland@antiqua.com",  initials: "HS", location: "London, UK",      rating: 4.8, sales: 267, bio: "Third-generation English furniture dealers." },
  { id: "s3", name: "Kato Antiquites",  email: "kato@antiqua.com",     initials: "KA", location: "Kyoto, Japan",    rating: 5.0, sales: 189, bio: "Kyoto-based specialists in Asian antiquities." },
  { id: "s4", name: "Casa Bellini",     email: "bellini@antiqua.com",  initials: "CB", location: "Florence, Italy", rating: 4.7, sales: 331, bio: "Florentine fine art and Renaissance works." },
];

const PLATES = [
  { from: "#231a13", to: "#43331f" },
  { from: "#1c2429", to: "#33474d" },
  { from: "#2c1d22", to: "#4a2f38" },
  { from: "#202719", to: "#3b4630" },
  { from: "#292219", to: "#453a2c" },
  { from: "#1b2130", to: "#334061" },
  { from: "#2a1f16", to: "#4d3a22" },
  { from: "#1f2724", to: "#33453c" },
];

interface SeedItem {
  id: string; slug: string; title: string; categorySlug: string;
  description: string; era: string; origin: string;
  saleType: string; startingBid: number; currentBid: number; buyNowPrice?: number;
  bidsCount: number; watchers: number; endsAt: Date; sellerId: string; plateIdx: number;
  historicalBackground: string; conditionReport: string; material: string;
  dims: string; weight: string; maker: string; provenance: string;
  certificate: string; authenticity: string;
  shippingFrom: string; shippingTo: string; shippingCost: string; returnPolicy: string;
  condition: string;
}

const ITEMS: SeedItem[] = [
  { id: "i1", slug: "louis-xv-ormolu-commode", title: "Louis XV Ormolu-Mounted Kingwood Commode", categorySlug: "furniture",
    description: "A superb transitional commode with serpentine front, veneered in kingwood and amaranth, mounted with finely chased gilt-bronze scrollwork. Retains original marble top.",
    era: "c. 1750", origin: "Paris, France", saleType: "auction", startingBid: 4200, currentBid: 6100, bidsCount: 8, watchers: 142,
    endsAt: iso(now + 3*H + 24*60*1000), sellerId: "s1", plateIdx: 0,
    historicalBackground: "Made during the transitional period between the rococo style of Louis XV and the emerging neoclassicism.",
    conditionReport: "Very good - minor veneer losses to the front-right stile, consistent with age.",
    material: "Kingwood, amaranth, ormolu, Carrara marble", dims: "88 x 120 x 58 cm", weight: "42 kg",
    maker: "Attributed to Jean-Francois Oeben", provenance: "Private collection, Geneva; by descent since 1962.",
    certificate: "Independently appraised in 2019 by Cabinet Samle, Paris.", authenticity: "Expert verified",
    shippingFrom: "Paris, France", shippingTo: "Worldwide (insured)", shippingCost: "From $380",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Very good" },
  { id: "i2", slug: "meissen-putti-group", title: "Meissen Porcelain Figure Group of Putti", categorySlug: "ceramics",
    description: "Polychrome figure group depicting four putti at play beneath a grape arbour. Crossed swords mark in underglaze blue, first quality.",
    era: "c. 1880", origin: "Meissen, Germany", saleType: "auction", startingBid: 900, currentBid: 1450, bidsCount: 6, watchers: 89,
    endsAt: iso(now + 47*60*1000), sellerId: "s4", plateIdx: 1,
    historicalBackground: "Meissen porcelain, founded in 1710, was the first European hard-paste porcelain manufactory.",
    conditionReport: "Excellent - museum quality. No chips, cracks or restoration.",
    material: "Hard-paste porcelain, enamels, gilt", dims: "24 x 19 x 16 cm", weight: "1.8 kg",
    maker: "Meissen Manufactory", provenance: "Bavarian aristocratic collection, acquired 1930s; by descent.",
    certificate: "Accompanied by a written condition report from the Meissen archive.", authenticity: "Documentation provided",
    shippingFrom: "Florence, Italy", shippingTo: "Worldwide (insured)", shippingCost: "From $120",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Excellent" },
  { id: "i3", slug: "george-iii-longcase-clock", title: "George III Mahogany Longcase Clock, Thomas Mudge", categorySlug: "watches",
    description: "Eight-day striking longcase clock by the celebrated maker Thomas Mudge. Break-arch hood with gilt-brass finials, silvered chapter ring, original brass movement.",
    era: "c. 1785", origin: "London, England", saleType: "auction", startingBid: 3800, currentBid: 4950, bidsCount: 5, watchers: 118,
    endsAt: iso(now + 9*H + 12*60*1000), sellerId: "s2", plateIdx: 2,
    historicalBackground: "Thomas Mudge (1715-1794) was one of the most important English horologists of the 18th century.",
    conditionReport: "Very good - serviced 2021 with a new suspension spring.",
    material: "Mahogany, brass, silvered metal", dims: "218 x 51 x 26 cm", weight: "68 kg",
    maker: "Thomas Mudge, London", provenance: "The Pemberton Family Collection, Somerset; by descent.",
    certificate: "Servicing record and photographs from 2021 restoration available.", authenticity: "Expert verified",
    shippingFrom: "London, UK", shippingTo: "Worldwide (specialist courier)", shippingCost: "From $640",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Very good" },
  { id: "i4", slug: "art-deco-cartier-brooch", title: "Art Deco Diamond & Platinum Brooch, Cartier", categorySlug: "jewelry",
    description: "A geometric brooch set with old European and baguette-cut diamonds totalling approximately 6.4 carats, mounted in platinum. Signed Cartier, Paris.",
    era: "c. 1925", origin: "Paris, France", saleType: "auction", startingBid: 12000, currentBid: 18500, bidsCount: 11, watchers: 231,
    endsAt: iso(now + 2*D + 5*H), sellerId: "s1", plateIdx: 3,
    historicalBackground: "The Art Deco period revolutionised jewellery with its bold geometry and preference for platinum.",
    conditionReport: "Excellent - museum quality. All stones present, secure and of matched colour.",
    material: "Platinum, diamonds (approx. 6.4 ct)", dims: "6.2 x 3.1 cm", weight: "24.8 g",
    maker: "Cartier, Paris", provenance: "Acquired from the estate of a Swiss industrialist, 1988.",
    certificate: "Accompanied by GIA diamond report and Cartier authenticity certificate.", authenticity: "Expert verified",
    shippingFrom: "Paris, France", shippingTo: "Worldwide (fully insured)", shippingCost: "From $220",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Excellent" },
  { id: "i5", slug: "ottoman-iznik-charger", title: "Ottoman Iznik Pottery Charger with Tulips", categorySlug: "ceramics",
    description: "A large Iznik dish painted in cobalt, turquoise and bole red with a radiating design of tulips and carnations on a white slip ground.",
    era: "c. 1580", origin: "Iznik, Turkey", saleType: "auction", startingBid: 5500, currentBid: 7400, bidsCount: 7, watchers: 156,
    endsAt: iso(now + 5*H + 3*60*1000), sellerId: "s3", plateIdx: 4,
    historicalBackground: "Iznik ceramics reached their artistic peak in the late 16th century.",
    conditionReport: "Good - old rim restoration. Body with typical firing imperfections.",
    material: "Fritware, underglaze pigment", dims: "34 cm diameter", weight: "1.2 kg",
    maker: "Iznik workshop", provenance: "Sothebys London, 1979, lot 214.",
    certificate: "Auction cataloguing from 1979 retained.", authenticity: "Provenance available",
    shippingFrom: "Kyoto, Japan", shippingTo: "Worldwide (insured)", shippingCost: "From $180",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Good" },
  { id: "i6", slug: "moby-dick-first-edition", title: "Moby-Dick; or, The Whale - First Edition", categorySlug: "books",
    description: "First edition, first issue, in the original publishers cloth with the famous whale binding. Complete with the tipped-in copyright notice.",
    era: "1851", origin: "New York, USA", saleType: "auction", startingBid: 15000, currentBid: 22750, bidsCount: 9, watchers: 312,
    endsAt: iso(now + 4*D), sellerId: "s2", plateIdx: 5,
    historicalBackground: "Published in November 1851 by Harper & Brothers. The first issue is distinguished by the tipped-in copyright notice.",
    conditionReport: "Good - rebacked with new cloth spine, foxing throughout as common.",
    material: "Publishers cloth, letterpress", dims: "20 x 13 cm", weight: "0.9 kg",
    maker: "Harper & Brothers, New York", provenance: "Dr. H. Whitcombe library; Christies 2004, lot 88.",
    certificate: "Christies lot slip and prior auction cataloguing included.", authenticity: "Documentation provided",
    shippingFrom: "London, UK", shippingTo: "Worldwide (insured)", shippingCost: "From $90",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Good" },
  { id: "i7", slug: "roman-hadrian-sestertius", title: "Roman Imperial Bronze Sestertius of Hadrian", categorySlug: "coins",
    description: "A large orichalcum sestertius struck at Rome, reverse depicting Roma seated. Attractive green patina with excellent portrait detail.",
    era: "c. 125 AD", origin: "Rome, Italy", saleType: "buynow", startingBid: 1850, currentBid: 1850, buyNowPrice: 1850, bidsCount: 0, watchers: 67,
    endsAt: iso(now + 30*D), sellerId: "s4", plateIdx: 6,
    historicalBackground: "Hadrian (r. 117-138 AD) is remembered for consolidating the empire and commissioning Hadrians Wall.",
    conditionReport: "Very good - untouched patina. Minor surface porosity, portrait crisp.",
    material: "Orichalcum (bronze)", dims: "33 mm, 26.4 g", weight: "26.4 g",
    maker: "Rome mint", provenance: "European private collection, formed 1960s.",
    certificate: "Coin accompanied by an independent attribution certificate.", authenticity: "Expert verified",
    shippingFrom: "Florence, Italy", shippingTo: "Worldwide (insured)", shippingCost: "From $60",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Very good" },
  { id: "i8", slug: "ming-meiping-vase", title: "Ming Dynasty Blue & White Meiping Vase", categorySlug: "ceramics",
    description: "A finely potted meiping decorated in underglaze cobalt with the Three Friends of Winter. Six-character Xuande mark to base, later period.",
    era: "c. 1420", origin: "Jingdezhen, China", saleType: "auction", startingBid: 8000, currentBid: 11200, bidsCount: 12, watchers: 198,
    endsAt: iso(now + 26*60*1000), sellerId: "s3", plateIdx: 7,
    historicalBackground: "The meiping form was originally designed for holding plum branches.",
    conditionReport: "Excellent - hairline to rim, otherwise pristine.",
    material: "Porcelain, underglaze blue", dims: "31 cm high", weight: "1.6 kg",
    maker: "Jingdezhen kilns", provenance: "Japanese private collection since 1955.",
    certificate: "Accompanied by thermoluminescence test report.", authenticity: "Expert verified",
    shippingFrom: "Kyoto, Japan", shippingTo: "Worldwide (insured)", shippingCost: "From $240",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Excellent" },
  { id: "i9", slug: "venetian-giltwood-mirror", title: "Venetian Baroque Giltwood Mirror", categorySlug: "decorative",
    description: "A magnificent carved giltwood mirror with foliate cresting and scrolled sides, the plate later but of good quality.",
    era: "c. 1720", origin: "Venice, Italy", saleType: "auction", startingBid: 3200, currentBid: 3900, bidsCount: 4, watchers: 76,
    endsAt: iso(now + D + 8*H), sellerId: "s4", plateIdx: 0,
    historicalBackground: "Venetian mirror-making was a jealously guarded secret for centuries.",
    conditionReport: "Good - gilding refreshed in the 19th century.",
    material: "Carved giltwood, mercury glass", dims: "142 x 86 cm", weight: "18 kg",
    maker: "Venetian workshop", provenance: "Palazzo Contarini, Venice; private sale 1976.",
    certificate: "Photographs of the palazzo interior accompany the piece.", authenticity: "Provenance available",
    shippingFrom: "Florence, Italy", shippingTo: "Worldwide (specialist courier)", shippingCost: "From $480",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Good" },
  { id: "i10", slug: "persian-kashan-silk-rug", title: "Persian Kashan Silk Rug", categorySlug: "textiles",
    description: "A fine Kashan rug with a central medallion on an ivory field, woven in silk with approximately 700 knots per square inch.",
    era: "c. 1890", origin: "Kashan, Persia", saleType: "auction", startingBid: 4600, currentBid: 5800, bidsCount: 6, watchers: 104,
    endsAt: iso(now + 6*H + 40*60*1000), sellerId: "s3", plateIdx: 1,
    historicalBackground: "Kashan rugs from the late 19th century are celebrated for their refined draughtsmanship.",
    conditionReport: "Excellent - full pile, no losses. Fringes original and complete.",
    material: "Silk warp, weft and pile", dims: "210 x 140 cm", weight: "6.4 kg",
    maker: "Kashan workshop", provenance: "Purchased Tehran, 1972; by descent.",
    certificate: "Carpet appraisal from 2010 available.", authenticity: "Expert verified",
    shippingFrom: "Kyoto, Japan", shippingTo: "Worldwide (insured)", shippingCost: "From $320",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Excellent" },
  { id: "i11", slug: "tibetan-amitayus-bronze", title: "Tibetan Gilt-Bronze Figure of Amitayus", categorySlug: "sculptures",
    description: "The Buddha of Infinite Life seated in dhyanasana upon a double-lotus base, hands held in dhyana mudra, wearing elaborate jewelled ornaments.",
    era: "15th century", origin: "Tibet", saleType: "auction", startingBid: 14000, currentBid: 17800, bidsCount: 8, watchers: 187,
    endsAt: iso(now + 11*H), sellerId: "s3", plateIdx: 2,
    historicalBackground: "Tibetan gilt-bronzes of the 15th century are among the most refined in the Buddhist world.",
    conditionReport: "Very good - original gilding largely intact with expected wear.",
    material: "Gilt-bronze, pigment, turquoise inlay", dims: "28 cm high", weight: "3.1 kg",
    maker: "Tibetan workshop", provenance: "Private European collection, acquired 1981.",
    certificate: "Written expert opinion from a Tibetan art specialist.", authenticity: "Expert verified",
    shippingFrom: "Kyoto, Japan", shippingTo: "Worldwide (insured)", shippingCost: "From $260",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Very good" },
  { id: "i12", slug: "victorian-silver-tea-service", title: "Victorian Silver Four-Piece Tea Service, Elkington", categorySlug: "decorative",
    description: "A substantial tea and coffee service comprising teapot, coffee pot, sugar bowl and cream jug. Fully hallmarked.",
    era: "1867", origin: "Birmingham, England", saleType: "buynow", startingBid: 2650, currentBid: 2650, buyNowPrice: 2650, bidsCount: 1, watchers: 45,
    endsAt: iso(now + 3*D), sellerId: "s2", plateIdx: 3,
    historicalBackground: "Elkington & Co. were among the most important silversmiths of Victorian England.",
    conditionReport: "Very good - minor dents to the coffee pot, otherwise crisp.",
    material: "Sterling silver (approx. 2,480 g total)", dims: "Various, tallest 24 cm", weight: "2,480 g",
    maker: "Elkington & Co., Birmingham", provenance: "English country house sale, 1999.",
    certificate: "Assay office hallmarks confirm date and fineness.", authenticity: "Documentation provided",
    shippingFrom: "London, UK", shippingTo: "Worldwide (insured)", shippingCost: "From $180",
    returnPolicy: "14-day returns on misdescription - buyer protection.", condition: "Very good" },
];

async function main() {
  console.log("Seeding...");

  // Clear products and bids but keep users (so user accounts survive)
  await prisma.bid.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();

  // Categories
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, count: c.count },
      create: { slug: c.slug, name: c.name, count: c.count },
    });
  }
  console.log("  - categories upserted:", CATEGORIES.length);

  // Sellers
  const passwordHash = await bcrypt.hash("demo1234", 10);
  for (const s of SELLERS) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, role: "seller" },
      create: { id: s.id, name: s.name, email: s.email, passwordHash, role: "seller" },
    });
    await prisma.sellerProfile.upsert({
      where: { userId: s.id },
      update: { bio: s.bio, location: s.location, rating: s.rating, sales: s.sales, verified: true, initials: s.initials },
      create: { userId: s.id, bio: s.bio, location: s.location, rating: s.rating, sales: s.sales, verified: true, initials: s.initials },
    });
  }
  console.log("  - sellers upserted:", SELLERS.length);

  // Products
  for (const it of ITEMS) {
    const cat = await prisma.category.findUnique({ where: { slug: it.categorySlug } });
    if (!cat) { console.warn("  ! missing category", it.categorySlug); continue; }
    const plate = PLATES[it.plateIdx % PLATES.length];

    await prisma.product.upsert({
      where: { slug: it.slug },
      update: {
        title: it.title, description: it.description,
        saleType: it.saleType, startingBid: it.startingBid, currentBid: it.currentBid,
        buyNowPrice: it.buyNowPrice ?? null, bidsCount: it.bidsCount, watchers: it.watchers,
        endsAt: it.endsAt, plateFrom: plate.from, plateTo: plate.to,
        categoryId: cat.id, sellerId: it.sellerId,
      },
      create: {
        id: it.id, slug: it.slug, title: it.title, description: it.description,
        categoryId: cat.id, sellerId: it.sellerId,
        saleType: it.saleType, startingBid: it.startingBid, currentBid: it.currentBid,
        buyNowPrice: it.buyNowPrice ?? null, bidsCount: it.bidsCount, watchers: it.watchers,
        era: it.era, origin: it.origin, material: it.material, dims: it.dims, weight: it.weight,
        maker: it.maker, provenance: it.provenance, certificate: it.certificate,
        authenticity: it.authenticity, historicalBackground: it.historicalBackground,
        conditionReport: it.conditionReport, condition: it.condition,
        shippingFrom: it.shippingFrom, shippingTo: it.shippingTo,
        shippingCost: it.shippingCost, returnPolicy: it.returnPolicy,
        plateFrom: plate.from, plateTo: plate.to, endsAt: it.endsAt,
      },
    });
  }
  console.log("  - products upserted:", ITEMS.length);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());