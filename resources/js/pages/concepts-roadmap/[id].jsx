import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import CourseConceptRoadmap from './index';


export default function CourseConceptRoadmapPage({ course }) {
    return (
        <AppSidebarLayout>
            <Head title="Concepts Roadmap" />
            <CourseConceptRoadmap course={course} />
        </AppSidebarLayout>
    );
}
