const A = "#F4B400";
const GAP = 3;
import Card from "../../components/Card";

const darkClassMap = {
    0: "dark:!bg-[#2A2A2A]",
3: "dark:!bg-[#B38F1A]",
    1: "dark:!bg-[#6A5815]",
    2: "dark:!bg-[#8B7317]",
    
    4: "dark:!bg-yellow-800",

};
export default function Activitywakatime({ grid, monthLabels, heatColor }) {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <Card className="w-full rounded-3xl p-8 border border-neutral-200   dark:border-neutral-700 dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-semibold">Activity Heatmap</h3>
                    <p className="text-sm text-neutral-400 mt-1">Last 365 Days</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                        <div key={level}         className={`w-4 h-4 rounded ${darkClassMap[level] || ""}`} style={{ background: heatColor(level) }} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <div className="flex gap-3 w-full">

                <div className="flex flex-col shrink-0" style={{ paddingTop: "20px", gap: `${GAP}px` }}>
                    {dayLabels.map((label, i) => (
                        <div
                            key={label}
                            className="text-xs text-neutral-400 text-right pr-2"
                            style={{ height: "13px", lineHeight: "13px", visibility: i % 2 === 0 ? "hidden" : "visible" }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col w-full flex-1 min-w-0">
                    {/* Month labels */}
                    <div
                        className="grid mb-2"
                        style={{ gridTemplateColumns: `repeat(53, 1fr)`, columnGap: `${GAP}px` }}                        >
                        {monthLabels.map(month => (
                            <div
                                key={month.name}
                                style={{ gridColumnStart: month.week + 1 }}
                                className="text-xs text-neutral-400"
                            >
                                {month.name}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(53, 1fr)`,
                            gridAutoRows: "1fr",
                            gap: `${GAP}px`,

                        }}
                    >
                        {grid.map((day) => (


                            <div
                                key={day.date}
                                title={`${day.date} — ${Math.round((day.seconds || 0) / 60)} mins`}
                                style={{
                                    gridColumnStart: day.col + 1,
                                    gridRowStart: day.row + 1,
                                    background: heatColor(day.level),
                                    aspectRatio: "1 / 1",
                                    width: "100%",
                                }}
                                className={`rounded-[3px] transition-all duration-200 hover:scale-110 cursor-pointer ${darkClassMap[day.level] || ""}`}
                            />

                        ))}
                    </div>
                </div>

            </div>


        </Card>
    );
}