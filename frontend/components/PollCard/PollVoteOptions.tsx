import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox"
import { Radio, RadioGroup } from "@nextui-org/radio"
import { FC } from "react"

interface PollOptionItemProps {
  options: PollOption[]
  multipleOptions?: boolean
  setValue: (value: string[]) => void
  value: string[]
}

const PollVoteOptions: FC<PollOptionItemProps> = ({ multipleOptions, options, setValue, value }) => {

  const onChange = (value: string[]) => {
    setValue(value)
  }

  const onValueChange = (value: string) => {
    setValue([value])
  }


  if (multipleOptions) {
    return (
      <CheckboxGroup className="gap-4" value={value} onChange={onChange}>
        {options.map(o => (
          <Checkbox aria-label={o.value} key={o.id} value={o.id} size="lg">{o.value}</Checkbox>
        ))}
      </CheckboxGroup>
    )
  }

  else return (
    <RadioGroup className="gap-4" value={value?.[0] || ""} onValueChange={onValueChange}>
      {options.map(o => (
        <Radio aria-label={o.value} key={o.id} value={o.id} size="lg">{o.value}</Radio>
      ))}
    </RadioGroup>
  )
}

export default PollVoteOptions