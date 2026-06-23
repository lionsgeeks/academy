import { Users, User } from 'lucide-react';
import { TransText } from '@/components/TransText';

const Cards = ({ img, promo, classNum, formation, date, coach, studentsNum, ...props }) => {
    const formationImage = formation === 'coding'
        ? 'https://www.ko2.co.uk/wp-content/uploads/2024/03/Embedded-C-Code-Edit.jpg.webp'
        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjzj2qptS9O_tX5Dspr3CdYekxYuCILcs5EA&s';

    return (
        <div className="overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-border">
            {/* Image section */}
            <div className="relative h-32 overflow-hidden bg-muted">
                <img
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    src={formationImage}
                    alt={`${formation} ${classNum}`}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-alpha/5 to-alpha/10" />
            </div>

            {/* Content section */}
            <div className="p-5">
                {/* Title and type */}
                <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-card-foreground">
                            {formation} {classNum}
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 rounded-full text-foreground bg-alpha">
                            P{promo}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <TransText en="Class" fr="Classe" ar="الفصل" /> {classNum}
                    </p>
                </div>

                {/* Info row */}
                <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-card-foreground font-medium">
                            {coach || <TransText en="Unassigned" fr="Non assigné" ar="غير معين" />}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-card-foreground font-medium">
                            {studentsNum} <TransText en="students" fr="étudiants" ar="الطلاب" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cards;
