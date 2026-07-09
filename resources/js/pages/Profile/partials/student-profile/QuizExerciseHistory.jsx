import { Link } from "@inertiajs/react";
import Card from "../../components/Card";
import Section from "../../components/Section";
const A = "#F4B400";


export default function QuizExerciseHistory() {
    const quizzes = [
        { name: "HTML Basics", score: 100, date: "Jan 10", passed: true },
        { name: "CSS Flexbox", score: 90, date: "Jan 14", passed: true },
        { name: "JS Functions", score: 80, date: "Jan 25", passed: true },
        { name: "JS Algorithms", score: 55, date: "Feb 02", passed: false },
        { name: "React Hooks", score: 88, date: "Feb 10", passed: true },
    ];

    const exercises = [
        { name: "Variables", result: "Completed", date: "Jan 13" },
        { name: "Loops", result: "Completed", date: "Jan 15" },
        { name: "Arrays", result: "Completed", date: "Jan 17" },
        { name: "DOM Manipulation", result: "Completed", date: "Jan 22" },
        { name: "Async / Await", result: "Failed", date: "Feb 01" },
    ];
    return (
        <Section title="Quiz & Exercise History">
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-5 dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206]">
                    <p className="text-sm font-semibold text-gray-800 mb-4 dark:text-white">Quiz History</p>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-50 text-gray-400 dark:text-gray-400 dark:border-neutral-700">
                                <th className="text-left pb-2 font-medium">Quiz</th>
                                <th className="text-center pb-2 font-medium">Score</th>
                                <th className="text-center pb-2 font-medium">Date</th>
                                <th className="text-center pb-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-neutral-700">
                            {quizzes.map(({ id, name, score, date, passed }) => (
                                <tr key={name}>

                                    <td className="py-2.5">
                                        <Link
                                            href={`/admin/quizzes/${id}`}
                                            className="font-medium text-[#000000] hover:text-[#ffc801] hover:underline transition dark:text-white dark:hover:text-[#ffc801]"
                                        >
                                            {name}
                                        </Link>
                                    </td>



                                    <td
                                        className="py-2.5 text-center font-bold"
                                        style={{ color: score >= 80 ? "#15803D" : "#B91C1C" }}
                                    >
                                        {score}%
                                    </td>
                                    <td className="py-2.5 text-center text-gray-400">{date}</td>
                                    <td className="py-2.5 text-center">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${passed ? "bg-green-50 text-green-700  dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                                                }`}
                                        >
                                            {passed ? "Passed" : "Failed"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Card className="p-5 dark:bg-gradient-to-br
        dark:from-[#19160D]
        dark:via-[#14130F]
        dark:to-[#2A2206]">
                    <p className="text-sm font-semibold text-gray-800 mb-4 dark:text-white">Exercise History</p>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-50 text-gray-400 dark:text-gray-400 dark:border-neutral-700">
                                <th className="text-left pb-2 font-medium">Exercise</th>
                                <th className="text-center pb-2 font-medium">Result</th>
                                <th className="text-center pb-2 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-neutral-700">
                            {exercises.map(({ id, name, result, date }) => (
                                <tr key={name}>
                                    <td className="py-2.5">
                                        <Link
                                            href={`/admin/exercises/${id}`}
                                            className="font-medium text-[#000000] hover:text-[#ffc801] hover:underline transition dark:text-white dark:hover:text-[#ffc801]"
                                        >
                                            {name}
                                        </Link>
                                    </td>
                                    <td className="py-2.5 text-center">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${result === "Completed" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                                                }`}
                                        >
                                            {result}
                                        </span>
                                    </td>
                                    <td className="py-2.5 text-center text-gray-400">{date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </Section>
    );
}
