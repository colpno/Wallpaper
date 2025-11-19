import { config } from "@repo/eslint-config/react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([...config, globalIgnores(["dist"])]);
