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
import { OrderDeliveryType } from "@prisma/client";
import Image from "next/image";

export function ViewOrderModal({ order }: { order: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button variant={"light"} onPress={onOpen}>
        Детальніше
      </Button>
      <Modal
        size={"xl"}
        scrollBehavior={"inside"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {loading && <Loading />}
              <ModalHeader className="flex flex-col gap-1">
                Order Info
              </ModalHeader>
              <ModalBody>
                <div className={"grid grid-cols-2 gap-2"}>
                  <p>Id</p>
                  <p>{order.id}</p>
                  <p>Статус</p>
                  <p>{order.status}</p>
                  <p>Оплата</p>
                  <p>{order.paymentType}</p>
                  <p>Доставка</p>
                  <p>{order.orderDeliveryType}</p>
                  <p>Всього</p>
                  <p>{order.total}</p>

                  <p className={"col-span-2 text-center my-2"}></p>

                  <p>Ім'я</p>
                  <p>{order.name}</p>
                  <p>Прізвище</p>
                  <p>{order.surname}</p>
                  <p>По батькові</p>
                  <p>{order.middlename}</p>
                  <p>Електронна пошта</p>
                  <p>{order.email}</p>
                  <p>Номер телефону</p>
                  <p>{order.phone}</p>

                  <p className={"col-span-2 text-center my-2"}></p>

                  {order.orderDeliveryType === OrderDeliveryType.WAREHOUSE && (
                    <>
                      <p>Номер відділення</p>
                      <p>{order.warehouseKey}</p>
                    </>
                  )}

                  {order.orderDeliveryType === OrderDeliveryType.COURIER && (
                    <>
                      <p>Вулиця</p>
                      <p>{order.street}</p>
                      <p>Номер будинку/квартира</p>
                      <p>{order.houseNo}</p>
                      <p>Поштовий індекс</p>
                      <p>{order.postalIdx}</p>
                    </>
                  )}

                  <p>Реф поселення</p>
                  <p>{order.settlementRef}</p>

                  {order.orderItems.map((item: any) => (
                    <>
                      <p className={"col-span-2 text-center my-2"}></p>
                      <p>Артикль товару</p>
                      {item.productArticle}
                      <p>Назва товару</p>
                      {item.productName}
                      <p>Назва варіанту</p>
                      {item.variantName}
                      <p>Ціна на момент продажу</p>
                      {item.variantSellingPrice}
                      <p>К-сть</p>
                      {item.quantity}
                      <div
                        className={
                          "col-span-2 my-2 relative min-h-[400px] overflow-hidden rounded-small"
                        }
                      >
                        <Image src={item.variantImgUrl} alt={"картинка"} fill />
                      </div>
                    </>
                  ))}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
