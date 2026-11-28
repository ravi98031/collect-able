# Collectable Store

A website made of separate files, so each part can be edited on its own.

## Folder map

| File | What it controls |
|---|---|
| `index.html` | The page skeleton (header, footer, which files load). Rarely edited. |
| `css/styles.css` | All colours, fonts, buttons, glass effect, layout. Main colours are at the top. |
| `js/config.js` | Drop name and date, shipping rules, WhatsApp, Instagram, email, categories, size lists. |
| `js/products.js` | Every product: name, price, category, sizes, colour. |
| `js/helpers.js` | Product artwork drawing and price format. |
| `js/hero.js` | Background photo for the top section. |
| `js/account.js` | Sign up and login (preview mode). |
| `js/cart.js` | Cart, order history, add to cart. |
| `js/components.js` | Countdown, product card, newsletter, Instagram section. |
| `js/views.js` | The text and layout of every page (home, about, FAQ, contact...). |
| `js/behaviour.js` | Buttons, forms, filters, checkout and the page router. |
| `js/app.js` | Start-up. Keep this file last. |
| `images/` | Put real product photos here. |

## Put it on GitHub (no command line)

1. Unzip this folder on your computer.
2. On github.com click **+**, then **New repository**. Name it, choose **Public**, click **Create repository**.
3. Click **uploading an existing file**.
4. Open the unzipped folder, select everything inside it (`index.html`, `css`, `js`, `images`, `README.md`) and drag it all into the GitHub page. Folders upload with their files.
5. Click **Commit changes**.
6. Go to **Settings**, then **Pages**. Under Branch choose **main** and **/ (root)**, then **Save**.
7. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Edit one file later

1. Open the repository on GitHub and click the file (for example `js/products.js`).
2. Click the pencil icon, make the change, click **Commit changes**.
3. Wait a minute, then refresh the site (press Ctrl + F5 to skip the old saved copy).

## Common edits

- Change a price or product name: `js/products.js`
- Change contact numbers or the drop date: `js/config.js`
- Change a colour: top of `css/styles.css`
- Change the About, FAQ or Contact text: `js/views.js`

## Rules to stay safe

- Do not rename files or folders.
- Do not change the order of the `<script>` lines in `index.html`.
- Edit one file at a time, and refresh to check it before the next change.
