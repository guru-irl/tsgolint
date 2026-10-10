# Line disable comments stop applying after upgrading oxlint-tsgolint to 7.x

The same sources, config and disable comments are linted with one oxlint build. Only the `oxlint-tsgolint` version changes.

## Run

```sh
npm install
npm run compare            # comments where 0.25.0 matches them
npm run compare -- moved   # comments where 7.0.2003 matches them
```

macOS or Linux. To try another oxlint build, for example one with oxc-project/oxc#27109, set `OXLINT_BIN=/path/to/oxlint`.

## Result with oxlint 1.87.0

`src/`, comments on the line before the line oxlint prints:

| File | 0.25.0 | 7.0.2001 | 7.0.2002 | 7.0.2003 |
| --- | --- | --- | --- | --- |
| `no-unnecessary-condition.ts` | ok | IGNORED | IGNORED | IGNORED |
| `no-unsafe-assignment.ts` | ok | ok | IGNORED | IGNORED |
| `no-unsafe-return.ts` | ok | ok | IGNORED | IGNORED |
| `no-unsafe-type-assertion.ts` | ok | ok | IGNORED | IGNORED |

`moved/`, comments moved to the lines 7.0.2003 matches: every cell flips, so 0.25.0 is IGNORED for all four and 7.0.2003 is ok. No placement works with both versions.

IGNORED means oxlint reports the finding and reports the comment above it as unused. With 7.0.2003, for example, oxlint prints `src/no-unsafe-type-assertion.ts:4:21`, and the comment on line 3 is reported as unused.

## Notes

- tsgolint changed the main span of these rules in #1092 (7.0.2000) and #1105, #1110 and #1111 (7.0.2002). The main span is now an operator or keyword (`?.`, `=`, `=>`, `as`) that can sit several lines below the start of the expression. The expression became a labeled range.
- Oxlint prints the position of the first labeled range but matches line directives only against the main span (oxc-project/oxc#27084).
- `// oxlint-disable-next-line typescript/<rule>` behaves the same as the eslint-style comments used here.
- 7.0.2000 is not listed because its darwin-arm64 binary is published without the executable bit (`EACCES`). With the bit set, it matches 7.0.2001.
- `eslint-reference/` lints `src/` with typescript-eslint 8.71.0: `cd eslint-reference && npm install && npm run lint`. It accepts the comments for no-unsafe-assignment, no-unsafe-return and no-unsafe-type-assertion. For no-unnecessary-condition it reports at the `?.` token (6:2), like tsgolint 7.x, so that comment is unused there too.
