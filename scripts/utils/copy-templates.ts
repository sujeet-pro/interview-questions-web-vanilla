import fs from 'node:fs'
import path from 'node:path'
import { DIR_TEMPLATE, DIR_APPS } from './constants'
import { validateAppName } from './file-names.utils'

function copyRecursively(srcDir: string, destDir: string, excludedFiles: string[], baseDir: string) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const files = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const file of files) {
    const srcPath = path.join(srcDir, file.name)
    const destPath = path.join(destDir, file.name)
    
    // Get path relative to baseDir for exclusion check
    const relPath = path.relative(baseDir, srcPath)
    
    if (excludedFiles.includes(relPath)) {
      continue
    }

    if (file.isDirectory()) {
      copyRecursively(srcPath, destPath, excludedFiles, baseDir)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

export function copyTemplatesTo(appName: string, excludedFiles: string[]) {
  validateAppName(appName)
  copyRecursively(DIR_TEMPLATE, path.join(DIR_APPS, appName), excludedFiles, DIR_TEMPLATE)
}
