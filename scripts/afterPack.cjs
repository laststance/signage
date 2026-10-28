const fs = require('node:fs')
const path = require('node:path')

/**
 * Removes grammatically-gendered Chromium locale bundles (e.g. ar_NEUTER.lproj)
 * introduced in Electron 45 before code signing runs.
 *
 * Why it exists: every *.lproj directory costs one Apple timestamp-server
 * request during codesign. Electron 45 raised the count from ~55 to ~220,
 * which trips the flaky timestamp service with
 * "A timestamp was expected but was not found" and fails the build.
 * Deleting the gendered variants is safe: Chromium falls back to the base
 * locale (e.g. cs.lproj) when the gendered bundle is absent.
 *
 * @param context - electron-builder AfterPackContext.
 * @returns Resolves when unneeded locale directories are deleted.
 */
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') {
    return
  }

  const resourcesDir = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`,
    'Contents/Frameworks/Electron Framework.framework/Versions/A/Resources',
  )

  const genderedLocales = fs
    .readdirSync(resourcesDir)
    .filter((entry) => /_(NEUTER|MASCULINE|FEMININE)\.lproj$/.test(entry))

  for (const locale of genderedLocales) {
    fs.rmSync(path.join(resourcesDir, locale), { recursive: true, force: true })
  }

  console.log(
    `afterPack: removed ${genderedLocales.length} gendered locale bundles`,
  )
}
