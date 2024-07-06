"use client"
import NewPollModal from "@/components/NewPollModal";
import Polls from "@/components/Polls";
import { useSession } from "@/hooks/useSession";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";

export default function Home() {
  const { session } = useSession()
  const { onOpenChange, isOpen, onOpen } = useDisclosure()

  return (
    <main className="container mx-auto px-4 bg-red">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-2xl text-left my-4">Recent Polls</p>
        {session && (<Button size="md" color="primary" className="" onClick={onOpen}>New Poll</Button>)}
      </div>

      <Polls />

      <NewPollModal isOpen={isOpen} onOpenChange={onOpenChange} />

    </main>
  );
}
