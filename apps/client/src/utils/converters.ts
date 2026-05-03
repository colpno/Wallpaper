export const extractFirstLetter = (text: string) => text.split(" ").map((t) => t[0]!);

export const mimeToExtension = (mime: string) => {
  switch (mime) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    default:
      throw new Error("Invalid MIME type");
  }
};
