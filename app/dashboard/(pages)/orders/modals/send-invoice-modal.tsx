import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import Loading from "@/app/loading";
import { Input } from "@nextui-org/input";
import { MailService } from "@/service/mail/mail-service";
import toast, { Toaster } from "react-hot-toast";

export function SendInvoiceModal({
  email,
  orderId,
}: {
  email: string;
  orderId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [ttn, setTtn] = useState("");

  const sendEmail = () => {
    setLoading(true);
    MailService.instance
      .sendInvoiceMail(email, ttn, orderId)
      .then((res) => {
        if (res.success) toast.success(res.success);
        if (res.error) toast.error(res.error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button variant={"light"} onPress={onOpen}>
        Email з накладною
      </Button>
      <Modal
        size={"5xl"}
        scrollBehavior={"inside"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {loading && <Loading />}
              <ModalHeader className="flex flex-col gap-1">Invoice</ModalHeader>
              <ModalBody>
                <Input
                  value={ttn}
                  label={"ТТН"}
                  disabled={loading}
                  onValueChange={setTtn}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрити
                </Button>
                <Button color="success" variant="light" onPress={sendEmail}>
                  Вiдправити
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
        <Toaster />
      </Modal>
    </>
  );
}
