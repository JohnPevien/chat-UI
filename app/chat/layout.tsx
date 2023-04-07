import SideBar from './Sidebar';

import '../globals.css';

export const metadata = {
    title: 'Chat UI',
    description: 'Chat GPT in a more intuitive UI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SideBar />
                <main className="relative max-h-screen sm:ml-64">
                    {children}
                </main>
            </body>
        </html>
    );
}
