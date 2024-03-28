import {fileURLToPath, URL} from "node:url";
import path from 'path'
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            imports: ["vue"],
            dts: "./src/auto-imports.d.ts",
            eslintrc: {
                enabled: true,
                filepath: resolve(__dirname, ".eslintrc-auto-import.json"),
            },
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
            symbolId: "icon-[dir]-[name]",
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
