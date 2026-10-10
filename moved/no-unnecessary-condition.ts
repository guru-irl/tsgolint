declare const names: string[];

export const firstLongName = names.filter(
  (name) => name.length > "a typical display name".length,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
)?.[0];
