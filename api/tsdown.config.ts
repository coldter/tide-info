import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "vercel.ts",
  noExternal(id, _importer) {
    if (id === "server/src/routers/main") {
      return true;
    }
    return false;
  },
});
