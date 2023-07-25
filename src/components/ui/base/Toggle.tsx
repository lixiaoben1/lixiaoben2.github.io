import { createEffect, createMemo, createUniqueId, mergeProps, on } from 'solid-js'
import * as zagSwitch from '@zag-js/switch'
import { normalizeProps, useMachine } from '@zag-js/solid'
import type { Accessor } from 'solid-js'

interface Props {
  value: Accessor<boolean>
  setValue: (v: boolean) => void
  readOnly?: boolean
}

export const Toggle = (inputProps: Props) => {
  const props = mergeProps({}, inputProps)
  const [state, send] = useMachine(zagSwitch.machine({
    id: createUniqueId(),
    readOnly: props.readOnly,
    checked: props.value(),
    onChange({ checked }) {
      props.setValue(checked)
    },
  }))

  const api = createMemo(() => zagSwitch.connect(state, send, normalizeProps))

  createEffect(on(props.value, () => {
    api().setChecked(props.value())
  }))

  return (
    <label {...api().rootProps}>
      <input {...api().inputProps} type="checkbox" />
      <div {...api().controlProps} class="track">
        <span {...api().thumbProps} />
      </div>
    </label>
  )
}
