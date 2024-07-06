import { signInWithGithub, signInWithGoogle } from "@/utils/authHelpers";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { FC } from 'react'
import { HiMailOpen } from "react-icons/hi";
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from "@/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

interface LoginModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void

}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p>Sign in</p>
              <p className="font-light text-sm">Sign in and start creating your polls</p>
            </ModalHeader>
            <ModalBody>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  style: {

                  },
                  variables: {
                    default: {
                      colors: {
                        brand: "#006FEE",
                        brandAccent: `gray`,
                      }
                    }
                  }
                }}
                providers={['google', 'github']}
              />
              {/* <form className="flex flex-col gap-2">
                <Input
                  autoFocus
                  endContent={
                    <HiMailOpen className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Button color="primary" className="w-full" onPress={onClose}>
                  Sign in
                </Button>
              </form>
              <Divider />

              <div className="flex flex-col gap-2">
                <Button color="primary" className="w-full" onClick={signInWithGoogle}>
                  Sign in with Google
                </Button>

                <Button color="primary" className="w-full" onClick={signInWithGithub}>
                  Sign in with Github
                </Button>
              </div> */}
            </ModalBody>
            {/* <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>

            </ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LoginModal