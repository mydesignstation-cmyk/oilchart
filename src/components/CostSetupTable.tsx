import { Fragment } from "react";
import type { CostSetupRow } from "@/data/costSetup";

type OilType = "SF" | "SOYA" | "PALM";

const OIL_LABEL: Record<OilType, string> = {
  SF: "Sunflower Oil",
  SOYA: "Soya Oil",
  PALM: "Palm Oil",
};

interface RowMeta {
  brand: string;
  oilType: OilType;
  displayName: string;
}

function getRowMeta(row: CostSetupRow): RowMeta {
  const value = row.product_name.trim();

  // Primary WHITE APPLE SF sequence rows are intentionally stored without prefix.
  if (!value.includes(" SF ") && !value.includes(" SOYA ") && !value.includes(" PALM ")) {
    return { brand: "WHITE APPLE", oilType: "SF", displayName: value };
  }

  const parsed = value.match(/^(.*)\s(SF|SOYA|PALM)\s(.*)$/);
  if (parsed) {
    return {
      brand: parsed[1].trim(),
      oilType: parsed[2] as OilType,
      displayName: parsed[3].trim(),
    };
  }

  return { brand: "WHITE APPLE", oilType: "SF", displayName: value };
}

interface CostSetupTableProps {
  rows: CostSetupRow[];
  onRowsChange: (rows: CostSetupRow[]) => void;
  onSaveAll: (rows: CostSetupRow[]) => void;
  onSaveRow: (rowId: number) => void;
}

export function CostSetupTable({ rows, onRowsChange, onSaveAll, onSaveRow }: CostSetupTableProps) {
  function updateNumeric(rowId: number, field: "multiplier_b" | "extra_cost_c", value: string) {
    const parsed = Number(value);
    onRowsChange(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: Number.isFinite(parsed) ? parsed : 0,
            }
          : row,
      ),
    );
  }

  function updateActive(rowId: number, isActive: boolean) {
    onRowsChange(rows.map((row) => (row.id === rowId ? { ...row, is_active: isActive } : row)));
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <p className="card-title">Cost Setup</p>
          <p className="card-desc">Admin editor for multiplier B and extra cost C.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onSaveAll(rows)}>
          Save All
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="price-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Multiplier B</th>
              <th>Extra Cost C</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const meta = getRowMeta(row);
              const prev = index > 0 ? getRowMeta(rows[index - 1]) : null;
              const showGroupHeader = !prev || prev.brand !== meta.brand || prev.oilType !== meta.oilType;

              return (
                <Fragment key={row.id}>
                  {showGroupHeader && (
                    <tr className="group-row">
                      <td colSpan={5}>
                        <span
                          className={`brand-name ${meta.brand === "WHITE APPLE" ? "brand-white" : meta.brand === "BESTTASTE" ? "brand-besttaste" : ""}`}
                        >
                          {meta.brand}
                        </span>
                        {OIL_LABEL[meta.oilType]}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="product-name">{meta.displayName}</td>
                    <td>
                      <input
                        className="input table-input"
                        type="number"
                        step="0.01"
                        value={row.multiplier_b}
                        onChange={(e) => updateNumeric(row.id, "multiplier_b", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input table-input"
                        type="number"
                        step="0.01"
                        value={row.extra_cost_c}
                        onChange={(e) => updateNumeric(row.id, "extra_cost_c", e.target.value)}
                      />
                    </td>
                    <td>
                      <label className="inline-toggle">
                        <input
                          type="checkbox"
                          checked={row.is_active}
                          onChange={(e) => updateActive(row.id, e.target.checked)}
                        />
                        <span>{row.is_active ? "Yes" : "No"}</span>
                      </label>
                    </td>
                    <td>
                      <button className="btn btn-ghost" onClick={() => onSaveRow(row.id)}>
                        Save Row
                      </button>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
