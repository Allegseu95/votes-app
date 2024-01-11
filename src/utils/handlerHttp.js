import { customFetch } from './customFetch'

/**
 * Method to make http requests
 * @returns {object} { get, post, put, del }
 */
export const handlerHttp = () => {
  const get = (url, options = {}) => {
    return customFetch(url, options)
  }

  const post = (url, options = {}) => {
    options.method = 'POST'
    return customFetch(url, options)
  }

  const put = (url, options = {}) => {
    options.method = 'PUT'
    return customFetch(url, options)
  }

  const del = (url, options = {}) => {
    options.method = 'DELETE'
    return customFetch(url, options)
  }

  return {
    get,
    post,
    put,
    del
  }
}
