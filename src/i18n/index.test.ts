import { describe, expect, it } from "vitest";

import { getLocale, t } from "./index";

describe("翻訳関数 t", () => {
  it("ネストしたキーから文言を取得できる", () => {
    expect(t("hud.score")).toBe("Score");
    expect(t("app.title")).toBe("DOT CHASER");
  });

  it("既定のロケールは英語である", () => {
    expect(getLocale()).toBe("en");
  });
});
