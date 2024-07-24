import { FC, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, } from "@nextui-org/modal";
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Checkbox } from '@nextui-org/checkbox';
import { Select, SelectItem } from '@nextui-org/select';
import dayjs from 'dayjs';
import { CalendarDateTime, ZonedDateTime, fromDate, getLocalTimeZone, now, parseAbsoluteToLocal, parseZonedDateTime } from '@internationalized/date';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { FaRegTrashAlt } from 'react-icons/fa';
import UiDatePicker from './UiDatePicker';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/supabase/client';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from '@/config';


interface NewPollModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  poll?: Poll
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
const getSchema = (edit: boolean) => yup.object().shape({
  question: yup.string().required().label("Question"),
  options: yup.array().of(yup.string().required('Required')).min(2).label("Options").required(),
  allowMultipleChoices: yup.boolean().default(false),
  requireAuth: yup.boolean().default(false),
  duration: yup.mixed<"none" | "custom" | number>().required().label('Duration'),
  endDate: yup.date().when('duration', {
    is: "custom",
    then: schema => {
      return edit ? schema : schema.required("Required")
    }
  }).label('End Date')

})

const NewPollModal: FC<NewPollModalProps> = ({ isOpen, onOpenChange, poll }) => {
  const { session } = useSession()
  const queryClient = useQueryClient()
  const edit = !!poll

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors, touchedFields }
  } = useForm<FormInputs>({
    defaultValues: !!poll ? {
      options: poll.poll_options.map(po => po.value) || ['', ''],
      question: poll.question || '',
      allowMultipleChoices: poll.multiple_choice || false,
      // requireAuth: poll.require_auth || false,
      endDate: poll.end_date ? new Date(poll.end_date) : undefined,
      duration: "custom"
    } : {
      options: ['', ''],
      allowMultipleChoices: false,
      requireAuth: false,
    },
    resolver: yupResolver(getSchema(edit))
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
    const resp = await fetch(`${API_URL}/poll`, {
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

  const UpdatePollApi = async (data: any) => {
    if (!poll) return;
    const payload = {
      id: poll.id,
      question: data.question,
      // options: data.options,
      multiple_choice: data.allowMultipleChoices,
      require_auth: data.requireAuth,
      end_date: data.endDate,
    }
    const resp = await fetch(`${API_URL}/poll/${poll.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(payload)
    })
    if (resp.ok) {
      toast.success('Poll updated successfully')
      onOpenChange(isOpen)
      reset()
    }
    else {
      const data = await resp.json()
      throw new Error(data.message || data.error || 'Failed to update poll')
    }
  }


  const { mutateAsync, isPending } = useMutation({
    mutationFn: edit ? UpdatePollApi : CreatePollApi,
    onError: (error) => toast.error(error.message),
    onSuccess: async () => {
      if (edit) {
        await queryClient.invalidateQueries({ queryKey: ['poll', poll.id] })
      }
      else {
        await queryClient.invalidateQueries({ queryKey: ['polls'] })
      }
    }
  })

  const onSubmit = (data: FormInputs) => mutateAsync(data)

  console.log(errors)
  return (
    <Modal
      size={'lg'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{edit ? "Update" : "New"} Poll</ModalHeader>
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
                        defaultValue={o}
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
                    
                    {/* <Checkbox
                      {...register("requireAuth")}
                      isInvalid={!!errors['requireAuth']}
                    >Require Authentication</Checkbox> */}

                    {!edit && (<Select
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
                    </Select>)}

                    {(duration === 'custom' || edit) && (
                      <UiDatePicker
                        register={register}
                        fieldKey="endDate"
                        minValue={now(getLocalTimeZone())}
                        defaultValue={poll && poll.end_date ? fromDate(new Date(poll.end_date), getLocalTimeZone()) : undefined}
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
                  {edit ? "Update" : "Create"} Poll
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