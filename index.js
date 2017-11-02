/**
 * @param {Object} rule
 * @return {Array}
 */
const ruleChildren = rule =>
  rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || []

const findIndexAndRules = (rulesSource, ruleMatcher) => {
  let result
  const rules = Array.isArray(rulesSource)
    ? rulesSource
    : ruleChildren(rulesSource)
  rules.some(
    (rule, index) =>
      (result = ruleMatcher(rule)
        ? { index, rules }
        : findIndexAndRules(ruleChildren(rule), ruleMatcher))
  )
  return result
}

/**
* Given a rule, return if it uses a specific loader.
*/
const createLoaderMatcher = loader => rule =>
  rule.loader && rule.loader.indexOf(`/${loader}/`) !== -1

/**
* Get the existing file-loader config.
*/
const fileLoaderMatcher = createLoaderMatcher('file-loader')

/**
* Add one rule before another in the list of rules.
*/
const addBeforeRule = (rulesSource, ruleMatcher, value) => {
  const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher)
  rules.splice(index, 0, value)
}

function rewireNearley(config, env, nearleyLoaderOptions = {}) {
  const nearleyExtension = /\.ne$/

  const nearleyRules = {
    test: nearleyExtension,
    loader: 'nearley-loader',
    options: nearleyLoaderOptions
  }

  // Add the Nearley rule before the file-loader rule.
  addBeforeRule(config.module.rules, fileLoaderMatcher, nearleyRules)

  return config
}

module.exports = rewireNearley
