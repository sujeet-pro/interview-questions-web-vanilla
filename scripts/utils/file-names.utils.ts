/**
 * Checks if a string follows kebab-case formatting (lowercase letters and hyphens)
 * @param str The string to validate
 * @returns boolean indicating if the string is valid kebab-case
 */
export function isKebabCase(str: string): boolean {
  const kebabCasePattern = /^[a-z]+(-[a-z]+)*$/
  return kebabCasePattern.test(str)
}

/**
 * Validates an application name
 * @param appName The application name to validate
 * @returns boolean indicating if the name is valid
 * @throws Error if validation fails
 */
export function validateAppName(appName: string): boolean {
  if (!appName?.trim()) {
    throw new Error('App name cannot be empty.')
  }
  if (!isKebabCase(appName)) {
    throw new Error('App name must be in kebab-case format (lowercase letters separated by hyphens).')
  }
  return true
}


/**
 * Converts a string to Title Case, handling multiple delimiters
 * @param str The string to convert
 * @returns The converted string in Title Case
 */
export function toTitleCase(str: string): string {
  if (!str) return ''
  
  return str
    .toLowerCase()
    .split(/[_\-\s]+/) // Split by one or more underscores, dashes, or spaces
    .filter(word => word.length > 0) // Remove empty strings
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}