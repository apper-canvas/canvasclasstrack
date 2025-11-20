import notificationsData from "@/services/mockData/notifications.json"

class NotificationService {
  constructor() {
    this.notifications = [...notificationsData]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getUnread() {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.notifications.filter(n => !n.read)
  }

  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.notifications.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Notification with id ${id} not found`)
    }
    this.notifications[index].read = true
    return { ...this.notifications[index] }
  }

  async markAllAsRead() {
    await new Promise(resolve => setTimeout(resolve, 300))
    this.notifications.forEach(notification => {
      notification.read = true
    })
    return [...this.notifications]
  }

  async create(notification) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const maxId = Math.max(...this.notifications.map(n => n.Id), 0)
    const newNotification = {
      ...notification,
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      read: false
    }
    this.notifications.unshift(newNotification)
    return { ...newNotification }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.notifications.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Notification with id ${id} not found`)
    }
    const deleted = { ...this.notifications[index] }
    this.notifications.splice(index, 1)
    return deleted
  }
}

export default new NotificationService()