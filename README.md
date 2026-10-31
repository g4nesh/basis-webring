# BASIS webring

A directory of personal websites from BASIS graduates. **Any BASIS school, any graduation year.**

[Visit the webring](https://basis-webring.vercel.app/) · [Join](https://basis-webring.vercel.app/#join-form)

## Add your website

Click **Join the ring** on the site, enter your name, BASIS graduation year, and website, then click **Continue on GitHub**. This prepares your entry for a pull request. Once the PR is merged, your site appears in the directory.

You can also fork this repo and add `members/your-name.json`:

```json
{
  "name": "Your Name",
  "year": 2018,
  "url": "https://your-website.com/"
}
```

Replace the example values with your own. **2018 is just an example—any four-digit graduation year is accepted.** Use your BASIS graduation year, not your college graduation year. No campus information is needed.

Open a pull request against `main`. Automated checks validate your entry, and a maintainer reviews it before merging. See [CONTRIBUTING.md](CONTRIBUTING.md) for step-by-step instructions.

## Link back to the ring

On the website, expand **Add the ring to your site**, select your name, and copy the HTML. It includes a link to the directory and arrows to the previous and next member websites.

## Update or remove your entry

Edit your JSON file and open a PR. Keep the filename unchanged so existing ring links continue to work. To remove your listing, delete the file in a PR or [open an issue](https://github.com/g4nesh/basis-webring/issues).

## Run locally

Requires Node.js 22 or newer. No dependencies to install.

```sh
npm run dev       # http://127.0.0.1:4173
npm run validate  # validate member entries
npm test          # run tests
npm run build     # build the static site into dist/
```

Restart the dev server after making changes. Website files are in `public/`; member entries are in `members/`.

## Deployment

Vercel automatically deploys updates pushed or merged to `main`. The build command and output directory are configured in `vercel.json`. No environment variables are required.

[MIT license](LICENSE). Independent alumni project; not affiliated with BASIS.
