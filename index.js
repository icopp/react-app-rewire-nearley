const path = require('path')
const { getLoader } = require('react-app-rewired')

function rewireNearley(config, env, nearleyLoaderOptions = {}) {
  const nearleyExtension = /\.ne$/

  const fileLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.endsWith(`file-loader${path.sep}index.js`)
  )
  fileLoader.exclude.push(nearleyExtension)

  const nearleyRules = {
    test: nearleyExtension,
    loader: 'nearley-loader',
    options: nearleyLoaderOptions
  }

  config.module.rules.push(nearleyRules)

  return config
}

module.exports = rewireNearley
