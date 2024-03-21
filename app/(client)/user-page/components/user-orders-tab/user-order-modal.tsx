import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {
  OrderDeliveryType,
  OrderItem,
  OrderPaymentType,
  OrderStatus,
} from "@prisma/client";
import {
  TranslatedDeliveryTypes,
  TranslatedPaymentTypes,
  TranslatedStatuses,
} from "@/app/dashboard/(pages)/orders/const/transl";
import { Button } from "@/app/(client)/components/ui/button";
import { OrderProductItem } from "./order-product-item";

export function UserOrderModal({ order }: { order: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button type={"secondary"} onClick={onOpen} className={"w-full"}>
        Детальніше
      </Button>
      <Modal
        size={"5xl"}
        scrollBehavior={"inside"}
        classNames={{ base: "rounded-sm" }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Замовлення
              </ModalHeader>
              <ModalBody>
                <div className={"grid lg:grid-cols-2 grid-cols-1"}>
                  <div
                    className={
                      "flex flex-col gap-2 py-3 px-1 border-b-1 lg:border-b-0 lg:border-r-1"
                    }
                  >
                    <p
                      className={
                        "col-span-2 font-bold my-2 relative " +
                        "after:ml-2 after:top-1/2 after:absolute after:w-full after:h-px after:bg-secondary overflow-hidden"
                      }
                    >
                      Товари
                    </p>
                    {order.orderItems.map((item: OrderItem) => (
                      <>
                        <OrderProductItem item={item} />
                        <Divider className={"col-span-2"} />
                      </>
                    ))}
                  </div>

                  <div
                    className={
                      "grid grid-cols-2 gap-2 h-fit top-0 lg:sticky py-3 px-1 lg:pl-4"
                    }
                  >
                    <p
                      className={
                        "col-span-2 font-bold my-2 relative " +
                        "after:ml-2 after:top-1/2 after:absolute after:w-full after:h-px after:bg-secondary overflow-hidden"
                      }
                    >
                      Загальне
                    </p>
                    <p className={"col-span-2 text-center my-2"}></p>

                    <p>Id</p>
                    <p>{order.id}</p>
                    <p>Статус</p>
                    <p>{TranslatedStatuses[order.status as OrderStatus]}</p>
                    <p>Оплата</p>
                    <p>
                      {
                        TranslatedPaymentTypes[
                          order.paymentType as OrderPaymentType
                        ]
                      }
                    </p>
                    <p>Доставка</p>
                    <p>
                      {
                        TranslatedDeliveryTypes[
                          order.orderDeliveryType as OrderDeliveryType
                        ]
                      }
                    </p>
                    <p>Всього</p>
                    <p>{order.total.toString()} UAH</p>

                    <p className={"col-span-2 my-2"}></p>
                    <p
                      className={
                        "col-span-2 font-bold my-2 relative " +
                        "after:ml-2 after:top-1/2 after:absolute after:w-full after:h-px after:bg-secondary overflow-hidden"
                      }
                    >
                      Контактні Дані
                    </p>
                    <p className={"col-span-2 my-2"}></p>

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

                    <p className={"col-span-2 my-2"}></p>
                    <p
                      className={
                        "col-span-2 font-bold my-2 relative " +
                        "after:ml-2 after:top-1/2 after:absolute after:w-full after:h-px after:bg-secondary overflow-hidden"
                      }
                    >
                      Доставка
                    </p>
                    <p className={"col-span-2 my-2"}></p>

                    {order.orderDeliveryType ===
                      OrderDeliveryType.WAREHOUSE && (
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

                    <p>Опис поселення</p>
                    <p>{order.settlementDescription}</p>

                    <div
                      className={"flex flex-col col-span-2 my-2 gap-2"}
                    ></div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button type={"primary"} onClick={onClose}>
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
