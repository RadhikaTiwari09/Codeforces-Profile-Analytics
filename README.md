# Codeforces Profile Analytics

A responsive web app to check codeforces user stats in a clean & organized layout. It is built for my personal use & for anyone who wants a quick summary of their codeforces performance.

## What it does

- Search any Codeforces handle
- View user details like:
  - Current, max & min rating
  - Rank, number of contests & problem count
  - Rating history graph
- See recent submissions with problem details
- Get problems by difficulty and tags
- View most solved problems by the user
- thinking about adding more features...

## Tech stack

- HTML
- CSS
- js
- node.js & express (using it in development but planning to host using frontend only)

Data is fetched from the public [Codeforces API](https://codeforces.com/apiHelp). No login or auth is required.

## How to run

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/codeforces-profile-analytics.git
   cd codeforces-profile-analytics
   ```

2. Open `index.html` in your browser.

> I will insert a live link here too, once I host it on render/vercel.

## Folder structure

```
codeforces-profile-analytics/
├── public/
│   └── index.html
│   └── style.css
│   └── script.js
├── assets/
│   └── images
├── server.js
├── package.json
```

## Why this exists

The default Codeforces UI is not great for quick overviews or progress tracking. I made this project to solve that. It is also an ongoing personal project to keep learning and adding new things as needed.

Feel free to fork, contribute, or build on top of it.

Made with ❤️ for codeforces users and competitive programmers.
