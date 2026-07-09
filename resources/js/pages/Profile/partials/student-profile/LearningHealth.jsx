import Card from "../../components/Card";
import Section from "../../components/Section";
const A = "#F4B400";



export default function LearningHealth({ s }) {
    return (

        <Section title="Learning Health">
            <div className="grid grid-cols-4 gap-3">
                {[
                    { title: "Learning Health Index", value: `${s.lhi}%`, sub: "Quiz, streak & attendance." },
                    { title: "Consistency", value: `${s.consistency}%`, sub: "Weekly activity frequency." },
                    { title: "Engagement", value: `${s.engagement}%`, sub: "Videos & exercises rate." },
                    { title: "Dropout Risk", value: `${s.dropout_risk}%`, sub: "Risk factor analysis." },
                ].map(({ title, value, sub }, i) => {
                    const isRed = i === 3;
                    return (
                        <Card key={title} className={`p-4 border-none shadow-none bg-neutral-50/50  dark:bg-gradient-to-br  dark:from-[#19160D]   dark:via-[#14130F]   dark:to-[#2A2206] 
      
        ${isRed ? "!bg-red-50/30" : ""}`}>
                            <div className="flex flex-col">
                                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] dark:text-white ${isRed ? "text-red-400" : "text-neutral-400"}`}>
                                    {title}
                                </span>
                                <span className={`text-2xl font-black mt-1   ${isRed
                                    ? "text-red-500"
                                    : "text-neutral-900 dark:text-[#fcfcfb]"
                                    }`}>
                                    {value}
                                </span>
                                <span className="text-[10px] text-neutral-400 mt-1 leading-snug">
                                    {sub}
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </Section>

    );
}