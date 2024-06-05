import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { Modal, ModalContent } from '@nextui-org/modal'
import { FC, useEffect, useRef } from 'react'

interface TurnstileModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onChallengeCompleted?: (token: string) => void
}

const TurnstileModal: FC<TurnstileModalProps> = ({ isOpen, onOpenChange, onChallengeCompleted }) => {
  const turnstileRef = useRef<TurnstileInstance>(null)

  const onClose = () => {
    onOpenChange(false)
  }

  useEffect(() => {
    const turnstile = turnstileRef.current
    return () => turnstile?.remove()
  }, [])

  return (
    <Modal
      // backdrop='opaque'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      isDismissable={false}
      className={'bg-transparent'}
    >
      <ModalContent>
        <div className="flex justify-center items-center py-2">
          <Turnstile
            ref={turnstileRef}
            siteKey="0x4AAAAAAAZejEiwn1Vd07ho"
            onSuccess={(token) => {
              onChallengeCompleted?.(token)
              onClose()
            }}
            options={{
              refreshExpired: 'auto'
            }}
          />
        </div>
      </ModalContent>
    </Modal>
  )
}

export default TurnstileModal