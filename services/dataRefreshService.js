const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');

const logFilePath = path.join(__dirname, '../logs/refresh.log');

async function refreshData() {
  const timestamp = new Date().toISOString();
  try {
    console.log(`[${timestamp}] Starting data refresh...`);
    await fs.appendFile(logFilePath, `[${timestamp}] Starting data refresh...\n`);

    // Execute the data loading script
    await new Promise((resolve, reject) => {
        const loadScriptPath = path.resolve(__dirname, '../scripts/load_data.js');
        exec(`node "${loadScriptPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`[${timestamp}] Error during data refresh: ${error}`);
          console.error(`[${timestamp}] Stderr: ${stderr}`);
          fs.appendFile(logFilePath, `[${timestamp}] Error during data refresh: ${error}\n`);
          fs.appendFile(logFilePath, `[${timestamp}] Stderr: ${stderr}\n`);
          reject(error);
          return;
        }
        console.log(`[${timestamp}] Data loading script executed successfully.`);
        console.log(`[${timestamp}] Stdout: ${stdout}`);
        fs.appendFile(logFilePath, `[${timestamp}] Data loading script executed successfully.\n`);
        fs.appendFile(logFilePath, `[${timestamp}] Stdout: ${stdout}\n`);
        resolve();
      });
    });

    console.log(`[${timestamp}] Data refresh completed successfully.`);
    await fs.appendFile(logFilePath, `[${timestamp}] Data refresh completed successfully.\n`);
    return { success: true, message: 'Data refresh initiated and completed.' };
  } catch (error) {
    console.error(`[${timestamp}] Data refresh failed: ${error.message}`);
    await fs.appendFile(logFilePath, `[${timestamp}] Data refresh failed: ${error.message}\n`);
    return { success: false, message: 'Data refresh failed.', error: error.message };
  }
}

cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Scheduled data refresh triggered...');
    await refreshData();
  });
  
module.exports = { refreshData };