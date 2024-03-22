import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import Loading from "@/app/loading";
import {
  OrderDeliveryType,
  OrderItem,
  OrderPaymentType,
  OrderStatus,
} from "@prisma/client";
import Image from "next/image";
import { OrderService } from "@/service/order/order-service";
import {
  TranslatedDeliveryTypes,
  TranslatedPaymentTypes,
  TranslatedStatuses,
} from "../const/transl";
import toast, { Toaster } from "react-hot-toast";

export function ViewOrderModal({ order }: { order: any }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = (status: OrderStatus) => {
    setLoading(true);
    OrderService.instance
      .updateStatus(order.id, status)
      .then((res) => {
        if (res.error) toast.error(res.error);
        if (res.success) toast.success(res.success);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button variant={"light"} onPress={onOpen}>
        Детальніше
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
              <ModalHeader className="flex flex-col gap-1">
                Order Info
              </ModalHeader>
              <ModalBody>
                <div className={"grid lg:grid-cols-2 grid-cols-1"}>
                  <div
                    className={
                      "grid grid-cols-2 gap-2 h-fit top-0 lg:sticky border-b-1 lg:border-b-0 lg:border-r-1 p-3"
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
                    <p>{order.total} UAH</p>
                    <p>Зi знижкою</p>
                    <p>{order.totalWithDiscount} UAH</p>
                    <p>Знижка</p>
                    <p>{order.discount} UAH</p>

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

                    <p>Реф поселення</p>
                    <p>{order.settlementRef}</p>
                    <p>Опис поселення</p>
                    <p>{order.settlementDescription}</p>

                    <div className={"flex flex-col col-span-2 my-2 gap-2"}>
                      <p className={"col-span-2 my-2"}></p>
                      <p
                        className={
                          "col-span-2 font-bold my-2 relative " +
                          "after:ml-2 after:top-1/2 after:absolute after:w-full after:h-px after:bg-secondary overflow-hidden"
                        }
                      >
                        Встановити статус
                      </p>
                      <p className={"col-span-2 my-2"}></p>

                      <Button
                        color="danger"
                        variant="solid"
                        className={"w-full"}
                        onPress={() => handleStatusUpdate(OrderStatus.CANCELED)}
                      >
                        Відмінено
                      </Button>

                      <Button
                        color="danger"
                        variant="flat"
                        className={"w-full"}
                        onPress={() => handleStatusUpdate(OrderStatus.RETURNED)}
                      >
                        Повернено
                      </Button>

                      <Button
                        color="success"
                        variant="flat"
                        className={"w-full"}
                        onPress={() => handleStatusUpdate(OrderStatus.PACKED)}
                      >
                        Запаковано
                      </Button>

                      <Button
                        color="success"
                        variant="solid"
                        className={"w-full"}
                        onPress={() =>
                          handleStatusUpdate(OrderStatus.DELIVERED)
                        }
                      >
                        Доставлено
                      </Button>
                    </div>
                  </div>

                  <div
                    className={
                      "inline-grid grid-cols-2 auto-rows-max gap-2 p-3"
                    }
                  >
                    <p
                      className={
                        "col-span-2 font-bold my-2 relative " +
                        "after:ml-2 after:top-1/2 after:absolute after:w-full after:h-px after:bg-secondary overflow-hidden"
                      }
                    >
                      Продаж
                    </p>
                    {order.orderItems.map((item: OrderItem) => (
                      <>
                        <p className={"col-span-2 text-center my-2"}></p>
                        <p className={"my-1"}>Артикль товару</p>
                        <p className={"my-1"}>{item.productArticle}</p>
                        <p className={"my-1"}>Назва товару</p>
                        <p className={"my-1"}>{item.productName}</p>
                        <p className={"my-1"}>Назва варіанту</p>
                        <p className={"my-1"}>{item.variantName}</p>
                        <p className={"my-1"}>Ціна на момент продажу</p>
                        <p className={"my-1"}>
                          {item.variantSellingPrice.toString()} UAH
                        </p>
                        <p className={"my-1"}>К-сть</p>
                        <p className={"my-1"}>{item.quantity}</p>
                        <p className={"my-1"}>Зображення</p>
                        <Image
                          src={item.variantImgUrl}
                          alt={""}
                          width={300}
                          height={300}
                          className={"my-1"}
                        />
                        <Divider className={"col-span-2"} />
                      </>
                    ))}
                  </div>
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
        <Toaster />
      </Modal>
    </>
  );
}
