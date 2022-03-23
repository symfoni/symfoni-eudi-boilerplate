export function warn(
  componentName: string,
  functionName: string,
  ...things: any[]
) {
  console.warn(`ERROR ${componentName}: ${functionName}:`, ...things);
}
