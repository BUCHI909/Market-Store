import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // your Sequelize instance

const Order = sequelize.define("Order", {
  seller_id: { type: DataTypes.INTEGER, allowNull: false },
  buyer_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  payment_status: { type: DataTypes.STRING, defaultValue: "pending" },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

export default Order;