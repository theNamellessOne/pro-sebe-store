import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { SizeMeasure } from "@prisma/client";
import { Ruler } from "lucide-react";

export function SizeTableModal({
  sizeMeasures,
}: {
  sizeMeasures: SizeMeasure[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className={"flex gap-2 font-semibold rounded-sm justify-start"}
      >
        <Ruler />
        Перевір свій розмір.
      </button>

      <Modal
        size={"xl"}
        scrollBehavior={"inside"}
        classNames={{ base: "rounded-sm" }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Розмірна сітка (cm)
              </ModalHeader>
              <ModalBody>
                <Table
                  aria-label="розмірна сітка"
                  classNames={{
                    wrapper: "rounded-sm",
                  }}
                >
                  <TableHeader>
                    <TableColumn>РОЗМІР</TableColumn>
                    <TableColumn>МІРКИ</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {sizeMeasures.map((measure) => {
                      return (
                        <TableRow key={measure.id}>
                          <TableCell>{measure.sizeName}</TableCell>
                          <TableCell>{measure.sizeMeasure}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={onClose}
                  className={"rounded-sm"}
                >
                  Закрити
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
