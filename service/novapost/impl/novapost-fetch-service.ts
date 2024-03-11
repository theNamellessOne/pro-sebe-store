"use server";

import { env, exit } from "process";

const API_KEY = env.NOVA_POST_API_KEY;

if (!API_KEY || API_KEY === "") {
  console.log("Відсутній API ключ Нової Пошти!");
  exit();
}

export async function _calculateApproximateDeliverycost(
  cost: number,
  recipientRef: string,
  deliveryMethod: "WarehouseWarehouse" | "WarehouseDoors",
) {
  if (recipientRef.length != 36) return;

  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: "",
      modelName: "InternetDocument",
      calledMethod: "getDocumentPrice",
      methodProperties: {
        CitySender: "e221d642-391c-11dd-90d9-001a92567626",
        CityRecipient: recipientRef,
        Weight: "2",
        ServiceType: deliveryMethod,
        Cost: cost,
        CargoType: "Parcel",
        SeatsAmount: "1",
        RedeliveryCalculate: {
          CargoType: "Money",
          Amount: cost,
        },
      },
    }),
  });

  return response.json();
}

export async function _fetchWarehouseByCityRef(
  cityRef: string,
  findBy: string,
) {
  if (cityRef?.length !== 36) return [];

  const postalDivisionsResponse = await fetch(
    "https://api.novaposhta.ua/v2.0/json/",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        apiKey: "",
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef,
          FindByString: findBy,
          TypeOfWarehouseRef: "841339c7-591a-42e2-8233-7a0a00f0ed6f",
        },
      }),
    },
  );

  const cargoDivisionsResponse = await fetch(
    "https://api.novaposhta.ua/v2.0/json/",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        apiKey: "",
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef,
          FindByString: findBy,
          TypeOfWarehouseRef: "9a68df70-0267-42a8-bb5c-37f427e36ee4",
        },
      }),
    },
  );

  let divisions: any[] = [];
  const cargoDivisionsJson = await cargoDivisionsResponse.json();
  const postalDivisionsJson = await postalDivisionsResponse.json();

  if (cargoDivisionsJson.success)
    divisions = [...divisions, ...cargoDivisionsJson.data];
  if (postalDivisionsJson.success)
    divisions = [...divisions, ...postalDivisionsJson.data];

  return divisions.map((division: any) => ({
    Description: division.Description,
    Number: division.Number,
  }));
}

export async function _searchSettlement(settlementName: string) {
  if (settlementName.length < 3) return [];

  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      apiKey: "",
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: {
        CityName: settlementName,
        Limit: "30",
        Page: "1",
      },
    }),
  });

  const responseJson = await response.json();

  if (!responseJson.success) return [];

  return responseJson.data[0].Addresses.filter(
    (address: any) => address.Warehouses > 0,
  ).map((address: any) => ({
    DeliveryCity: address.DeliveryCity,
    Present: address.Present,
  }));
}
