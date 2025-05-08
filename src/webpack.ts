import { getScriptChildren, version } from './shard';
import { Compiler, HtmlAutoReloadOption } from './type';

class HtmlAutoReloadWebpackPlugin {
  private option: HtmlAutoReloadOption;

  constructor(option: HtmlAutoReloadOption = {}) {
    this.option = option;
  }

  apply(compiler: Compiler) {
    const pluginName = 'HtmlAutoReloadWebpackPlugin'
    
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      const publicPath = (compiler.options.output?.publicPath ?? '/') as string;
      const scriptCtx = getScriptChildren(publicPath, this.option);
      const scriptTag = `<script type="module">${scriptCtx}</script>`;

      Object.keys(compilation.assets).forEach((filename) => {
        if (filename.endsWith('.html')) {
          const source = compilation.assets[filename].source().toString();
          const modified = source.replace(
            /<\/body>/i,
            `${scriptTag}\n</body>`
          );
          compilation.assets[filename] = {
            source: () => modified,
            size: () => modified.length,
          } as any;
        }
      });

      compilation.assets['version.txt'] = {
        source: () => version,
        size: () => version.length,
      } as any;

      callback();
    });
  }
}

export { HtmlAutoReloadWebpackPlugin };
export default HtmlAutoReloadWebpackPlugin;
