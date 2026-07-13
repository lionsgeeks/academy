
import { useState, useEffect } from "react";
import { ChevronLeft, } from "lucide-react";
import LearningJourney from "./partials/student-profile/LearningJourney";
import Activitywakatime from "./partials/student-profile/Activitywakatime";
import { Link } from "@inertiajs/react";
import { useAppContext } from "@/context/appContext";
import StudentHeader from "./partials/student-profile/StudentHeader";
import LearningHealth from "./partials/student-profile/LearningHealth";
import VelocityLearning from "./partials/student-profile/VelocityLearning";
import ProjectsBadges from "./partials/student-profile/ProjectsBadges";
import QuizExerciseHistory from "./partials/student-profile/QuizExerciseHistory";

const A = "#F4B400";
const AD = "#c49000";


export default function StudentProfile({ student, onBack }) {
    const { darkMode } = useAppContext();
    console.log(student);
    const s = {
        xp: student.xp ?? "8,357",
        level: student.level ?? 14,
        streak: student.streak ?? 28,
        study_time: student.study_time ?? "284h",
        lessons: student.lessons ?? 642,
        exercises: student.exercises ?? 87,
        quizzes: student.quizzes ?? 52,
        projects: student.projects ?? 4,
        badges: student.badges ?? 24,
        lhi: student.lhi ?? 97,
        consistency: student.consistency ?? 95,
        engagement: student.engagement ?? 98,
        dropout_risk: student.dropout_risk ?? 5,
        coding_today: student.coding_today ?? "2h 14m",
        coding_week: student.coding_week ?? "12h 43m",
        coding_month: student.coding_month ?? "48h 12m",
        coding_total: student.coding_total ?? "284h",
        promotion: student.promotion ?? "Promo 5 – Coding 2",
        last_active: student.last_active ?? "21/06/2026 14:25:21",
        global_rank: student.global_rank ?? null,
        coding_hours: student.coding_hours ?? "551.6h",
        posts: student.posts ?? 0,
    };



    const [waka, setWaka] = useState(null);
    const activity = Array.isArray(waka) ? waka : [];

    useEffect(() => {
        console.log("Student ID:", student.id);

        if (!student.id) return;

        fetch(`/wakatime/${student.id}`)
            .then(res => {
                console.log("Status:", res.status);
                console.log("OK:", res.ok);
                return res.json();
            })
            .then(data => {
                console.log("DATA:", data);
                setWaka(data);
            })
            .catch(err => {
                console.error(err);
            });

    }, [student.id]);

    const monthLabels = [
        { name: "Jul", week: 0 },
        { name: "Aug", week: 4 },
        { name: "Sep", week: 8 },
        { name: "Oct", week: 13 },
        { name: "Nov", week: 17 },
        { name: "Dec", week: 22 },
        { name: "Jan", week: 26 },
        { name: "Feb", week: 31 },
        { name: "Mar", week: 35 },
        { name: "Apr", week: 40 },
        { name: "May", week: 44 },
        { name: "Jun", week: 49 },
    ];


    const heatColor = (level) => {
        switch (level) {
            case 0: return "#F5F5F4";
            case 1: return "#FEF3C7";
            case 2: return "#FCD34D";
            case 3: return "#F4B400";
            case 4: return "#B45309";
            default: return "#F5F5F4";
        }
    };

    const roadmap = [
        { name: "HTML City", pct: 100 },
        { name: "CSS Island", pct: 100 },
        { name: "JavaScript Kingdom", pct: 85 },
        { name: "React Galaxy", pct: 20 },
        { name: "Backend Empire", pct: 0 },
    ];

    const skillData = [
        { subject: "Frontend", value: 85 },
        { subject: "Backend", value: 78 },
        { subject: "Database", value: 82 },
        { subject: "AI", value: 40 },
        { subject: "Design", value: 75 },
    ];


    const startDate = activity.length > 0 ? new Date(activity[0].date) : new Date();

    function getLevel(seconds) {
        if (!seconds || seconds === 0) return 0;
        if (seconds < 1800) return 1;
        if (seconds < 3600) return 2;
        if (seconds < 7200) return 3;
        return 4;
    }

    const grid = activity.map((day) => {
        const diffDays = Math.floor(
            (new Date(day.date) - startDate) / (1000 * 60 * 60 * 24)
        );
        return {
            ...day,
            col: Math.floor(diffDays / 7),
            row: new Date(day.date).getDay(),
            level: getLevel(day.seconds),
        };
    });

    return (

        <div className="flex flex-col gap-8 pb-16 mt-8 px-2 md:px-4 lg:px-8 ">

            <StudentHeader student={student} s={s} skillData={skillData} onBack={onBack} />


            <Activitywakatime
                grid={grid}
                monthLabels={monthLabels}
                heatColor={heatColor}
            />

            <LearningJourney />


            <LearningHealth student={student} s={s} skillData={skillData} />

            <VelocityLearning student={student} s={s} skillData={skillData} />

            <ProjectsBadges student={student} s={s} skillData={skillData} />

            <QuizExerciseHistory student={student} s={s} skillData={skillData} />

        </div>
    );
}
