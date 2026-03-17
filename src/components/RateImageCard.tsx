interface RateImageRow {
  name: string;
  price: string;
}

interface RateImageSection {
  title: string;
  products: RateImageRow[];
}

interface RateImageCardData {
  title: string;
  date: string;
  chartNumber?: string;
  contact: string;
  sections: RateImageSection[];
}

interface RateImageCardProps {
  data: RateImageCardData;
}

export function RateImageCard({ data }: RateImageCardProps) {
  return (
    <div
      id="rate-card"
      style={{
        width: 460,
        maxWidth: "100%",
        padding: 20,
        borderRadius: 18,
        background: "linear-gradient(180deg, #fffdf0 0%, #fff7cc 100%)",
        color: "#3f2f00",
        fontFamily: "Segoe UI, Arial, sans-serif",
        border: "1px solid #f4de8a",
        boxShadow: "0 14px 30px rgba(80, 62, 10, 0.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(140deg, #f7cf45, #f2a900)",
            display: "grid",
            placeItems: "center",
            color: "#4a3600",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          LOGO
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, letterSpacing: 0.5 }}>{data.title}</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#7a620e" }}>
            Date: {data.date} {data.chartNumber ? `| Chart: ${data.chartNumber}` : ""}
          </p>
        </div>
      </div>

      {data.sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 12 }}>
          <div
            style={{
              background: "#ffd700",
              color: "#4a3600",
              padding: "7px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            {section.title}
          </div>

          {section.products.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "6px 10px",
                marginBottom: 4,
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: 7,
              }}
            >
              <span style={{ fontSize: 13 }}>{item.name}</span>
              <strong style={{ fontSize: 14 }}>{item.price}</strong>
            </div>
          ))}
        </div>
      ))}

      <p style={{ textAlign: "center", margin: "14px 0 0", fontSize: 12, color: "#7a620e" }}>
        Contact: {data.contact}
      </p>
    </div>
  );
}

export type { RateImageCardData };