import { BsChevronDoubleLeft } from "react-icons/bs";

import Button from "@/components/ui/Button";

function DraftPanel() {
  return (
    <div className="border border-border">
      <div className="space-y-4 border-b border-border p-4">
        <Button variant="ghost" size="icon-lg">
          <BsChevronDoubleLeft />
        </Button>
      </div>
    </div>
  );
}

export default DraftPanel;
