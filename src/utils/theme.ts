import resolveConfig from 'tailwindcss/resolveConfig'
// @ts-expect-error untyped
import tailwindConfig from '../../tailwind.config.js'

export const config = resolveConfig(tailwindConfig)
