import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Tabs from './partials/Tabs';
import AppLayout from '@/layouts/app-layout';
import LiveStreamBanner from './partials/LiveStreamBanner';

export default function ClasseDetails({ courses = [] , data }) {
       const [selectedStudent, setSelectedStudent] = useState(null);
    console.log(data);
    return (
        <AppLayout
           breadcrumbs={[
    {
        title: 'Courses Detail',
        href: '/classes',
    },
]}
        >
            <Head title="Classe details" /> 

            {/* //^^ chabab  import your component here tawa7d maycodi hna  khdmo dakchi  fl partials then  importiwh   */}

            {/* live stram banner  */}
  {!selectedStudent && <LiveStreamBanner />}
<Tabs
    students={data.students}
    coach={data.coach}
    selectedStudent={selectedStudent}
    setSelectedStudent={setSelectedStudent}
/>
        </AppLayout>
    );
}