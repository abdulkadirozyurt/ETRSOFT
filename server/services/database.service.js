import Account from "../models/account.model.js";
import { getDataFromApi } from "./external-api.service.js";

const fixNumberFields = (item) => {
  const numberFields = ["borc", "alacak", "borc_sistem", "alacak_sistem", "borc_doviz", "alacak_doviz", "borc_islem_doviz", "alacak_islem_doviz"];
  for (const field of numberFields) {
    item[field] = item[field] === "" || item[field] === undefined ? null : Number(item[field]);
  }
  return item;
};

const hasChanges = (existingData, newData) => {
  const excludeFields = ["createdAt", "updatedAt"];

  for (const field of Object.keys(newData)) {
    if (excludeFields.includes(field)) continue;

    const existingValue = existingData[field] ?? null;
    const newValue = newData[field] ?? null;

    if (existingValue !== newValue) {
      return true;
    }
  }

  return false;
};

const upsertAccount = async (item) => {
  const existing = await Account.findOne({ where: { id: item.id } });
  if (existing) {
    if (hasChanges(existing, item)) {
      await existing.update({ ...item });
      return "updated";
    }
    return "unchanged";
  } else {
    await Account.create({ ...item });
    return "created";
  }
};

export const syncData = async () => {
  try {
    const apiData = await getDataFromApi();

    for (const item of apiData) {
      await upsertAccount(fixNumberFields(item));
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAccountsFromDatabase = async () => {
  try {
    return await Account.findAll({ order: [["hesap_kodu", "ASC"]] });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getDataHierarchical = async () => {
  const data = await getAccountsFromDatabase();
  const accountsMap = new Map();
  const childrenMap = new Map();

  for (const hesap of data) {
    accountsMap.set(hesap.id, { ...hesap.toJSON() });
    if (hesap.ust_hesap_id) {
      if (!childrenMap.has(hesap.ust_hesap_id)) childrenMap.set(hesap.ust_hesap_id, []);
      childrenMap.get(hesap.ust_hesap_id).push(hesap.id);
    }
  }

  // Eksik ana hesaplar (120, 153, 191 ...)
  const virtualMainAccounts = new Set();
  for (const hesap of data) {
    if (hesap.ust_hesap_id && !accountsMap.has(hesap.ust_hesap_id)) {
      virtualMainAccounts.add(hesap.ust_hesap_id);
    }
  }

  for (const mainId of virtualMainAccounts) {
    accountsMap.set(mainId, {
      id: mainId,
      hesap_kodu: mainId.toString(),
      hesap_adi: `ANA HESAP ${mainId}`,
      tipi: "MAIN",
      ust_hesap_id: null,
      borc: 0,
      alacak: 0,
    });
  }

  // Ana hesapların(120, 153, 191 ...) toplamları
  for (const hesap of data) {
    if (hesap.ust_hesap_id && virtualMainAccounts.has(hesap.ust_hesap_id)) {
      const mainAccount = accountsMap.get(hesap.ust_hesap_id);
      mainAccount.borc += hesap.borc || 0;
      mainAccount.alacak += hesap.alacak || 0;
    }
  }

  const buildHierarchy = (hesapId) => {
    const hesap = accountsMap.get(hesapId);
    const children = childrenMap.get(hesapId);
    const result = {
      ...hesap,
      borc: hesap.borc || 0,
      alacak: hesap.alacak || 0,
    };

    if (children && children.length > 0) {
      result.children = children.map(buildHierarchy).sort((a, b) => a.hesap_kodu.localeCompare(b.hesap_kodu));
    }

    return result;
  };

  // Ana hesapları bul ve hiyerarşiyi oluştur
  return Array.from(accountsMap.values())
    .filter((hesap) => !hesap.ust_hesap_id)
    .map((hesap) => buildHierarchy(hesap.id))
    .sort((a, b) => a.hesap_kodu.localeCompare(b.hesap_kodu));
};
