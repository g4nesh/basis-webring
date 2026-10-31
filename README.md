# BASIS web ring

**Live site: [basis-webring.vercel.app](https://basis-webring.vercel.app/)**

A small, independent web ring for graduates of **any BASIS school**. One community, no campus divisions. Built with plain HTML, CSS, JavaScript, and Node's standard library. No runtime dependencies, database, accounts, or tracking.

## Join

Use **Join the ring** on the website to prepare your entry, or add a file directly:

1. Fork this repository.
2. Add `members/your-name.json`:

   ```json
   {
     "name": "Your Name",
     "year": 2026,
     "url": "https://your-website.com/"
   }
   ```

3. Open a pull request. Checks validate the entry; a maintainer reviews it.
4. After the PR is merged, Vercel automatically publishes the updated ring.
5. Choose your name under **Add the ring to your site** and copy the previous/next links to your site.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete browser-only walkthrough.

## Development

Requires Node.js 22 or newer. No dependencies to install.

```sh
npm run dev       # http://127.0.0.1:4173
npm run validate  # check every member record
npm test          # validation, filtering, and ring navigation tests
npm run build     # generate dist/
```

Restart `npm run dev` after source changes; the server builds on startup. `public/` contains the frontend, `members/` holds one JSON file per person, and `scripts/build.mjs` generates the static directory and member data. The member list works without JavaScript; interactive features require it.

## Ring behavior

The ring follows stable alphabetical filename order. Filtering the directory does not change the ring order. Member IDs come from filenames; keep filenames stable to preserve existing widgets.

`/?from=your-name&to=next` and `/?from=your-name&to=prev` navigate to neighboring members. `/?to=random` visits a random website. Navigation resolves only against reviewed member records; arbitrary redirect URLs are never accepted. Removed IDs produce a useful directory message.

## Deployment

Import this GitHub repository into Vercel. `vercel.json` configures `npm run build` and the `dist` output directory. The Vercel GitHub integration deploys `main` on every merge and creates previews for pull requests, subject to Vercel's contributor approval settings. No environment variables or paid services are required.

## Initial entries

Ganesh Talluri, Ishaan Ranjan, and Vignesh Nagarajan were requested by the project owner as the founding members, class of 2026. Their personal website URLs were verified on October 31, 2026. No campus data is stored. See [CONTRIBUTING.md](CONTRIBUTING.md) to update or remove a listing.

This is an independent alumni project, not affiliated with or endorsed by BASIS. Code is [MIT licensed](LICENSE); member names and linked sites remain their owners' content.
