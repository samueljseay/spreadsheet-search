## Spreadsheet Search

A simple Node.js app that pulls data from all the worksheets in a spreadsheet and flattens them out into an array of strings.

The client JavaScript is built with webpack before pushing the code up. The client is used to do a simple search over the content.

If you're interested in running this example you'll need to do an `npm install`, and you'll need to supply
your own `API_KEY`, `REFERER` (for the Google API key) and the ID of a spreadsheet as `SPREADSHEET_ID` via environment variables.

run `node index.js` or `npm start` to get the server running.
