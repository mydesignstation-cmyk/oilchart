import { useMemo, useState } from "react";
import { Check, Copy, Download, Send } from "lucide-react";
import { toBlob, toJpeg, toPng } from "html-to-image";
import type { OilRates } from "@/utils/priceCalculator";
import type { Tier } from "@/data/products";
import { RateImageCard } from "@/components/RateImageCard";
import type { CostSetupRow } from "@/data/costSetup";
import { getHomepagePriceSections } from "@/utils/homepagePricing";

interface WhatsappPreviewProps {
  rates: OilRates;
  tier: Tier;
  costSetupRows: CostSetupRow[];
  autoRound: boolean;
  chartNumber: string;
  rateDate: string;
}

const FOOTER_NOTES: string[] = [
  "Note: (ST) = second tin.",
  "CD: Same day cheque Rs. 5/NOG and same day RTGS Rs. 10/NOG.",
  "Booking validity: 10 days (carrying charges of Rs. 2 NOG/day).",
  "Daily rates are valid till working hours till 6 PM.",
  "Unloading charges will be given Rs. 1/NOG only.",
  "Payment validity: 7 days, cheque compulsory.",
];

export function WhatsappPreview({ rates, tier, costSetupRows, autoRound, chartNumber, rateDate }: WhatsappPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"png" | "jpg" | null>(null);
  const [sharingImage, setSharingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const sections = useMemo(
    () => getHomepagePriceSections(rates, tier, costSetupRows, autoRound),
    [rates, tier, costSetupRows, autoRound],
  );

  const message = useMemo(() => {
    const lines: string[] = [];
    if (rateDate) lines.push(`Date: ${rateDate}`);
    if (chartNumber) lines.push(`Rate Chart: ${chartNumber}`);
    if (rateDate || chartNumber) lines.push("");

    sections.forEach((section, sectionIndex) => {
      if (sectionIndex > 0) lines.push("");
      lines.push(`*${section.title.toUpperCase()}*`);
      lines.push("");

      section.items.forEach((item) => {
        const rounded = Math.round(item.price * 100) / 100;
        const isWhole = Math.abs(rounded - Math.trunc(rounded)) < 0.005;
        const priceStr = isWhole
          ? rounded.toLocaleString("en-IN", { maximumFractionDigits: 0 })
          : rounded.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        lines.push(`${item.name} - ${priceStr}`);
      });
    });

    lines.push("");
    lines.push("> BHAGYODAY PROTEINS & OIL REFINERY PVT LTD VAIJAPUR");
    lines.push("> Cust. care: +91-7249717971");
    lines.push("");
    FOOTER_NOTES.forEach((note) => lines.push(`- ${note}`));

    return lines.join("\n");
  }, [sections, rateDate, chartNumber]);

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
    const imageSections = sections.map((section) => ({
      title: section.title.toUpperCase(),
      products: section.items.map((item) => {
        const rounded = Math.round(item.price * 100) / 100;
        const isWhole = Math.abs(rounded - Math.trunc(rounded)) < 0.005;
        const priceStr = isWhole
          ? rounded.toLocaleString("en-IN", { maximumFractionDigits: 0 })
          : rounded.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return { name: item.name, price: `₹${priceStr}` };
      }),
    }));

    return {
      title: "OIL RATE LIST",
      date: rateDate,
      chartNumber,
      contact: "+91-7249717971",
      sections: imageSections,
    };
  }, [sections, rateDate, chartNumber]);

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
        <div className="wa-toggle-row">
          <label className="toggle-wrap">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
            />
            <span>WhatsApp Preview {showPreview ? "ON" : "OFF"}</span>
          </label>
        </div>

        <div className="wa-bubble-wrap">
          {showPreview && (
            <>
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
            </>
          )}

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
              className="btn btn-primary wa-share-image-btn"
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
