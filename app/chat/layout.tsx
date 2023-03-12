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
                <aside
                    id="default-sidebar"
                    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <h1 className="mb-6 text-3xl mx-auto font-bold text-center">
                            Chat UI
                        </h1>

                        <div className="mb-3">
                            <h2 className="text-xl">Conversations</h2>
                        </div>
                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <span className="flex-1 ml-3 whitespace-nowrap">
                                            Home
                                        </span>
                                        {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                            Pro
                                        </span> */}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <span className="flex-1 ml-3 whitespace-nowrap">
                                            Settings
                                        </span>
                                        {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                            3
                                        </span> */}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>
                <main className="sm:ml-64 p-5">{children}</main>
            </body>
        </html>
    );
}
