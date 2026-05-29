# Example Book Library

The reusable example-book source is:

`apps/landing-page/src/lib/example-book-library.ts`

Use `EXAMPLE_BOOK_LIBRARY` when a landing-page surface needs realistic book data
for mock shelves, store rows, reader profiles, beta examples, or marketing
screens. Each record is paired with a high-resolution cover in:

`apps/landing-page/public/covers/`

Records can include title, author, category, tags, summary, long summary,
chapters, price, ReadCredit price, reader quotes, section, badges, and cover
dimensions. The 1024x1536 generated-cover set added in May 2026 includes the
full metadata set.

When adding a new example book:

1. Save the cover image in `public/covers/` with a kebab-case filename.
2. Add one record to `EXAMPLE_BOOK_LIBRARY` with the same slug and cover filename.
3. Prefer realistic summaries, chapter titles, mood tags, and reader quotes over
   placeholder copy.
4. Import from `example-book-library.ts` rather than creating a separate mock
   table for new book examples.
