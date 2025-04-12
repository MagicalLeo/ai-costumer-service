// app/privacy/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Privacy() {
  const [activeSection, setActiveSection] = useState<string | null>("introduction");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header with visual design */}
          <div className="bg-indigo-600 dark:bg-indigo-800 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-indigo-200 text-base max-w-2xl mx-auto">
              Your privacy is important to us. This page explains how we collect, use, and protect your data.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar for navigation */}
            <div className="md:w-64 bg-gray-50 dark:bg-gray-900 p-6">
              <nav className="sticky top-6">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => scrollToSection("introduction")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "introduction"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Introduction
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("collection")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "collection"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Information Collection
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("usage")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "usage"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      How We Use Your Data
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("sharing")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "sharing"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Information Sharing
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("cookies")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "cookies"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Cookies Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("rights")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "rights"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Your Rights
                    </button>
                  </li>
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/register" 
                    className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to registration
                  </Link>
                </div>
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 md:p-10">
              <div className="prose dark:prose-invert max-w-none">
                <section id="introduction" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    At our company, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                    disclose, and safeguard your information when you use our platform.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use your data to provide and improve our services. By using our platform, you agree to the 
                    collection and use of information in accordance with this policy. 
                  </p>
                </section>

                <section id="collection" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information Collection</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We collect several different types of information for various purposes to provide and improve 
                    our services to you:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Data</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    While using our service, we may ask you to provide certain personally identifiable information 
                    that can be used to contact or identify you, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Usage Data</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may also collect information on how you access and use our services. This Usage Data may include 
                    information such as your computer's Internet Protocol address, browser type, browser version, 
                    the pages you visit, the time and date of your visit, the time spent on those pages, and other 
                    diagnostic data.
                  </p>
                </section>

                <section id="usage" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Data</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We use the collected data for various purposes:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li>To provide and maintain our service</li>
                    <li>To notify you about changes to our service</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information so that we can improve our service</li>
                    <li>To monitor the usage of our service</li>
                    <li>To detect, prevent and address technical issues</li>
                  </ul>
                </section>

                <section id="sharing" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Information Sharing</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We may share your personal information in the following situations:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li><strong>With Service Providers:</strong> We may share your information with service providers we use to support our business.</li>
                    <li><strong>For Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</li>
                    <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                    <li><strong>With Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
                    <li><strong>With Business Partners:</strong> We may share your information with our business partners to offer you certain products, services or promotions.</li>
                  </ul>
                </section>

                <section id="cookies" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies Policy</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We use cookies and similar tracking technologies to track the activity on our service and 
                    hold certain information.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Cookies are files with a small amount of data which may include an anonymous unique identifier. 
                    Cookies are sent to your browser from a website and stored on your device. You can instruct your 
                    browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Examples of Cookies we use:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li><strong>Session Cookies:</strong> We use Session Cookies to operate our service.</li>
                    <li><strong>Preference Cookies:</strong> We use Preference Cookies to remember your preferences and various settings.</li>
                    <li><strong>Security Cookies:</strong> We use Security Cookies for security purposes.</li>
                  </ul>
                </section>

                <section id="rights" className="scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You have certain data protection rights. If you wish to be informed what personal data we hold 
                    about you and if you want it to be removed from our systems, please contact us.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    In certain circumstances, you have the following data protection rights:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li>The right to access, update or delete the information we have on you</li>
                    <li>The right of rectification - the right to have your information corrected if it is inaccurate or incomplete</li>
                    <li>The right to object - the right to object to our processing of your personal data</li>
                    <li>The right of restriction - the right to request that we restrict the processing of your personal information</li>
                    <li>The right to data portability - the right to be provided with a copy of your personal data in a structured, machine-readable format</li>
                    <li>The right to withdraw consent - the right to withdraw your consent at any time</li>
                  </ul>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Last updated: April 12, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}