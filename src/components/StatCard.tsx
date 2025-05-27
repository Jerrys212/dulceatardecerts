import React, { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number;
    iconColor?: string;
    valueColor?: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, iconColor = "text-blue-500", valueColor = "text-gray-900", className = "" }) => {
    return (
        <div className={`bg-gray-50 rounded-lg p-4 border border-gray-100 ${className}`}>
            <div className="flex items-center">
                <div className={iconColor}>{icon}</div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className={`text-xl font-semibold ${valueColor}`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
