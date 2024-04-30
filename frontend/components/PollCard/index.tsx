import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import PollOptionItem from "./PollOptionItem";
import PollStatus from "./PollStatus";
import PollDropdownMenu from "./PollDropdownMenu";

const tempPollOptions = [
  { label: "Red", percentage: 30 },
  { label: "Blue", percentage: 20 },
  { label: "Green", percentage: 50 },
]

const PollCard = () => {
  return (
    <Card className="max-w-[400px] lg:max-w-[500px]">
      <CardHeader className="flex gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-md font-semibold">Whats your favorite color</p>
          <p className="text-small text-default-500">(10 minutes ago)</p>
        </div>
        <PollStatus status={"open"} />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-4">
          {tempPollOptions.map((option, index) => (
            <PollOptionItem key={index} label={option.label} percentage={option.percentage} />
          ))}
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex gap-3 justify-between">
        <p className="text-small text-default-500">100 responses</p>
        <PollDropdownMenu status="open" />
      </CardFooter>
    </Card>
  )
}

export default PollCard