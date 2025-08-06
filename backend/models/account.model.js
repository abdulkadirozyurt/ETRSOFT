import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export default class Account extends Model {}
Account.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    hesap_kodu: DataTypes.STRING,
    hesap_adi: DataTypes.STRING,
    tipi: DataTypes.STRING,
    ust_hesap_id: DataTypes.INTEGER,
    borc: DataTypes.DOUBLE,
    alacak: DataTypes.DOUBLE,
    borc_sistem: DataTypes.DOUBLE,
    alacak_sistem: DataTypes.DOUBLE,
    borc_doviz: DataTypes.DOUBLE,
    alacak_doviz: DataTypes.DOUBLE,
    borc_islem_doviz: DataTypes.FLOAT,
    alacak_islem_doviz: DataTypes.FLOAT,
    birim_adi: DataTypes.STRING,
    bakiye_sekli: DataTypes.INTEGER,
    aktif: DataTypes.INTEGER,
    dovizkod: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "accounts",
  }
);
