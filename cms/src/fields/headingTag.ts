import type { SelectField } from 'payload'

type HeadingTagOptions = {
  defaultValue?: 'h1' | 'h2' | 'h3' | 'h4'
}

export function headingTagField(options?: HeadingTagOptions): SelectField {
  return {
    name: 'headingTag',
    type: 'select',
    defaultValue: options?.defaultValue ?? 'h2',
    options: [
      { label: 'H1', value: 'h1' },
      { label: 'H2', value: 'h2' },
      { label: 'H3', value: 'h3' },
      { label: 'H4', value: 'h4' },
    ],
  }
}
