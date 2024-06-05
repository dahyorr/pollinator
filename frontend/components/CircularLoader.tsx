import { CircularProgress } from "@nextui-org/progress"

const CircularLoader = () => {
  return (
    <div className="flex justify-center items-center">
      <CircularProgress aria-label="loading" size="lg" />
    </div>
  )
}

export default CircularLoader
