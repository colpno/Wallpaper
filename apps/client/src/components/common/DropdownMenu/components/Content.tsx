import type { DropdownMenuData } from "../DropdownMenu.types";

import Group from "./Group";
import Item from "./Item";
import RadioGroup from "./RadioGoup";

function Content({ data }: { data: DropdownMenuData }) {
  return data.map((item) =>
    "radios" in item ? (
      <RadioGroup {...item} key={item.key} />
    ) : "group" in item ? (
      <Group {...item} key={item.key} />
    ) : (
      <Item {...item} key={item.key} />
    )
  );
}

export default Content;
