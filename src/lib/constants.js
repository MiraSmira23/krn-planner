export const EVENT_TYPES = [
  { value: 'single_day', label: 'Jeden den' },
  { value: 'evening', label: 'Večeře' },
  { value: 'lunch', label: 'Oběd' },
  { value: 'weekend', label: 'Víkend' },
  { value: 'multi_day', label: 'Výlet (N dní)' },
]

export function eventTypeLabel(type) {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type
}

export const PREFERENCES = [
  {
    value: 'great',
    label: 'Ideální',
    dot: '#4ade80',
    idle: { bg: '#0a1f14', border: '#1a4a28', text: '#4ade80' },
    active: { bg: '#16382a', border: '#4ade80', text: '#4ade80' },
  },
  {
    value: 'ok',
    label: 'Zvládnu',
    dot: '#c8900a',
    idle: { bg: '#1a1608', border: '#3a2808', text: '#c8900a' },
    active: { bg: '#221a08', border: '#c8900a', text: '#c8900a' },
  },
  {
    value: 'hard_no',
    label: 'Nemůžu',
    dot: '#d84050',
    idle: { bg: '#180e14', border: '#300e20', text: '#d84050' },
    active: { bg: '#220e18', border: '#d84050', text: '#d84050' },
  },
]
