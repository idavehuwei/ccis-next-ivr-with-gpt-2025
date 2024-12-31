import '@testing-library/jest-dom'
import { jest } from '@jest/globals'

// 模拟 vue-router
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}))

// 设置 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
})