import React from 'react';
import Link from 'next/link';
import { Target } from 'lucide-react';
import { FaTwitter, FaInstagram, FaGithub, FaDiscord } from 'react-icons/fa';

export function Footer() {
    return (
        <footer className="bg-[#fcfcfc] text-black py-16 border-t border-gray-200 font-['Courier_New']">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-12 lg:gap-12">

                    {/* Brand - Full width on mobile, 2 cols on desktop */}
                    <div className="col-span-3 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img
                                src="/assist/guide/brutalist_logo.png"
                                alt="MyTracker Logo"
                                className="h-8 w-8 object-cover rounded-md grayscale hover:grayscale-0 transition-all duration-300"
                            />
                            <span className="text-2xl font-black uppercase tracking-tight">MyTracker</span>
                        </Link>
                        <p className="text-gray-600 font-medium max-w-xs">
                            Track your goals. Build habits. Achieve your dreams.
                        </p>
                    </div>

                    {/* Product - 1 col */}
                    <div className="col-span-1">
                        <h4 className="font-bold mb-4 lg:mb-6 text-sm lg:text-base">Product</h4>
                        <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-gray-600 font-medium">
                            <li><Link href="/home" className="hover:text-black transition-colors">Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company - 1 col */}
                    <div className="col-span-1">
                        <h4 className="font-bold mb-4 lg:mb-6 text-sm lg:text-base">Company</h4>
                        <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-gray-600 font-medium">
                            <li><Link href="#" className="hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Support - 1 col */}
                    <div className="col-span-1">
                        <h4 className="font-bold mb-4 lg:mb-6 text-sm lg:text-base">Support</h4>
                        <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-gray-600 font-medium">
                            <li><Link href="/help" className="hover:text-black transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Follow Us - Full width on mobile, 1 col on desktop */}
                    <div className="col-span-3 lg:col-span-1 lg:mt-0">
                        <h4 className="font-bold mb-4 lg:mb-6 text-sm lg:text-base">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-all">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-all">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-all">
                                <FaGithub size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-all">
                                <FaDiscord size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
                    © 2026 MyTracker. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
