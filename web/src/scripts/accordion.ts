// Shared behaviour for AccordionList and FeatureAccordionList.
//
// Delegated on `document` (not the individual triggers): `document` survives
// client-side navigations, but block markup inside <main> is swapped on every
// navigation, so per-element listeners bound at module load stop working after
// the first transition. See web/CLAUDE.md -> "Page transitions".

function toggleAccordion(trigger: HTMLElement) {
  const expanded = trigger.getAttribute('aria-expanded') === 'true'
  const bodyId = trigger.getAttribute('aria-controls')
  const body = bodyId ? document.getElementById(bodyId) : null

  trigger.setAttribute('aria-expanded', String(!expanded))

  if (body) {
    body.setAttribute('aria-hidden', String(expanded))
    body.classList.toggle('grid-rows-[1fr]', !expanded)
    body.classList.toggle('grid-rows-[0fr]', expanded)
    const inner = body.querySelector<HTMLElement>(':scope > div > div')
    if (inner) {
      inner.classList.toggle('opacity-0', expanded)
      inner.classList.toggle('delay-150', !expanded)
      inner.classList.toggle('delay-0', expanded)
    }
  }

  // AccordionList adornment
  trigger.querySelector('.accordion-icon')?.classList.toggle('is-open', !expanded)

  // FeatureAccordionList adornments
  const label = trigger.querySelector('.read-label')
  if (label) label.textContent = expanded ? 'Read more' : 'Read less'
  trigger.querySelector('.accordion-arrow')?.classList.toggle('rotate-180', !expanded)
}

document.addEventListener('click', (e) => {
  const trigger = (e.target as HTMLElement).closest<HTMLElement>('.accordion-trigger')
  if (trigger) toggleAccordion(trigger)
})
