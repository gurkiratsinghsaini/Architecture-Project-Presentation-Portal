# ArchPortal --- Architecture Project Presentation Portal

ArchPortal is a student-focused web application for organizing
architecture projects, presenting design proposals, and tracking review
feedback.

## Features

-   **Project dashboard:** View all projects and see summary counts for
    projects, proposals, and approved designs.
-   **Create projects:** Add a project name, description, and
    student/architect name.
-   **Design proposals:** Add proposals to a project, with optional
    design-image URLs and design notes.
-   **Approval status:** Mark proposals as Pending, Approved, Needs
    Changes, or Rejected.
-   **Version history:** Create new proposal versions and record the
    changes made.
-   **Review comments:** Add and view comments on design proposals.
-   **Local data storage:** Project information is saved in the browser
    using `localStorage`.
-   **Responsive layout:** The interface adapts to smaller screens.

## Built With

-   HTML
-   CSS
-   JavaScript
-   Browser `localStorage` for local persistence

## Run Locally

1.  Download or clone this repository.
2.  Make sure the three files are named and linked correctly:
    -   `index.html`
    -   `style.css`
    -   `script.js`
3.  Open `index.html` in a modern web browser.

> **Important:** The supplied HTML currently links to `style.css` and
> `script.js`, while the uploaded files are named `PROJECT.css` and
> `PROJECT.js`. Rename the files as shown above, or update the filenames
> in the `<link>` and `<script>` tags in the HTML. For GitHub Pages, the
> main HTML file should be named `index.html`.

## How to Use

1.  Select **+ New Project**.
2.  Enter the project name and description. The owner name is optional.
3.  Save the project.
4.  Open the project to access its workspace.
5.  Add a design proposal. You can optionally provide an image URL and
    design notes.
6.  Change the proposal's approval status as needed.
7.  Use **+ New Version** to record a revision, and **+ Add Comment** to
    add review feedback.

## Data and Limitations

-   Data is stored in the browser's `localStorage`, not in a shared
    online database.
-   Saved projects are generally available only in the same browser and
    browser profile on the same device. Clearing browser data can remove
    them.
-   Publishing the site on GitHub Pages makes the website accessible
    online, but it does **not** create shared accounts, cloud storage,
    or collaboration between different users.
-   Proposal images must be available through a valid HTTP or HTTPS
    image URL.

## Deploy on GitHub Pages

1.  Create a repository on GitHub.
2.  Upload `index.html`, `style.css`, `script.js`, and `README.md` to
    the repository's root folder.
3.  Open the repository's **Settings**.
4.  Select **Pages**.
5.  Under the build/deployment settings, choose **Deploy from a
    branch**.
6.  Select the `main` branch and the `/(root)` folder, then save.
7.  Wait for the deployment to finish. GitHub will show the published
    site link in the Pages section.

## Project Structure

``` text
ArchPortal/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Purpose

ArchPortal provides a simple interface for students to present
architecture projects, organize design proposals, track revisions, and
collect review comments.
