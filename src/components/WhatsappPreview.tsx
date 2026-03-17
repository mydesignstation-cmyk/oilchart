import { useState } from "react";
import { Check, Copy, Send } from "lucide-react";
import { buildMessageWithFooter } from "@/utils/messageBuilder";
import type { OilRates } from "@/utils/priceCalculator";
import type { Tier } from "@/data/products";

interface WhatsappPreviewProps {
  rates: OilRates;
  tier: Tier;
  chartNumber: string;
  rateDate: string;
}

export function WhatsappPreview({ rates, tier, chartNumber, rateDate }: WhatsappPreviewProps) {
  const [copied, setCopied] = useState(false);

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
            <button className="btn btn-ghost" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button className="btn btn-ghost" onClick={handleWhatsAppOffice}>
              <Send size={14} />
              Send to Office
            </button>
            <button className="btn btn-primary" onClick={handleWhatsApp}>
              <Send size={14} />
              Open in WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
