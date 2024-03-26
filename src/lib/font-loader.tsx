export class FontLoader {
  private firaCodeRegularFont?: Promise<ArrayBuffer>;
  private firaCodeBoldFont?: Promise<ArrayBuffer>;

  preload() {
    this.firaCodeRegularFont = fetch(
      new URL("/public/fonts/fira-code-latin-400-normal.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    this.firaCodeBoldFont = fetch(
      new URL("/public/fonts/fira-code-latin-700-normal.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return this;
  }

  async resolveFontData() {
    const [firaCodeRegularFontData, firaCodeBoldFontData] = await Promise.all([
      this.firaCodeRegularFont,
      this.firaCodeBoldFont,
    ]);

    return [
      {
        name: "Fira Code",
        data: firaCodeRegularFontData,
        weight: 400,
      },
      {
        name: "Fira Code",
        data: firaCodeBoldFontData,
        weight: 700,
      },
    ];
  }
}
