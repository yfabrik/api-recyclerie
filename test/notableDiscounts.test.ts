import { describe, expect, it } from "vitest";

import {
  NOTABLE_DISCOUNTS,
  WHOLE_TRANSACTION_DISCOUNT_GROUPS,
  wholeTransactionDiscountKey,
} from "../src/domain/notableDiscounts.js";

describe("notable discounts", () => {
  it("are the 40 % and the 5 € whole-transaction discounts", () => {
    expect(NOTABLE_DISCOUNTS).toEqual([
      { type: "percent", value: 40, label: "40 %" },
      { type: "fixed", value: 5, label: "5 €" },
    ]);
  });

  it("group every whole-transaction discount: the notable ones in order, then Autres", () => {
    expect(WHOLE_TRANSACTION_DISCOUNT_GROUPS).toEqual([
      { key: "percent-40", label: "40 %" },
      { key: "fixed-5", label: "5 €" },
      { key: "other", label: "Autres" },
    ]);
  });
});

describe("wholeTransactionDiscountKey (same matching as the till closing report)", () => {
  it("matches on type and value", () => {
    expect(wholeTransactionDiscountKey({ type: "percent", value: 40 })).toBe("percent-40");
    expect(wholeTransactionDiscountKey({ type: "fixed", value: 5 })).toBe("fixed-5");
  });

  it("puts the same value with the other type under Autres", () => {
    expect(wholeTransactionDiscountKey({ type: "fixed", value: 40 })).toBe("other");
    expect(wholeTransactionDiscountKey({ type: "percent", value: 5 })).toBe("other");
    expect(wholeTransactionDiscountKey({ type: "percent", value: 10 })).toBe("other");
  });

  it("reads MariaDB's DECIMAL strings as numbers", () => {
    expect(wholeTransactionDiscountKey({ type: "percent", value: "40.00" })).toBe("percent-40");
    expect(wholeTransactionDiscountKey({ type: "fixed", value: "5.00" })).toBe("fixed-5");
  });

  it("counts a missing type as a percent", () => {
    expect(wholeTransactionDiscountKey({ type: null, value: 40 })).toBe("percent-40");
  });

  it("finds no whole-transaction discount without a promotion or with a value of 0", () => {
    expect(wholeTransactionDiscountKey(null)).toBeNull();
    expect(wholeTransactionDiscountKey(undefined)).toBeNull();
    expect(wholeTransactionDiscountKey({ type: "percent", value: 0 })).toBeNull();
    expect(wholeTransactionDiscountKey({ type: "fixed", value: "0.00" })).toBeNull();
  });
});
