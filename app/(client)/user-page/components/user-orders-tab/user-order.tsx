export function UserOrder(order: any) {
  return (
    <div
      className={
        "min-w-[200px] w-full p-4 h-[300px] shadow-small rounded-sm grid grid-cols-2"
      }
    >
      <p>Дата</p>
      <p>{order.createdAt.toLocaleString()}</p>
      <p>Сума</p>
      <p>{order.total} UAH</p>
      <p>Статус</p>
      <p>{order.status}</p>
    </div>
  );
}
