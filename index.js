const moveAllFiles = require('./service');

// moveAllFiles(['DSC01554.ARW', 'DSC01553.ARW'], '1nIK4qNQ4VDIjoY99rNJEdJ0uBIYGlKsw').then(() => {
//   console.log('🔥 All files have been moved!');
// }).catch((error) => {
//     console.error(error)
// });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server don start for port: " + PORT))