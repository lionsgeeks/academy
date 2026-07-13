import { Clock, ChevronLeft } from "lucide-react";
import { useAppContext } from "@/context/appContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import Card from "../../components/Card";
import Section from "../../components/Section";

const A = "#F4B400";

function polarPoint(cx, cy, radius, angle) {
    const rad = (Math.PI / 180) * angle;
    return {
        x: cx + radius * Math.sin(rad),
        y: cy - radius * Math.cos(rad),
    };
}

function SkillRadar({ data, darkMode }) {
    const size = 360;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = size * 0.34;
    const levels = [0.25, 0.5, 0.75, 1];
    const count = data?.length || 0;

    if (!count) return null;

    const angleStep = 360 / count;

    const gridStroke = darkMode ? "#000000" : "#E5E7EB";
    const labelFill = darkMode ? "#FFFFFF" : "#111827";
    const radarStroke = darkMode ? "#FFD54A" : "#8B6B00";

    const levelPolygons = levels.map((level) => {
        const points = data
            .map((_, i) => {
                const p = polarPoint(cx, cy, maxR * level, i * angleStep);
                return `${p.x},${p.y}`;
            })
            .join(" ");
        return points;
    });

    const valuePoints = data
        .map((item, i) => {
            const p = polarPoint(cx, cy, maxR * (Math.min(item.value, 100) / 100), i * angleStep);
            return `${p.x},${p.y}`;
        })
        .join(" ");

    const axes = data.map((_, i) => {
        const p = polarPoint(cx, cy, maxR, i * angleStep);
        return { x2: p.x, y2: p.y };
    });

    const labels = data.map((item, i) => {
        const p = polarPoint(cx, cy, maxR + 28, i * angleStep);
        return { ...p, text: item.subject };
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" role="img" aria-label="Skill mastery radar">
            {!darkMode &&
                levelPolygons.map((points, i) => (
                    <polygon
                        key={`fill-${i}`}
                        points={points}
                        fill="#FFFFFF"
                        fillOpacity={i === levels.length - 1 ? 1 : 0}
                        stroke="none"
                    />
                ))}

            {levelPolygons.map((points, i) => (
                <polygon
                    key={`grid-${i}`}
                    points={points}
                    fill="none"
                    stroke={gridStroke}
                    strokeWidth={1}
                />
            ))}

            {axes.map((axis, i) => (
                <line
                    key={`axis-${i}`}
                    x1={cx}
                    y1={cy}
                    x2={axis.x2}
                    y2={axis.y2}
                    stroke={gridStroke}
                    strokeWidth={1}
                />
            ))}

            <polygon
                points={valuePoints}
                fill="#F4B400"
                fillOpacity={0.35}
                stroke={radarStroke}
                strokeWidth={4}
            />

            {labels.map((label, i) => (
                <text
                    key={`label-${i}`}
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={labelFill}
                    fontSize={13}
                    fontWeight={600}
                >
                    {label.text}
                </text>
            ))}
        </svg>
    );
}

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
                                <SkillRadar data={skillData} darkMode={darkMode} />
                            </div>

                        </Card>
                    </Section>
                </div>
            </div>


        </div>


    );
}
