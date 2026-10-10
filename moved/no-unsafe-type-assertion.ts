declare const input: { id: number | string; name: string };

export const user = {
  id: input.id,
  name: input.name,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
} as { id: number; name: string };
