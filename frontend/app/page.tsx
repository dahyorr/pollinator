"use client"
import NewPollModal from "@/components/NewPollModal";
import PollCard from "@/components/PollCard";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";

export default function Home() {

  const { onOpenChange, isOpen, onOpen } = useDisclosure()

  return (
    <main className="container mx-auto px-4 bg-red">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-2xl text-left my-4">Recent Polls</p>
        <Button size="md" color="primary" className="" onClick={onOpen}>New Poll</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <PollCard />
        <PollCard />
        <PollCard />
        <PollCard />
        <PollCard />
      </div>

      <NewPollModal isOpen={isOpen} onOpenChange={onOpenChange} />

    </main>
  );
}
