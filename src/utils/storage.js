/* eslint-disable no-undef */
export const storage = {
  get (key, type = 'string') {
    const value = localStorage.getItem(key)
    return type === 'string' ? value : JSON.parse(value) || null
  },
  set (key, value, type = 'string') {
    if (type === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  remove (key) {
    localStorage.removeItem(key)
  }
}
