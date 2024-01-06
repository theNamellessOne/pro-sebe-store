"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Selection,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { Role, User } from "@prisma/client";
import { useState } from "react";
import Loading from "@/app/dashboard/loading";
import { UserService } from "@/app/dashboard/(pages)/users/service/user-service";
import { toast } from "react-hot-toast";
import { userEventChannel } from "@/app/dashboard/(pages)/users/event/user-event-channel";

export function SetRoleModal({ id, email, role }: User) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Selection>(new Set([role]));

  const handleConfirm = () => {
    setLoading(true);
    //@ts-ignore
    UserService.instance.setRole(id, Array.from(selected)[0]).then((res) => {
      setLoading(false);
      userEventChannel.emit("onUserUpdate");
      toast.success("role changed");
    });
  };

  const ROLES = Object.keys(Role);

  return (
    <>
      <Button size={"sm"} variant={"light"} onPress={onOpen}>
        Set Role
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {loading && <Loading />}
              <ModalHeader className="flex flex-col gap-1">
                Change Role
              </ModalHeader>
              <ModalBody>
                <p>{email}</p>
                <div className={"w-full"}>
                  <Select
                    label="Roles"
                    variant="bordered"
                    selectedKeys={selected}
                    onSelectionChange={setSelected}
                  >
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleConfirm}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
