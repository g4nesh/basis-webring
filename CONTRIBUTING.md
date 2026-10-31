# Join the BASIS web ring

Graduated from any BASIS school and have a personal website? You're welcome here. All graduation years and all fields of work are welcome. There is no campus field.

## The easy way (no coding tools needed)

1. On the website, click **Join the ring**.
2. Enter your name, graduation year, and HTTPS website URL.
3. Click **Continue on GitHub** and sign in to your GitHub account.
4. GitHub opens a prefilled file under `members/`. If prompted, fork the repository to propose your change.
5. Click **Propose changes** (or **Commit changes** to your fork), then **Create pull request**. Submit the PR to `g4nesh/basis-webring`, base branch `main`.
6. A maintainer reviews your entry and merges it. The site updates automatically after deployment completes.

You can also fork the repo and create `members/first-last.json` by hand:

```json
{
  "name": "Your Name",
  "year": 2026,
  "url": "https://your-website.com/"
}
```

Use your BASIS graduation year, not a college graduation year. Any four-digit graduation year is accepted; there is no class-year cutoff. Use a lowercase, hyphenated filename. If your name is already taken, add a distinguishing suffix to the filename. Please use only these three fields. The automated checks reject duplicate sites and invalid records.

## Add the ring to your website

After your entry is live, expand **Add the ring to your site**, choose your name, and copy the HTML. You can style it however you like. The arrows take visitors to the previous and next websites in the ring. The middle link brings them back to the directory.

## Updates and removals

Edit your existing JSON file to change your name or URL; keep its filename unchanged so your ring links keep working. To leave, delete your file in a pull request. You may also open a GitHub issue to request a correction or removal. No explanation is required for removal.

## Review guidelines

- Submit yourself, or someone who has asked you to add them.
- Use a personal site you control. No spam, impersonation, malicious sites, or affiliate redirects.
- Keep the directory to names, graduation years, and public websites. Do not add private contact details.
- Maintainers check the site and alumni eligibility before merging. Automated checks validate structure, not identity or ownership.
- An inaccessible website can be corrected in a follow-up PR; the build does not make outbound requests to member sites.

For code changes, run `npm test` and `npm run build`. Keep the project small and dependency-free unless a change truly needs more.
