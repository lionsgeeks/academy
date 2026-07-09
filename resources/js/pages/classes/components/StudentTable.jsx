import { useState } from "react";
import { router } from "@inertiajs/react";
import StudentProfile from "../../Profile/[id]";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";



export default function StudentTable({ students = [], coach, onSelectStudent }) {
    const [search, setSearch] = useState("");
    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    );


    const getInitials = useInitials();


    return (

        <>
            <div className="flex items-center justify-between mb-6 ">

                <div className="mb-2 flex justify-center">

                    <div
                        className="
    h-[80px] w-[1150px]
    rounded-3xl
    border border-[#ECE6D8] dark:border-neutral-700
    bg-gradient-to-r from-[#FFF8E5] via-[#FAF8F3] to-[#F4F4F2]
    dark:bg-none
    dark:bg-gradient-to-r
    dark:from-[#1B1B1B]
    dark:via-[#181818]
    dark:to-[#121212]
    px-6 py-4
    shadow-[0_15px_45px_rgba(0,0,0,.05)]
  "
                    >
                        <div className="flex items-center justify-between h-full">

                            {/* LEFT */}
                            <div className="flex items-center gap-6">

                                {/* Active Roster */}
                                <div>
                                    <p className="mt-1 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                        Classroom
                                    </p>



                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        {filteredStudents.length} Students
                                    </p>
                                </div>

                                <div className="h-10 w-px bg-neutral-200" />

                                {/* Coach */}
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-400 font-semibold dark:text-neutral-400">
                                        Coach
                                    </p>

                                    <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                                        {coach}
                                    </p>
                                </div>

                            </div>

                            {/* RIGHT */}
                            <div className="relative w-[700px]">

                                <Search
                                    size={15}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                                />

                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search students..."
                                    className="
                h-10
                w-full
                rounded-xl
                border
                border-[#E8E1D1]
                bg-white
                pl-10
                pr-4
                text-xs
                placeholder:text-neutral-400
                outline-none
                transition
                focus:border-[#F4B400]
                focus:ring-2
                focus:ring-[#F4B400]/15
                dark:focus:border-[#FBBF24]
                dark:placeholder:text-neutral-500
                dark:focus:ring-[#FBBF24]/15
                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-neutral-100
            "
                                />

                            </div>

                        </div>

                    </div>





                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-[#e8e0d0] dark:border-neutral-800">
                        {["Student", "Status", "Current Module", "Progress", "Actions"].map((h, i) => (
                            <th
                                key={h}
                                className={`pb-3 text-[11px] font-semibold tracking-widest text-[#aaa] dark:text-neutral-500 uppercase ${i === 4 ? "text-right" : "text-left"
                                    }`}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((s) => {
                        const online = s.status === "Online";
                        return (
                            <tr
                                key={s.id}
                                onClick={() => onSelectStudent(s)}
                                className="border-b border-[#f0ebe0] last:border-0 cursor-pointer dark:border-neutral-800 dark:hover:bg-neutral-900/50 hover:bg-neutral-50"
                            >
                                {/* Student */}
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9 border border-black">
                                            <AvatarImage
                                                src={s.avatar}
                                                alt={s.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-[#F4B400] text-black text-[12px] font-bold ">
                                                {getInitials(s.name)}
                                            </AvatarFallback>
                                        </Avatar>                        <div>
                                            <p className="text-sm font-bold text-black dark:text-white">{s.name}</p>
                                            <p className="text-xs text-[#aaa] dark:text-neutral-400">{s.email}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${online
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                            : "bg-gradient-to-r from-[#FFF8E5] via-[#FAF8F3] to-[#F4F4F2] text-neutral-700 dark:bg-none dark:bg-[#ffc801cb] dark:text-black"
                                            }`}
                                    >
                                        {s.status}
                                    </span>
                                </td>

                                {/* Module */}
                                <td className="text-sm text-[#3a3a3a]">{s.module}</td>

                                {/* Progress */}
                                <td>
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex-1 h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${s.progress}%`,
                                                    background: online ? "#C9A84C" : "#aaa",
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-black w-9">
                                            {s.progress}%
                                        </span>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="text-right">
                                    <button className="text-[#aaa] hover:text-black transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {filteredStudents.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-12 text-sm text-[#aaa]">
                                No students found
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </>
    );
}

