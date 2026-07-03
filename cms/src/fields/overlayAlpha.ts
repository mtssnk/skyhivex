import type { NumberField } from 'payload'

type OverlayAlphaOptions = {
  description?: string
  defaultValue?: number
  condition?: (data: Record<string, unknown>, siblingData: Record<string, unknown>) => boolean
}

export function overlayAlphaField(options?: OverlayAlphaOptions): NumberField {
  return {
    name: 'overlayAlpha',
    type: 'number',
    min: 0,
    max: 1,
    ...(options?.defaultValue !== undefined ? { defaultValue: options.defaultValue } : {}),
    admin: {
      description: options?.description ?? 'Dark overlay opacity (0–1) to improve text contrast.',
      step: 0.05,
      ...(options?.condition ? { condition: options.condition } : {}),
      components: {
        Field: '/components/RangeSlider',
      },
    },
  }
}
