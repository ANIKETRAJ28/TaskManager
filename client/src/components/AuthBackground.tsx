import { cn } from "@/lib/utils";
import { GridPattern } from "./ui/grid-pattern";

export function AuthBackground() {
  return (
    <div>
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      />
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "mask-[linear-gradient(to_bottom_left,white,transparent,transparent)]"
        )}
      />
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "mask-[linear-gradient(to_top_right,white,transparent,transparent)]"
        )}
      />
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "mask-[linear-gradient(to_top_left,white,transparent,transparent)]"
        )}
      />
    </div>
  );
}
