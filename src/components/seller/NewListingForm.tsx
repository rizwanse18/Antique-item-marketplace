"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createListingAction, type ListingState } from "@/app/actions/seller";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

const initial: ListingState = {};
const inputCls = "w-full rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20";

function Field({ label, name, children, hint }: { label: string; name: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-2">{hint}</p>}
    </div>
  );
}

interface Preview { url: string; file: File }

export function NewListingForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(createListingAction, initial);
  const [saleType, setSaleType] = useState<"auction"|"buynow"|"both">("auction");
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [primary, setPrimary] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setFileError(null);
    const arr: Preview[] = [];
    const allowed = ["image/jpeg","image/jpg","image/png","image/webp"];
    for (const f of Array.from(files)) {
      if (!allowed.includes(f.type)) { setFileError(`"${f.name}" is not a JPEG/PNG/WebP.`); continue; }
      if (f.size > 10 * 1024 * 1024) { setFileError(`"${f.name}" exceeds 10 MB.`); continue; }
      arr.push({ url: URL.createObjectURL(f), file: f });
    }
    const next = [...previews, ...arr].slice(0, 10);
    setPreviews(next);
  };

  const removeAt = (i: number) => {
    setPreviews((p) => p.filter((_, idx) => idx !== i));
    if (primary >= i && primary > 0) setPrimary(primary - 1);
  };

  return (
    <form action={action} className="space-y-6">
      {state.error && <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-3 text-[13px] text-danger">{state.error}</div>}

      {/* PHOTOS */}
      <div className="rounded-md border border-line bg-paper p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl">Photos <span className="text-danger">*</span></h3>
            <p className="mt-1 text-xs text-muted">Upload 1–10 clear photos. The primary photo (gold star) shows in the catalogue.</p>
          </div>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", previews.length >= 1 ? "bg-success/15 text-success" : "bg-danger/10 text-danger")}>
            {previews.length} / 10
          </span>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-line-2 bg-cream/50 px-6 py-10 text-center transition-colors hover:border-gold hover:bg-gold/5"
        >
          <Upload className="h-8 w-8 text-muted-2" />
          <p className="mt-3 font-display text-lg">Drop photos here or click to browse</p>
          <p className="mt-1 text-xs text-muted-2">JPEG, PNG or WebP — max 10 MB each</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {fileError && <p className="mt-3 text-xs text-danger">{fileError}</p>}

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {previews.map((p, i) => (
              <div
                key={i}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-sm border-2 transition-all",
                  i === primary ? "border-gold ring-2 ring-gold/30" : "border-line hover:border-muted-2"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Upload ${i+1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPrimary(i)}
                  title="Set as primary"
                  className={cn(
                    "absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full",
                    i === primary ? "bg-gold text-ink" : "bg-black/60 text-white/70 opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Star className="h-3 w-3" fill={i === primary ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  title="Remove"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/90 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reordered file inputs — order matches previews, primary flag sent separately */}
        {previews.map((p, i) => (
          <input
            key={i}
            type="file"
            name="images"
            className="hidden"
            ref={(el) => {
              if (el) {
                const dt = new DataTransfer();
                dt.items.add(p.file);
                el.files = dt.files;
              }
            }}
          />
        ))}
        <input type="hidden" name="primaryImageIndex" value={primary} />
      </div>

      {/* ITEM DETAILS */}
      <div className="rounded-md border border-line bg-paper p-6">
        <h3 className="mb-5 font-display text-2xl">Item details</h3>
        <div className="space-y-4">
          <Field label="Title *" name="title"><input id="title" name="title" required placeholder="e.g. Louis XV Commode" className={inputCls} /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Category *" name="categorySlug">
              <select id="categorySlug" name="categorySlug" required className={inputCls}>
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Condition *" name="condition">
              <select id="condition" name="condition" required className={inputCls}>
                <option value="">Select condition</option>
                <option>Mint</option><option>Excellent</option><option>Very good</option>
                <option>Good</option><option>Fair</option><option>Poor</option><option>For restoration</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Period / date *" name="era"><input id="era" name="era" required placeholder="e.g. c. 1750" className={inputCls} /></Field>
            <Field label="Origin *" name="origin"><input id="origin" name="origin" required placeholder="e.g. Paris, France" className={inputCls} /></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Materials" name="material"><input id="material" name="material" placeholder="e.g. Kingwood, ormolu" className={inputCls} /></Field>
            <Field label="Dimensions" name="dims"><input id="dims" name="dims" placeholder="e.g. 88 x 120 x 58 cm" className={inputCls} /></Field>
          </div>
          <Field label="Maker / artist" name="maker"><input id="maker" name="maker" className={inputCls} /></Field>
          <Field label="Description *" name="description" hint="Minimum 20 characters.">
            <textarea id="description" name="description" required rows={5} className={inputCls + " resize-y"} />
          </Field>
          <Field label="Provenance" name="provenance"><input id="provenance" name="provenance" className={inputCls} /></Field>
        </div>
      </div>

      {/* SALE FORMAT */}
      <div className="rounded-md border border-line bg-paper p-6">
        <h3 className="mb-5 font-display text-2xl">Sale format</h3>
        <div className="space-y-4">
          <Field label="Format *" name="saleType">
            <div className="flex flex-wrap gap-2">
              {(["auction","buynow","both"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setSaleType(v)}
                  className={"rounded-full border px-4 py-2 text-xs font-semibold transition-colors " + (saleType===v ? "border-ink bg-ink text-white" : "border-line-2 bg-paper text-muted hover:border-ink hover:text-ink")}>
                  {v==="auction" ? "Live Auction" : v==="buynow" ? "Fixed Price" : "Auction + Buy It Now"}
                </button>
              ))}
            </div>
            <input type="hidden" name="saleType" value={saleType} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={saleType==="buynow" ? "Price (USD) *" : "Starting bid (USD) *"} name="startingBid">
              <input id="startingBid" name="startingBid" type="number" min={1} required placeholder="500" className={inputCls} />
            </Field>
            {saleType !== "auction" && (
              <Field label="Buy It Now price (USD)" name="buyNowPrice">
                <input id="buyNowPrice" name="buyNowPrice" type="number" min={1} placeholder="Optional" className={inputCls} />
              </Field>
            )}
          </div>
          {saleType !== "buynow" && (
            <Field label="Auction duration *" name="durationHours">
              <select id="durationHours" name="durationHours" required className={inputCls}>
                <option value="1">1 hour</option>
                <option value="6">6 hours</option>
                <option value="24">24 hours</option>
                <option value="72">3 days</option>
                <option value="168">7 days</option>
              </select>
            </Field>
          )}
        </div>
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending || previews.length === 0}>
        {pending ? "Publishing..." : previews.length === 0 ? "Upload at least 1 photo to publish" : "Publish Listing"}
      </Button>
    </form>
  );
}