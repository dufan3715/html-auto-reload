import { Compiler } from 'webpack';
import { getScriptChildren, version, HtmlAutoReloadOption } from './shard';

export class HtmlAutoReloadWebpackPlugin {
  private option: HtmlAutoReloadOption;

  constructor(option: HtmlAutoReloadOption = {}) {
    this.option = option;
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync('HtmlAutoReloadWebpackPlugin', (compilation, callback) => {
      const publicPath = (compiler.options.output?.publicPath ?? '/') as string;
      const scriptTag = getScriptChildren(publicPath, this.option);

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

export default HtmlAutoReloadWebpackPlugin;
