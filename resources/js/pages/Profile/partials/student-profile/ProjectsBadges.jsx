import Card from "../../components/Card";
import Section from "../../components/Section";



const A = "#F4B400";
function getInitials(name = "") {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}


export default function ProjectsBadges() {
    const projects = [
        { name: "Landing Page", score: 92, date: "Jan 12" },
        { name: "Portfolio", score: 95, date: "Jan 18" },
        { name: "React Dashboard", score: 88, date: "Feb 03" },
        { name: "Blog App", score: 79, date: "Feb 20" },
    ];

    const badges = [
        { icon: "🔥", label: "30 Day Streak" },
        { icon: "🏆", label: "Quiz Master" },
        { icon: "⚡", label: "Fast Learner" },
        { icon: "💎", label: "XP Hunter" },
        { icon: "🚀", label: "Challenge Champ" },
        { icon: "🎯", label: "Perfect Score" },
    ];


    return (
        <Section title="Projects · Badges">
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5 dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206] 
           dark:border dark:border-neutral-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Projects</p>
                    <div className="flex flex-col divide-y divide-gray-50 dark:divide-neutral-700">
                        {projects.map(({ name, score, date }) => (
                            <div key={name} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-800 dark:text-white">{name}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 dark:text-gray-500">{date}</p>
                                </div>
                                <span
                                    className={`text-xs font-bold px-2.5 py-1 rounded-full
        ${score >= 90
                                            ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                            : score >= 75
                                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                                                : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                        }
    `}
                                >
                                    {score}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5 dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206]   ">
                    <p className="text-sm font-semibold text-gray-800 mb-3 dark:text-white      ">Badges Earned</p>
                    <div className="grid grid-cols-3 gap-2">
                        {badges.map(({ icon, label }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl py-3 dark:bg-[#0A0A0A] dark:border-none px-2"
                            >
                                <span className="text-2xl">{icon}</span>
                                <p className="text-[10px] text-center text-amber-800 font-medium leading-tight">{label}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </Section>
    );
}








