'use client';

import Conversations from '@/components/Conversations';
import Link from 'next/link';
import { useState } from 'react';

type Props = {};
const SideBar = ({}: Props) => {
    const [showMobileNav, setShowMobileNav] = useState(false);

    const toggleMobileNav = () => {
        setShowMobileNav(!showMobileNav);
    };
    return (
        <>
            <aside
                id="default-sidebar"
                className={`fixed left-0 top-0 z-40 h-screen max-h-screen w-64  ${
                    showMobileNav ? 'translate-x-0' : '-translate-x-full'
                } overflow-y-auto transition-transform sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full max-h-screen overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
                    <div className="mb-3">
                        <h2 className="text-xl">Conversations</h2>
                    </div>
                    <div>
                        <Conversations setShowMobileNav={setShowMobileNav} />
                    </div>

                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <button className="flex w-full items-center rounded-lg p-2 text-left text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    Settings
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            <div className="mb-10 flex justify-end bg-gray-800 p-4 sm:hidden">
                <button
                    className=" cursor-pointer sm:hidden"
                    onClick={toggleMobileNav}
                >
                    <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
                            fill="#fff"
                        />
                    </svg>
                </button>
            </div>
        </>
    );
};
export default SideBar;
