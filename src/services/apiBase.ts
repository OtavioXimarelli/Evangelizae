export function getApiBaseUrl(missingError: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) throw new Error(missingError);
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Internal endpoints live outside the `/api/v1` prefix (see the import
 * endpoint in the OpenAPI contract), so derive them from the public base URL.
 */
export function getInternalApiBaseUrl(missingError: string): string {
  const base = getApiBaseUrl(missingError);
  return base.endsWith('/api/v1') ? `${base.slice(0, -'/api/v1'.length)}/internal/v1` : `${base}/internal/v1`;
}
