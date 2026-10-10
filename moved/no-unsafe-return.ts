declare function parseUntrustedPayload(text: string): any;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const parseDisplayName = (rawText: string): string =>
  parseUntrustedPayload(rawText).displayName;
