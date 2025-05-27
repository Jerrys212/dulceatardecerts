import { ReactNode } from "react";

type MenuCardProps = {
    icon: ReactNode;
    label: string;
    description: string;
    bgColor: string;
    textColor: string;
};

const DashboardCard = ({ icon, label, description, bgColor, textColor }: MenuCardProps) => {
    return (
        <div className={`h-full rounded-xl shadow-lg overflow-hidden relative ${bgColor} hover:shadow-2xl transition-all duration-300`}>
            <div className="p-6">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${textColor} bg-white bg-opacity-20`}>{icon}</div>
                    <h3 className={`ml-4 text-xl font-bold ${textColor}`}>{label}</h3>
                </div>
                <p className={`mt-4 ${textColor} text-opacity-90 text-sm`}>{description}</p>

                <div className={`mt-6 flex items-center ${textColor}`}>
                    <span className="font-medium">Acceder</span>
                    <svg
                        className={`ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1 ${textColor}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 w-32 h-32 transform translate-x-8 translate-y-8 rounded-full opacity-20 bg-white"></div>
        </div>
    );
};

export default DashboardCard;
