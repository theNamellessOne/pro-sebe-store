"use client";

import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { ReorderIcon } from "@/app/dashboard/components/reorder-icon";
import { useRaisedShadow } from "@/app/dashboard/hooks/use-raised-shadow";
import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { TbColumns3 } from "react-icons/tb";
import { Column } from "@/app/dashboard/types/table-props";
import { useTableColumns } from "@/app/dashboard/hooks/use-table-columns";

export function TableColumns() {
  const { columns, setColumns } = useTableColumns()!;

  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button
          color={"primary"}
          variant={"shadow"}
          isIconOnly
          className={"mt-2"}
        >
          <TbColumns3 className={"w-6 h-6"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className={"min-w-[300px] py-2"}>
          <Reorder.Group
            axis={"y"}
            values={columns}
            onReorder={setColumns}
            className={"w-full"}
          >
            {columns.map((column) => {
              return (
                <Item
                  key={column.uid}
                  value={column}
                  allValues={columns}
                  setValue={setColumns}
                />
              );
            })}
          </Reorder.Group>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const Item = (props: {
  value: Column;
  allValues: Column[];
  setValue: (newValue: Column[]) => void;
}) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={props.value}
      dragListener={false}
      style={{ boxShadow, y }}
      dragControls={dragControls}
      className={"flex justify-between rounded-small px-4 py-2"}
    >
      <div>
        <Checkbox
          isSelected={props.value.shown}
          onValueChange={(selected) => {
            props.setValue(
              props.allValues.map((value) => {
                if (value.uid === props.value.uid) {
                  return { ...value, shown: selected };
                }

                return value;
              }),
            );
          }}
        >
          <span>{props.value.name}</span>
        </Checkbox>
      </div>

      <ReorderIcon dragControls={dragControls} />
    </Reorder.Item>
  );
};
