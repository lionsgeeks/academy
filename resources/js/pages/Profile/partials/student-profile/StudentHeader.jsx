import { useState } from "react";
import { Clock } from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
} from "recharts";
import { useAppContext } from "@/context/AppContext";
import { ChevronLeft, } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import Card from "../../components/Card";
import Section from "../../components/Section";




const A = "#F4B400";




export default function StudentHeader({ student, s, skillData, onBack }) {

    const { darkMode } = useAppContext();
    const getInitials = useInitials();


    return (
        <div className="rounded-3xl overflow-hidden border bg-gradient-to-b from-[#FFF7DD] via-[#FAF8F3] to-[#F2F2F2] dark:from-[#362e19]
    dark:via-[#24211B]
    dark:to-[#1A1A1A]

    dark:border-[#5C4A13]
    dark:shadow-[0_15px_45px_rgba(0,0,0,.05)]
    dark:text-white">
            <button
                onClick={onBack}
                className="flex items-center ml-3 mt-5  justify-center w-10 h-10 rounded-full bg-[#ffc801] hover:bg-[#ffc801]/50 text-[#080808] transition-all duration-300"
            >
                <ChevronLeft size={25} />
            </button>

            {/* Info */}
            <div className="flex gap-8 px-8 py-8">
                <div className="flex-1">
                    {/* Avatar */}
                    <div className="mt-7">
                        <div className="h-32 w-32 mb-2 overflow-hidden rounded-full border border-black ">
                            <Avatar className="h-32 w-32 border border-neutral-200">
                                <AvatarImage
                                    src={student.avatar}
                                    alt={student.name}
                                    className="object-cover"
                                />

                                <AvatarFallback className="bg-[#F4B400] text-black text-3xl font-bold ">
                                    {getInitials(student.name)}
                                </AvatarFallback>
                            </Avatar>                        </div>
                    </div>
                    <div>

                        <h2 className="text-3xl font-bold text-gray-900  dark:text-white">
                            {student.name}
                        </h2>

                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {student.email}
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Promo {student.promo} • {student.type} {student.class}
                            </span>

                            <span className="w-1 h-1 rounded-full bg-gray-300" />

                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold text-black  "
                                style={{ background: A }}
                            >
                                {student.status}
                            </span>
                        </div>



                        {/* NEW */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
                            {[
                                { label: "XP", value: s.xp, color: "text-[#F4B400]" },
                                { label: "Level", value: s.level, color: "text-neutral-900" },
                                { label: "Lessons", value: s.lessons, color: "text-neutral-900" },
                                { label: "Exercises", value: s.exercises, color: "text-neutral-900" },
                                { label: "Quizzes", value: s.quizzes, color: "text-neutral-900" },
                                { label: "Projects", value: s.projects, color: "text-neutral-900" },
                                { label: "Badges", value: s.badges, color: "text-neutral-900" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                        {stat.label}
                                    </span>
                                    <span className={`text-lg font-semibold ${stat.color === "text-neutral-900"
                                        ? "text-neutral-900 dark:text-white"
                                        : stat.color
                                        }`}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-100  dark:border-neutral-700 flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
                            <Clock size={12} />
                            <span>Last login : {s.last_active}</span>
                        </div>

                    </div>


                </div>

                <div className="w-[420px] shrink-0">
                    <Section title="Skill Mastery">
                        <Card
                            className="p-6  !bg-transparent flex justify-center items-center border border-[#E8D28A] "

                        >
                            <div className="w-[360px] h-[360px]">

                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="68%"
                                        data={skillData}

                                    >
                                        <PolarGrid
                                            gridType="polygon"
                                            fill={darkMode ? "transparent" : "#FFFFFF"}
                                            fillOpacity={darkMode ? 0 : 1}
                                            stroke={darkMode ? "#000000" : "#E5E7EB"}
                                            radialLines={true}
                                        />

                                        <PolarAngleAxis
                                            dataKey="subject"
                                            tick={(props) => {
                                                const { payload, x, y, textAnchor } = props;

                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        textAnchor={textAnchor}
                                                        fill={darkMode ? "#FFFFFF" : "#111827"}
                                                        fontSize={13}
                                                        fontWeight={600}
                                                        dominantBaseline="middle"
                                                    >
                                                        {payload.value}
                                                    </text>
                                                );
                                            }}
                                        />

                                        <PolarRadiusAxis
                                            domain={[0, 100]}
                                            tick={false}
                                            axisLine={false}
                                            stroke={darkMode ? "#000000" : "#E5E7EB"}
                                        />

                                        <Tooltip
                                            cursor={{ fill: "rgba(244,180,0,.06)" }}
                                            contentStyle={{
                                                background: darkMode ? "#1F1F1F" : "#FFFFFF",
                                                border: `1px solid ${darkMode ? "#3A3A3A" : "#F3F4F6"}`,
                                                color: darkMode ? "#FFFFFF" : "#111827",
                                                borderRadius: "10px",
                                            }}
                                            formatter={(value) => [`${value}%`, "Mastery"]}
                                        />

                                        <Radar
                                            dataKey="value"
                                            stroke={darkMode ? "#FFD54A" : "#8B6B00"}
                                            fill="#F4B400"
                                            fillOpacity={0.35}
                                            strokeWidth={4}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>

                            </div>

                        </Card>
                    </Section>
                </div>
            </div>


        </div>


    );
}







