import { vi } from "vitest";

export default {
  uploadFile: vi.fn().mockImplementation(() =>
    Promise.resolve({
      public_id: Array(20)
        .fill(0)
        .map(() => Math.random().toString(36).charAt(2))
        .join(""),
      width: Math.floor(Math.random() * 1000) + 200,
      height: Math.floor(Math.random() * 1000) + 200,
      format: "jpg",
      bytes: Math.floor(Math.random() * 50000) + 10000,
      secure_url: "https://res.cloudinary.com/filename.jpg",
      resource_type: "image",
    })
  ),
  deleteFile: vi.fn().mockResolvedValue("ok"),
  deleteFiles: vi.fn().mockResolvedValue({ deleted: {}, partial: {} }),
};
