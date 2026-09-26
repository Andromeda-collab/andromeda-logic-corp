import adminApi from "./adminApi.js";

export function checkImageExists(url) {
  return adminApi.get("/uploads/check", { params: { url } }).then((res) => res.data.exists);
}

export function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  return adminApi
    .post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data.url);
}

export function cropImage({ sourceUrl, x, y, width, height, targetWidth, targetHeight }) {
  return adminApi
    .post("/uploads/crop", {
      source_url: sourceUrl,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      target_width: targetWidth ? Math.round(targetWidth) : undefined,
      target_height: targetHeight ? Math.round(targetHeight) : undefined,
    })
    .then((res) => res.data.url);
}
