import { useMemo, useState } from "react";
import { Check, Copy, Download, Send } from "lucide-react";
import { toBlob, toJpeg, toPng } from "html-to-image";
import { buildMessageWithFooter } from "@/utils/messageBuilder";
import { products } from "@/data/products";
import { calculatePrice } from "@/utils/priceCalculator";
import type { OilRates } from "@/utils/priceCalculator";
import type { Tier } from "@/data/products";
import { RateImageCard } from "@/components/RateImageCard";

interface WhatsappPreviewProps {
  rates: OilRates;
  tier: Tier;
  chartNumber: string;
  rateDate: string;
}

export function WhatsappPreview({ rates, tier, chartNumber, rateDate }: WhatsappPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"png" | "jpg" | null>(null);
  const [sharingImage, setSharingImage] = useState(false);

  const oilOrder = ["SF", "SOYA", "PALM"] as const;
  const oilLabels: Record<(typeof oilOrder)[number], string> = {
    SF: "SUNFLOWER OIL",
    SOYA: "SOYA OIL",
    PALM: "PALM OIL",
  };
  const brandOrder = ["WHITE APPLE", "BESTTASTE"];
  const preferredSequence: Record<string, Partial<Record<(typeof oilOrder)[number], string[]>>> = {
    "WHITE APPLE": {
      SF: [
        "15KG TIN NEW",
        "15LTR TIN NEW",
        "15LTR JAR",
        "13KG TIN NEW",
        "13KG JAR",
        "5LTR JAR(4)",
        "5LTR JAR(3) PET",
        "1LTR POUCH",
        "840GM POUCH",
      ],
      SOYA: [
        "15KG TIN NEW",
        "15LTR TIN NEW",
        "15LTR JAR",
        "13KG TIN NEW",
        "13KG JAR",
        "5LTR JAR",
        "4.200KG JAR",
        "2LTR JAR",
        "1KG POUCH",
        "0.5KG POUCH",
        "1LTR POUCH",
        "0.5LTR POUCH",
        "840GM POUCH",
      ],
    },
    BESTTASTE: {
      SOYA: [
        "14.800KG TIN (ST)",
        "13KG TIN (ST)",
        "12.800KG TIN (ST)",
        "12.800KG JAR",
        "900GM POUCH",
        "800GM POUCH",
      ],
      PALM: ["14.800KG TIN (ST)", "12.800KG TIN (ST)", "840GM POUCH"],
    },
  };

  const message = buildMessageWithFooter(rates, {
    tier,
    chartNumber,
    rateDate,
    companyName: "BHAGYODAY PROTEINS & OIL REFINERY PVT LTD VAIJAPUR",
    custCare: "+91-7249717971",
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  function handleWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleWhatsAppOffice() {
    const officeNumber = "917249717971";
    const url = `https://wa.me/${officeNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const rateData = useMemo(() => {
    const allBrands = Array.from(
      new Set(products.map((p) => p.brand).filter((b): b is string => Boolean(b)))
    );
    const orderedBrands = [
      ...brandOrder.filter((b) => allBrands.includes(b)),
      ...allBrands.filter((b) => !brandOrder.includes(b)),
    ];

    const sections = orderedBrands.flatMap((brand) => {
      const byBrand = products.filter((p) => p.brand === brand);

      return oilOrder.flatMap((oilType) => {
        let group = byBrand.filter((p) => p.oilType === oilType);
        if (!group.length) {
          return [];
        }

        const orderList = preferredSequence[brand]?.[oilType] ?? [];
        if (orderList.length) {
          group = group.slice().sort((a, b) => {
            const ia = orderList.indexOf(a.name);
            const ib = orderList.indexOf(b.name);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
          });
        }

        return [
          {
            title: `${brand} ${oilLabels[oilType]}`,
            products: group.map((item) => {
              const price = calculatePrice(item, rates, tier);
              const rounded = Math.round(price * 100) / 100;
              const isWhole = Math.abs(rounded - Math.trunc(rounded)) < 0.005;
              const priceStr = isWhole
                ? rounded.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                : rounded.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

              return { name: item.name, price: `₹${priceStr}` };
            }),
          },
        ];
      });
    });

    return {
      title: "OIL RATE LIST",
      date: rateDate,
      chartNumber,
      contact: "+91-7249717971",
      sections,
    };
  }, [brandOrder, chartNumber, oilLabels, oilOrder, preferredSequence, rateDate, rates, tier]);

  async function downloadImage(format: "png" | "jpg") {
    const node = document.getElementById("rate-card");
    if (!node) {
      return;
    }

    setDownloading(format);
    try {
      const dataUrl =
        format === "png"
          ? await toPng(node, { cacheBust: true, pixelRatio: 2 })
          : await toJpeg(node, { quality: 0.95, cacheBust: true, pixelRatio: 2 });

      const link = document.createElement("a");
      link.download = `rate-list-${rateDate || "today"}.${format === "png" ? "png" : "jpg"}`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(null);
    }
  }

  async function handleShareImageOnWhatsApp() {
    setSharingImage(true);
    try {
      const isMobile = /Android|iPhone/.test(navigator.userAgent);
      if (!isMobile) {
        alert("Image sharing works on mobile only");
        return;
      }

      const node = document.getElementById("rate-card");
      if (!node) {
        throw new Error("Rate card element not found.");
      }

      const blob = await toBlob(node);
      if (!blob) {
        throw new Error("Could not generate image blob.");
      }

      const file = new File([blob], "rate-list.png", {
        type: "image/png",
      });

      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };

      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Rate List",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "rate-list.png";
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharingImage(false);
    }
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <p className="card-title">WhatsApp Preview</p>
          <p className="card-desc">Rate broadcast message — copy or open in WhatsApp.</p>
        </div>
      </div>

      <div className="card-body">
        <div className="wa-bubble-wrap">
          {/* Fake WA top bar */}
          <div className="wa-header">
            <div className="wa-header-dot">🫙</div>
            <div>
              <p className="wa-header-name">Rate Broadcast</p>
              <p className="wa-header-sub">Oil Rates Group</p>
            </div>
          </div>

          {/* Chat body */}
          <div className="wa-body">
            <div className="wa-message">
              {message}
              <p className="wa-timestamp">{timeStr} ✓✓</p>
            </div>
          </div>

          {/* Action bar */}
          <div className="wa-actions">
            <button
              className="btn btn-ghost"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy Text"}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button className="btn btn-ghost" onClick={handleWhatsAppOffice}>
              <Send size={14} />
              Send to Office
            </button>
            <button className="btn btn-primary" onClick={handleWhatsApp}>
              <Send size={14} />
              Open in WhatsApp
            </button>
            <button
              className="btn btn-primary"
              onClick={handleShareImageOnWhatsApp}
              disabled={sharingImage || downloading !== null}
            >
              <Send size={14} />
              {sharingImage ? "Sharing..." : "Share Image on WhatsApp"}
            </button>
          </div>
        </div>

        <div className="rate-image-panel">
          <div className="rate-image-top">
            <div>
              <p className="card-title">Rate Image Export</p>
              <p className="card-desc">Download styled rate card as PNG or JPG.</p>
            </div>
            <div className="rate-image-actions">
              <button
                className="btn btn-ghost"
                onClick={() => downloadImage("png")}
                disabled={downloading !== null}
              >
                <Download size={14} />
                {downloading === "png" ? "Generating..." : "Download PNG"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => downloadImage("jpg")}
                disabled={downloading !== null}
              >
                <Download size={14} />
                {downloading === "jpg" ? "Generating..." : "Download JPG"}
              </button>
            </div>
          </div>
          <RateImageCard data={rateData} />
        </div>
      </div>
    </div>
  );
}
