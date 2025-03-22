import { DataTypes } from "sequelize";
import { sequelize } from "../database/connect.js";

const PaymentHistory = sequelize.define('PaymentHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    workspace_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'success', 'cancelled'),
        allowNull: false
    },
    order_code: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'payment_history',
    timestamps: false
});

export default PaymentHistory;