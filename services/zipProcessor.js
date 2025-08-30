const AdmZip = require("adm-zip");
const fs = require("fs").promises;
const path = require("path");
const { User, Transaction } = require("../models");

const parseJSONWithAutoFix = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    let fixedJson = jsonString;

    // Auto-fix common JSON issues with more robust patterns
    fixedJson = fixedJson.replace(/(\d+\.?\d*)\s*\n\s*"/g, '$1,\n        "');

    // Fix missing commas after strings followed by strings
    fixedJson = fixedJson.replace(/"([^"]*)"[\s]*\n\s*"/g, '"$1",\n        "');

    // Remove trailing spaces in string values
    fixedJson = fixedJson.replace(/"([^"]*)\s+"/g, '"$1"');

    // Fix missing commas between object properties
    fixedJson = fixedJson.replace(/(["}])\s*\n\s*"/g, '$1,\n        "');

    // Fix missing commas between array elements (objects)
    fixedJson = fixedJson.replace(/}\s*\n\s*{/g, "},\n    {");

    try {
      const result = JSON.parse(fixedJson);
      return result;
    } catch (secondError) {
      throw error; // Throw original error if auto-fix doesn't work
    }
  }
};

const processZipFile = async (zipFilePath) => {
  try {
    const zip = new AdmZip(zipFilePath);
    const entries = zip.getEntries();

    let userData = null;
    let transactionData = null;
    let avatarBuffer = null;

    for (const entry of entries) {
      const fileName = path.basename(entry.entryName);

      if (fileName === "userData.json") {
        const rawData = entry.getData().toString();
        userData = parseJSONWithAutoFix(rawData);
      } else if (fileName === "transactions.json") {
        const rawData = entry.getData().toString();
        transactionData = parseJSONWithAutoFix(rawData);
      } else if (fileName === "avatar.png") {
        avatarBuffer = entry.getData();
      }
    }

    if (!userData || !transactionData || !avatarBuffer) {
      throw new Error("Missing required files in zip");
    }

    const avatarFileName = `avatar-${Date.now()}.png`;
    const avatarPath = path.join(__dirname, "../public/avatars", avatarFileName);
    await fs.writeFile(avatarPath, avatarBuffer);

    // Check if user already exists by first name and last name
    let user = await User.findOne({
      where: {
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });

    let isUserExisting = false;
    if (user) {
      isUserExisting = true;
      
      // Remove old avatar file if it exists
      if (user.avatarPath) {
        const oldAvatarPath = path.join(__dirname, "../public/avatars", user.avatarPath);
        try {
          await fs.unlink(oldAvatarPath);
        } catch (error) {
          // Ignore error if file doesn't exist
        }
      }
      
      await user.update({
        birthday: new Date(userData.birthday),
        country: userData.country,
        phone: userData.phone,
        avatarPath: avatarFileName,
      });
    } else {
      user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthday: new Date(userData.birthday),
        country: userData.country,
        phone: userData.phone,
        avatarPath: avatarFileName,
      });
    }

    let transactionsAdded = 0;
    let transactionsUpdated = 0;

    for (const transaction of transactionData) {
      // Check if transaction already exists for this specific user
      const existingTransaction = await Transaction.findOne({
        where: {
          reference: transaction.reference,
          userId: user.id,
        },
      });

      if (existingTransaction) {
        // Update existing transaction
        await existingTransaction.update({
          amount: transaction.amount,
          currency: transaction.currency,
          message: transaction.message,
          timestamp: new Date(transaction.timestamp),
        });
        transactionsUpdated++;
      } else {
        // Add new transaction
        await Transaction.create({
          userId: user.id,
          reference: transaction.reference,
          amount: transaction.amount,
          currency: transaction.currency,
          message: transaction.message,
          timestamp: new Date(transaction.timestamp),
        });
        transactionsAdded++;
      }
    }

    await fs.unlink(zipFilePath);

    return {
      success: true,
      user: user,
      isUserExisting: isUserExisting,
      transactionCount: transactionData.length,
      transactionsAdded: transactionsAdded,
      transactionsUpdated: transactionsUpdated,
      message: isUserExisting
        ? `User "${user.firstName} ${
            user.lastName
          }" already exists. Updated profile data, avatar, and processed ${
            transactionsAdded + transactionsUpdated
          } transactions (${transactionsAdded} new, ${transactionsUpdated} updated).`
        : `New user "${user.firstName} ${user.lastName}" created successfully with ${transactionsAdded} transactions imported.`,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { processZipFile };
