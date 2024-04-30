import { FC } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, } from "@nextui-org/modal";
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Checkbox } from '@nextui-org/checkbox';
import { Select, SelectItem } from '@nextui-org/select';
import { DatePicker } from '@nextui-org/date-picker';
import dayjs from 'dayjs';
import { getLocalTimeZone, now } from '@internationalized/date';

interface NewPollModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void

}

const pollDurations = [
  { label: 'No Duration', value: "none" },
  { label: '1 minute', value: 5 * 60 },
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

const NewPollModal: FC<NewPollModalProps> = ({ isOpen, onOpenChange }) => {
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
              <form>
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    placeholder="Enter your question"
                    label="Question"
                    labelPlacement="outside"

                  // className="w-full p-2 border border-gray-300 rounded-md"
                  />

                  <div className="flex flex-col gap-2">
                    <p className='text-small'>Responses</p>
                    <Input
                      type="text"
                      label="Option 1"
                      size="sm"
                    />
                    <Input
                      type="text"
                      label="Option 2"
                      size="sm"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className='text-small'>Settings</p>

                    <Checkbox>Allow multiple choices</Checkbox>

                    <Select
                      label="Duration"
                      size="sm"
                      placeholder="Select duration"
                    >
                      {pollDurations.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <DatePicker
                      label="End Date"
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={now(getLocalTimeZone()).add({ minutes: 5 })}
                      minValue={now(getLocalTimeZone())}
                    />

                  </div>

                </div>
              </form>

            </ModalBody>
            <ModalFooter>

              <Button className="w-full" color="primary" onPress={onClose}>
                Create Poll
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default NewPollModal