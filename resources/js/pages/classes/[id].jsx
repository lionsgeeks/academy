import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';


export default function ClasseDetails({ courses = [] , data }) {
    
    console.log(data);
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Courses Detail',
                    href: ClasseDetails(),
                },
            ]}
        >
            <Head title="Classe details" /> 

            {/* //^^ chabab  import your component here tawa7d maycodi hna  khdmo dakchi  fl partials then  importiwh   */}


        </AppLayout>
    );
}