import { MdOutlineTipsAndUpdates } from "react-icons/md";
import examples from "@/data/examples.json";
import Button from "@/components/common/Button";
import { useMemo, useState } from "react";
export default function Exaple() {
  const [showFull, setShowFull] = useState(false);
  const list = useMemo(() => {
    if (showFull) {
      return examples;
    } else {
      return examples.slice(0, 15);
    }
  }, [showFull]);
  return (
    <div className="overflow-y-auto flex flex-col items-center">
      <div className="mt-20 mb-4 text-4xl">
        <MdOutlineTipsAndUpdates />
      </div>

      <ul className="flex justify-center flex-wrap gap-3.5">
        {list.map((example) => (
          <li key={example.act} className="flex flex-col items-center">
            <Button>{example.act}</Button>
          </li>
        ))}
      </ul>
      {!showFull && (
        <>
          <p className="p-2">...</p>
          <div className="flex w-full items-center space-x-2">
            <hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
            <Button
              onClick={() => {
                setShowFull(true);
              }}
            >
              Show All
            </Button>
            <hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
          </div>
        </>
      )}
    </div>
  );
}
