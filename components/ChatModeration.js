import { saveChatLog } from "../firebase.js";
const bannedWords = ["badword1", "badword2", "bullyword"];
export function moderateChat(message, userId = null) {
  for (var i = 0; i < bannedWords.length; i++) {
    var word = bannedWords[i];
    if (message.toLowerCase().indexOf(word) !== -1) {
      // Log moderation event for educator review
      if (window.logEducatorAction)
        window.logEducatorAction({ type: "chatModeration", message: message, word: word });
      // Show privacy notice
      if (window.showPrivacyNotice)
        window.showPrivacyNotice("All chat moderation actions are private and logged for safety.");
      // Save moderation event to Firestore
      if (userId) {
        saveChatLog(userId, [
          {
            message: message,
            banned: true,
            reason: "Profanity or bullying detected",
            word: word,
            timestamp: Date.now(),
          },
        ]).catch(function () {
          // Optionally alert or log error
        });
      }
      return { banned: true, reason: "Profanity or bullying detected" };
    }
  }
  return { banned: false };
}
