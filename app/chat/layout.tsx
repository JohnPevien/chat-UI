import Conversations from '../../components/Conversations';
import Link from 'next/link';

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
                    className="fixed top-0 left-0 z-40 h-screen max-h-screen w-64 -translate-x-full overflow-y-auto transition-transform sm:translate-x-0"
                    aria-label="Sidebar"
                >
                    <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
                        <div className="mb-3">
                            <h2 className="text-xl">Conversations</h2>
                        </div>
                        <div>
                            <Conversations />
                        </div>

                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/"
                                        className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        Home
                                        {/* <span className="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            Pro
                                        </span> */}
                                    </Link>
                                </li>
                                <li>
                                    <button className="flex w-full items-center rounded-lg p-2 text-left text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                        Settings
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>
                <main className="max-h-screen sm:ml-64">{children}</main>
            </body>
        </html>
    );
}
