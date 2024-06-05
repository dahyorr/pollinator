import { FC, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, } from "@nextui-org/modal";
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Checkbox } from '@nextui-org/checkbox';
import { Select, SelectItem } from '@nextui-org/select';
import dayjs from 'dayjs';
import { CalendarDateTime, ZonedDateTime, getLocalTimeZone, now, parseAbsoluteToLocal, parseZonedDateTime } from '@internationalized/date';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { FaRegTrashAlt } from 'react-icons/fa';
import UiDatePicker from './UiDatePicker';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/supabase/client';
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface NewPollModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void

}

const pollDurations = [
  { label: 'No Duration', value: "none" },
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 5 * 60 },
  { label: '10 minutes', value: 10 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '1 hour', value: 60 * 60 },
  { label: '2 hours', value: 2 * 60 * 60 },
  { label: '5 hours', value: 5 * 60 * 60 },
  { label: '12 hours', value: 12 * 60 * 60 },
  { label: '24 hours', value: 24 * 60 * 60 },
  { label: 'Custom', value: "custom" },

]

interface FormInputs {
  question: string
  options: string[]
  allowMultipleChoices: boolean
  requireAuth: boolean
  duration: number | "custom" | "none"
  endDate?: Date
}
const schema = yup.object().shape({
  question: yup.string().required().label("Question"),
  options: yup.array().of(yup.string().required('Required')).min(2).label("Options").required(),
  allowMultipleChoices: yup.boolean().default(false),
  requireAuth: yup.boolean().default(false),
  duration: yup.mixed<"none" | "custom" | number>().required().label('Duration'),
  endDate: yup.date().when('duration', {
    is: "custom",
    then: schema => schema.label('End Date').required("Required")
  })

})

const NewPollModal: FC<NewPollModalProps> = ({ isOpen, onOpenChange }) => {
  const { session } = useSession()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors, touchedFields }
  } = useForm<FormInputs>({
    defaultValues: {
      options: ['', ''],
      allowMultipleChoices: false,
      requireAuth: false,
    },
    resolver: yupResolver(schema)
  })

  const options = watch('options')
  const duration = watch('duration')
  const endDate = watch('endDate')

  const addNewOption = () => {
    setValue('options', [...options, ''])
  }

  const removeField = (index: number) => {
    setValue('options', options.filter((_, i) => i !== index))
  }

  const CreatePollApi = async (data: any) => {
    const payload = {
      question: data.question,
      options: data.options,
      multiple_choice: data.allowMultipleChoices,
      require_auth: data.requireAuth,
      end_date: data.duration === 'custom' ? data.endDate : undefined,
      duration: ['none', 'custom'].includes(data.duration) ? undefined : Number(data.duration)
    }
    const resp = await fetch('http://localhost:8000/api/poll', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${session?.access_token}`
      }
    })
    if (resp.ok) {
      toast.success('Poll created successfully')
      onOpenChange(isOpen)
      reset()
    }
    else {
      const data = await resp.json()
      throw new Error(data.message || data.error || 'Failed to create poll')
    }

  }

  const { mutateAsync, isPending } = useMutation({
    mutationFn: CreatePollApi,
    onError: (error) => toast.error(error.message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['polls'] })
    }
  })

  const onSubmit = (data: FormInputs) => mutateAsync(data)


  return (
    <Modal
      size={'lg'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">New Poll</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your question"
                    label="Question"
                    labelPlacement="outside"
                    {...register("question", { required: true })}
                    errorMessage={errors['question']?.message}
                    isInvalid={!!errors['question']}
                  // className="w-full p-2 border border-gray-300 rounded-md"
                  />

                  <div className="flex flex-col gap-2">
                    <p className='text-small'>Responses</p>
                    {options.map((o, i) => (
                      <Input
                        key={i}
                        type="text"
                        label={`Option ${i + 1}`}
                        size="sm"
                        {...register(`options.${i}`, { required: true })}
                        errorMessage={errors[`options`]?.[i]?.message as string}
                        isInvalid={!!errors[`options`]?.[i]}
                        endContent={
                          options.length > 2 && (
                            <Button
                              isIconOnly
                              onClick={() => removeField(i)}
                              className="my-auto"
                              color="danger"
                              variant="light"
                              aria-label="Like"
                            >
                              <FaRegTrashAlt />
                            </Button>)
                        }
                      />
                    ))}
                    <div>
                      <Button size="sm" variant="light" onClick={addNewOption} color="primary">Add new option</Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className='text-small'>Settings</p>

                    <Checkbox
                      {...register("allowMultipleChoices")}
                      isInvalid={!!errors['allowMultipleChoices']}
                    >Allow multiple choices</Checkbox>
                    <Checkbox
                      {...register("requireAuth")}
                      isInvalid={!!errors['requireAuth']}
                    >Require Authentication</Checkbox>

                    <Select
                      label="Duration"
                      size="sm"
                      placeholder="Select duration"
                      {...register("duration")}
                      errorMessage={errors['duration']?.message as string}
                      isInvalid={!!errors['duration']}
                    >
                      {pollDurations.map((option, i) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>

                    {duration === 'custom' && (
                      <UiDatePicker
                        register={register}
                        fieldKey="endDate"
                        minValue={now(getLocalTimeZone())}
                        label="End Date"
                        errorMessage={errors['endDate']?.message as string}
                        isInvalid={!!errors['endDate']}
                        hideTimeZone
                        showMonthAndYearPickers
                        granularity="minute"
                      />)}

                  </div>
                </div>

                <Button type="submit" className="w-full" color="primary" isLoading={isSubmitting}>
                  Create Poll
                </Button>
              </form>

            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default NewPollModal