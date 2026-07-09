import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import Card from "../../components/Card";
import Section from "../../components/Section";


const xpBreakdown = [
    {
        name: "Quizzes",
        value: 2400,
        color: "#F4B400",
    },
    {
        name: "Exercises",
        value: 1800,
        color: "#D9A000",
    },
    {
        name: "Projects",
        value: 3100,
        color: "#A97800",
    },
    {
        name: "Challenges",
        value: 1057,
        color: "#E5E7EB",
    },
];
const velocityData = [
    { week: "WK 01", xp: 60 },
    { week: "WK 02", xp: 68 },
    { week: "WK 03", xp: 66 },
    { week: "WK 04", xp: 82 },
    { week: "WK 05", xp: 81 },
    { week: "WK 06", xp: 92 },
];

export default function LearningVelocity() {
    return (


        <section className="flex items-stretch gap-10">
            <div className="w-[700px] shrink-0">
                <Card className="h-full p-6 rounded-3xl border border-neutral-200 dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206] dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                            Learning Velocity
                        </h3>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#F4B400]/40 bg-[#FFF9E8] dark:bg-[#3A2E08]">
                            <TrendingUp size={15} color="#F4B400" />
                            <span className="text-sm font-semibold text-[#C49000] dark:text-[#F4B400]">
                                +24% vs Last Month
                            </span>
                        </div>
                    </div>

                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData}>
                                <defs>
                                    <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#F4B400" stopOpacity={0.30} />
                                        <stop offset="100%" stopColor="#F4B400" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: "#9CA3AF", fontSize: 13 }}
                                    tickLine={false}
                                    axisLine={false}
                                />

                                <YAxis hide />

                                <Tooltip
                                    cursor={false}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "1px solid #F3F4F6",
                                        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="xp"
                                    stroke="#C49000"
                                    strokeWidth={3}
                                    fill="url(#velocityGradient)"
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                        fill: "#F4B400",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="w-[420px]">




                {/* XP */}
                <Card className="h-full p-6 rounded-3xl border border-neutral-200 flex flex-col dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206]   ">
                    <h3 className="text-base font-semibold dark:text-white  mb-5">
                        XP Breakdown
                    </h3>

                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={xpBreakdown}
                                dataKey="value"
                                innerRadius={55}
                                outerRadius={78}
                                paddingAngle={3}
                            >
                                {xpBreakdown.map((item, index) => (
                                    <Cell
                                        key={index}
                                        fill={item.color}
                                    />
                                ))}
                            </Pie>

                            <Tooltip formatter={(v) => [`${v} XP`]} />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-3 mt-4">
                        {xpBreakdown.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: item.color }}
                                    />
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {item.name}
                                    </span>
                                </div>

                                <span className="font-semibold  dark:text-white">
                                    {item.value} XP
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>

        </section>
    );
}













