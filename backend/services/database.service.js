import Account from "../models/account.model.js";
import { getDataFromApi } from "./external-api.service.js";
import { Sequelize } from "sequelize";

const getAccountsData = async () => {
  return await getDataFromApi();
};

// const accountsData = getAccountsData();

const fixNumberfields = async (item) => {
  const numberFields = ["borc", "alacak", "borc_sistem", "alacak_sistem", "borc_doviz", "alacak_doviz", "borc_islem_doviz", "alacak_islem_doviz"];
  numberFields.forEach((field) => {
    if (item[field] === "" || item[field] === undefined) {
      item[field] = null;
    } else {
      item[field] = Number(item[field]);
    }
  });

  return item;
};

const saveToDatabase = async (accountsData) => {
  try {
    for (const item of accountsData) {
      fixNumberfields(item);
      const existingAccount = await Account.findOne({
        where: {
          id: item.id,
        },
      });
      if (existingAccount) {
        await existingAccount.update({
          hesap_adi: item.hesap_adi,
          tipi: item.tipi,
          ust_hesap_id: item.ust_hesap_id,
          borc: item.borc,
          alacak: item.alacak,
          borc_sistem: item.borc_sistem,
          alacak_sistem: item.alacak_sistem,
          borc_doviz: item.borc_doviz,
          alacak_doviz: item.alacak_doviz,
          borc_islem_doviz: item.borc_islem_doviz,
          alacak_islem_doviz: item.alacak_islem_doviz,
          birim_adi: item.birim_adi,
          bakiye_sekli: item.bakiye_sekli,
          aktif: item.aktif,
          dovizkod: item.dovizkod,
        });
      } else {
        await Account.create({
          id: item.id,
          hesap_kodu: item.hesap_kodu,
          hesap_adi: item.hesap_adi,
          tipi: item.tipi,
          ust_hesap_id: item.ust_hesap_id,
          borc: item.borc,
          alacak: item.alacak,
          borc_sistem: item.borc_sistem,
          alacak_sistem: item.alacak_sistem,
          borc_doviz: item.borc_doviz,
          alacak_doviz: item.alacak_doviz,
          borc_islem_doviz: item.borc_islem_doviz,
          alacak_islem_doviz: item.alacak_islem_doviz,
          birim_adi: item.birim_adi,
          bakiye_sekli: item.bakiye_sekli,
          aktif: item.aktif,
          dovizkod: item.dovizkod,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const syncData = async () => {
  try {
    const apiData = await getAccountsData();
    await saveToDatabase(apiData);
  } catch (error) {}
};

export const getAccountsFromDatabase = async () => {
  try {
    const accounts = await Account.findAll({
      order: [["hesap_kodu", "ASC"]],
    });
    return accounts;
  } catch (error) {
    console.log(error);
  }
};

export const getAccountsFromDatabaseTest = async () => {
  try {
    const accounts = await Account.findAll({
      attributes: [
        "id",
        "hesap_kodu",
        "hesap_adi",
        "tipi",
        "ust_hesap_id",
        [Sequelize.fn("SUM", Sequelize.col("borc")), "toplam_borc"],
        [Sequelize.fn("SUM", Sequelize.col("alacak")), "toplam_alacak"],
      ],
      group: ["id", "hesap_kodu", "hesap_adi", "tipi", "ust_hesap_id"],
      order: [["hesap_kodu", "ASC"]],
    });
    return accounts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDataHierarchical = async () => {
  const data = await getAccountsFromDatabase();

  const accountsMap = new Map(); // gelen hesapları tutacak yapı
  const childrenMap = new Map(); // her bir hesabın alt hesaplarını tutacak olan yapı (varsa)   {id:, []}

  // gelen datayı gez
  data.forEach((hesap) => {
    // hesapları id ile map'e ekle
    accountsMap.set(hesap.id, {
      ...hesap.toJSON(),
    });

    // ilgili hesabın üst'ü varsa
    if (hesap.ust_hesap_id) {
      // bu üst hesap, childrenMap'te yoksa
      if (!childrenMap.has(hesap.ust_hesap_id)) {
        // childrenMap'te yeni bir children array'i oluştur
        childrenMap.set(hesap.ust_hesap_id, []);
      }
      // hesabı childrenMap'te ilgili üst hesabın children array'ine ekle
      childrenMap.get(hesap.ust_hesap_id).push(hesap.id);
    }
  });

  // Virtual ana hesapları oluştur (120, 153, 191, vs.)
  const virtualMainAccounts = new Set();
  data.forEach((hesap) => {
    // en üst ana hesaplar data içinde gelmiyor,
    // ondan dolayı kendimiz oluşturuyoruz kategori gibi
    if (hesap.ust_hesap_id && !accountsMap.has(hesap.ust_hesap_id)) {
      virtualMainAccounts.add(hesap.ust_hesap_id);
    }
  });

  // Virtual ana hesapları accountsMap'e ekle
  virtualMainAccounts.forEach((mainId) => {
    accountsMap.set(mainId, {
      id: mainId,
      hesap_kodu: mainId.toString(),
      hesap_adi: `ANA HESAP ${mainId}`,
      tipi: "MAIN",
      ust_hesap_id: null,
      borc: 0,
      alacak: 0,
    });
  });

  // Virtual ana hesapların toplamlarını hesapla
  data.forEach((hesap) => {
    if (hesap.ust_hesap_id && virtualMainAccounts.has(hesap.ust_hesap_id)) {
      const mainAccount = accountsMap.get(hesap.ust_hesap_id);
      mainAccount.borc += hesap.borc || 0;
      mainAccount.alacak += hesap.alacak || 0;
    }
  });

  // Hiyerarşik yapıyı oluştur
  const buildHierarchy = (hesapId) => {
    const hesap = accountsMap.get(hesapId);
    const children = childrenMap.get(hesapId);

    const result = {
      ...hesap,
      key: hesap.id,
      borc: hesap.borc || 0,
      alacak: hesap.alacak || 0,
    };

    if (children && children.length > 0) {
      result.children = children.map((childId) => buildHierarchy(childId)).sort((a, b) => a.hesap_kodu.localeCompare(b.hesap_kodu));
    }
    // Boş children array'ini ekleme - sadece gerçekten children varsa ekle

    return result;
  };

  // Root hesapları bul (ust_hesap_id null olanlar veya virtual ana hesaplar)
  const rootAccounts = Array.from(accountsMap.values())
    .filter((hesap) => !hesap.ust_hesap_id)
    .map((hesap) => buildHierarchy(hesap.id))
    .sort((a, b) => a.hesap_kodu.localeCompare(b.hesap_kodu));

  return rootAccounts;
};
