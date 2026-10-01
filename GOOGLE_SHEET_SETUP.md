# Google Sheets RSVP setup

The website is prepared to send RSVP responses to a Google Apps Script Web App, which then appends each response to a Google Sheet.

The Apps Script endpoint receives:
1. Name
2. Phone Number
3. Attending
4. Joining Date(s)
5. Wishes
6. Timestamp, added by the script

## One-time setup

### 1. Create the response sheet

Create a Google Sheet for the wedding RSVP responses.

### 2. Open Apps Script

In that Google Sheet, go to:

**Extensions → Apps Script**

Replace the default code with the contents of `google-apps-script/Code.gs` from this repository, then save.

### 3. Deploy as a Web App

In Apps Script choose:

**Deploy → New deployment → Web app**

Use:

- **Execute as:** Me
- **Who has access:** Anyone

Guests will not be logged into your Google account, so the web app must be reachable without requiring their Google login. Google documents that Apps Script web apps can run as the deploying user and can be made accessible to anonymous users.

Copy the production URL ending in `/exec`. Do not use the `/dev` test URL for the invitation.

### 4. Add the URL to the invitation

Open `js/config.js` on the **development** branch and find:

    rsvp: {
      deadline:    "10 November 2026",
      webAppUrl:   "",
    },

Paste your `/exec` URL into `webAppUrl`.

### 5. Test

Submit one test RSVP from the invitation. A new row should appear in the `RSVP` tab with the timestamp, name, phone number, attendance, joining date(s), and wishes.

Then test once from another device or mobile browser before sharing the invitation widely.

## Important

The Google Sheet itself is not exposed to the website. The website only knows the Apps Script Web App endpoint. The script writes the submitted values to the spreadsheet under your Google account.

The endpoint URL is not a secret. The Apps Script includes basic input cleaning and a hidden honeypot field to reduce simple automated submissions.