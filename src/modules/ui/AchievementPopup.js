/**
 * AchievementPopup.js — Brief achievement unlock notification.
 */
export class AchievementPopup {
  constructor(notificationManager) { this.notif = notificationManager; }
  show(achievement) {
    this.notif.show(`🏆 Achievement: "${achievement.name}"`, { duration: 5000, type: 'success' });
  }
}
