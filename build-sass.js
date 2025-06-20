import fs from 'fs';
import path from 'path';
import * as sass from 'sass';
import CleanCSS from 'clean-css';
import Postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function resolvePath(path_) {
    return path.join(__dirname, path_);
}
const inputScss = resolvePath('./src/index.scss');
const outputCss = resolvePath('./dist/dumogu-scrollbar.css');
/** 设置插件 */
const processor = Postcss([
    postcssPresetEnv({
        stage: 2,
        browsers: ['> 0%', 'Android 2.3', 'iOS 3.2', 'Safari 3.1', 'IE 10'], //支持大多数浏览器
    }),
]);
/** 压缩css */
function compressCss(content) {
    const output = new CleanCSS({}).minify(content);
    return output.styles;
}
/** 美化css */
async function beautifyCss(content) {
    return processor.process(content, { from: undefined }).then((result) => {
        return result.css || content;
    });
}
/** 编译sass */
function compileScss(content) {
    const result = sass.compileString(content, { style: 'compressed' });
    return result.css.toString();
}

let cssContent = fs.readFileSync(inputScss).toString('utf-8');
cssContent = compileScss(cssContent) || '';
cssContent = (await beautifyCss(cssContent)) || '';
cssContent = compressCss(cssContent);
fs.writeFileSync(outputCss, cssContent);

console.log(`SCSS 文件已编译并压缩到 ${outputCss}`);
