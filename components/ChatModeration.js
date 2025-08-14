const bannedWords = ["badword1", "badword2", "bullyword"];
export function moderateChat(message) {
  for (let word of bannedWords) {
    if (message.toLowerCase().includes(word)) {
      // Log moderation event for educator review
      if (window.logEducatorAction) window.logEducatorAction({ type: 'chatModeration', message, word });
      // Show privacy notice
      if (window.showPrivacyNotice) window.showPrivacyNotice('All chat moderation actions are private and logged for safety.');
      return { banned: true, reason: "Profanity or bullying detected" };
    }
  }
  return { banned: false };
}
