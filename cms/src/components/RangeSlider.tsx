'use client'

import { useField } from '@payloadcms/ui'
import type { NumberFieldClientComponent } from 'payload'

const cls = 'pld-range'

const RangeSlider: NumberFieldClientComponent = ({ field }) => {
  const { value, setValue } = useField<number>()
  const current = typeof value === 'number' ? value : 0
  const label = typeof field.label === 'string' ? field.label : field.name
  const min = field.min ?? 0
  const max = field.max ?? 1
  const pct = `${(((current - min) / (max - min)) * 100).toFixed(1)}%`

  return (
    <div className="field-type number">
      <style>{`
        input.${cls} {
          -webkit-appearance: none;
          appearance: none;
          flex: 1;
          width: 100%;
          height: 4px;
          border: none;
          padding: 0;
          margin: 0;
          border-radius: 2px;
          background: linear-gradient(
            to right,
            var(--color-blue-450, #4f8ef7) 0%,
            var(--color-blue-450, #4f8ef7) var(--pct),
            var(--theme-elevation-150, rgba(128, 128, 128, 0.25)) var(--pct),
            var(--theme-elevation-150, rgba(128, 128, 128, 0.25)) 100%
          );
          outline: none;
          cursor: pointer;
        }
        input.${cls}::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--theme-bg, #1a1a1a);
          border: 2px solid var(--color-blue-450, #4f8ef7);
          cursor: pointer;
        }
        input.${cls}::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--theme-bg, #1a1a1a);
          border: 2px solid var(--color-blue-450, #4f8ef7);
          cursor: pointer;
          box-sizing: border-box;
        }
        input.${cls}::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: var(--theme-elevation-150, rgba(128, 128, 128, 0.25));
        }
        input.${cls}::-moz-range-progress {
          height: 4px;
          border-radius: 2px;
          background: var(--color-blue-450, #4f8ef7);
        }
      `}</style>
      <label className="field-label">{label}</label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '0.5rem',
          marginBottom: '0.25rem',
        }}
      >
        <input
          type="range"
          className={cls}
          min={min}
          max={max}
          step={typeof field.admin?.step === 'number' ? field.admin.step : 0.05}
          value={current}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          style={{ '--pct': pct } as React.CSSProperties}
        />
        <span
          style={{
            minWidth: '2.5rem',
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
            fontSize: '0.8em',
            color: 'var(--theme-text, currentColor)',
            opacity: 0.6,
          }}
        >
          {current.toFixed(2)}
        </span>
      </div>
      {field.admin?.description && (
        <p className="field-description">{field.admin.description as string}</p>
      )}
    </div>
  )
}

export default RangeSlider
