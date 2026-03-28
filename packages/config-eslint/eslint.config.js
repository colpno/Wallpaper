import { defineConfig, globalIgnores } from "eslint/config";

import { config } from "./base.js";

export default defineConfig([...config, globalIgnores(["package.json", "node_modules/"])]);
