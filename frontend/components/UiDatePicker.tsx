import { DateValue, getLocalTimeZone, now } from '@internationalized/date'
import { DatePicker, DatePickerProps } from '@nextui-org/date-picker'
import { FC } from 'react'
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form'


interface IProps<T extends FieldValues = any> extends DatePickerProps {
  register: UseFormRegister<T>,
  fieldKey: string
}

const UiDatePicker: FC<IProps> = ({ register, fieldKey, ...props }) => {
  const { onChange, ...endDateProps } = register(fieldKey)

  return (
    <DatePicker
      {...endDateProps}
      {...props}
      onChange={(value) => {
        onChange({
          target: {
            value: value.toDate(getLocalTimeZone()),
            name: endDateProps.name
          }
        })
      }}
    />)

}

export default UiDatePicker