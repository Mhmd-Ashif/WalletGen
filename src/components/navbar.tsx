import { Command } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function NavBar() {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex justify-center space-x-1.5  ">
          <Command className="place-self-center size-6 md:size-7 " />
          <h2 className="text-2xl md:text-3xl font-semibold place-self-center ">
            Ash
          </h2>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
