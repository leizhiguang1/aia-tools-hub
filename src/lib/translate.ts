/**
 * Overlay translations onto an entity, falling back to the original (Chinese) values.
 */
export function applyTranslations<T>(
  entity: T,
  translations: Record<string, string> | undefined,
  fields: string[]
): T {
  if (!translations) return entity;
  const result = { ...entity } as Record<string, unknown>;
  for (const field of fields) {
    if (translations[field]) {
      result[field] = translations[field];
    }
  }
  return result as T;
}

/**
 * Apply bulk translations to an array of entities.
 */
export function applyBulkTranslations<T extends { id: string }>(
  entities: T[],
  translationsMap: Map<string, Record<string, string>>,
  fields: string[]
): T[] {
  return entities.map((entity) =>
    applyTranslations(entity, translationsMap.get(entity.id), fields)
  );
}
