const _ = require("lodash");

module.exports = (api, opts) => {
  api.modifyDefaultConfig(memo => {
    return {
      ...memo,
      urlLoaderExcludes: [/\.svg$/],
      chainWebpack(config) {
        config.module
          .rule("js")
          .use("babel-loader")
          .tap(opts => {
            _.remove(opts.plugins, plugin => /babel-plugin-named-asset-import/.test(plugin[0]));
            return opts;
          });

        config.module
          .rule("custom-svgr")
          .test(/\.svg$/)
          .use("babel")
          .loader(require.resolve("babel-loader"))
          .end()
          .use("svgr")
          .loader(require.resolve("@svgr/webpack"))
          .options({ ref: true, babel: true })
          .end()
          .use("url-loader")
          .loader(require.resolve("url-loader"))
          .end();
      }
    };
  });
};
