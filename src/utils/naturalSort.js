/**
 * Natural sort helper for file names
 * Sorts 1.jpg, 2.jpg, 10.jpg logically rather than lexicographically (1, 10, 2)
 */
export function naturalSortFiles(files) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return [...files].sort((a, b) => collator.compare(a.name, b.name));
}
