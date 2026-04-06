import sanitize from "sanitize-html";

export function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}

export function sanitizeContent(html: string): string {
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      "img",
      "iframe",
      "video",
      "source",
    ]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "class"],
      iframe: [
        "src",
        "width",
        "height",
        "frameborder",
        "allowfullscreen",
        "allow",
      ],
      video: ["src", "controls", "width", "height"],
      source: ["src", "type"],
    },
  });
}
