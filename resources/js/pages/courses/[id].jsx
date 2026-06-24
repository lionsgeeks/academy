import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';


export default function CourseDetails({ courses = [] }) {
    
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Courses Detail',
                    href: CourseDetails(),
                },
            ]}
        >
            <Head title="Courses" />


            {/* //^^ chabab  import your component here tawa7d maycodi hna  khdmo dakchi  fl partials then  importiwh   */}


        </AppLayout>
    );
}
