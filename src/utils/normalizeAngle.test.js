import { normalizeAngle } from './normalizeAngle'

describe('normalizeAngle', () => {
  describe('when called with 0', () => {
    it('should return 0', () => {
      expect(normalizeAngle(0)).toBe(0)
    })
  })

  describe('when called with π', () => {
    it('should return π', () => {
      expect(normalizeAngle(Math.PI)).toBe(Math.PI)
    })
  })

  describe('when called with 2π', () => {
    it('should return 0', () => {
      expect(normalizeAngle(2 * Math.PI)).toBe(0)
    })
  })

  describe('when called with -π', () => {
    it('should return π', () => {
      expect(normalizeAngle(-Math.PI)).toBe(Math.PI)
    })
  })

  describe('when called with -π/2', () => {
    it('should return 3π/2', () => {
      expect(normalizeAngle(-Math.PI)).toBe(Math.PI)
    })
  })
})