import type {Metadata} from 'next';
export const metadata: Metadata = {title: 'Reflexões · área editorial', robots: {index: false, follow: false}};
export default function AdminReflectionsLayout({children}: {children: React.ReactNode}) { return children; }
