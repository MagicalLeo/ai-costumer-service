// app/terms/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Terms() {
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
            <h1 className="text-4xl font-bold text-white mb-2">Terms and Conditions</h1>
            <p className="text-indigo-200 text-base max-w-2xl mx-auto">
              Please read these terms carefully before using our platform
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
                      onClick={() => scrollToSection("usage")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "usage"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Usage and Restrictions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("accounts")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "accounts"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Accounts
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("intellectual")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "intellectual"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Intellectual Property
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("termination")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === "termination"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      Termination
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
                    Welcome to our platform. These Terms and Conditions govern your use of our website and services.
                    By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any
                    part of the terms, you may not access the service.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    These Terms apply to all visitors, users, and others who access or use our services. By accessing 
                    or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, 
                    then you may not access the Service.
                  </p>
                </section>

                <section id="usage" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Usage and Restrictions</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Our platform is provided for your personal and non-commercial use. You may not modify, copy, distribute,
                    transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell
                    any information, software, products, or services obtained from our platform without our prior written permission.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    You agree not to use our platform:
                  </p>
                  <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                    <li>In any way that violates any applicable national or international law or regulation</li>
                    <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the platform</li>
                    <li>To impersonate or attempt to impersonate our company, an employee, another user, or any other person</li>
                    <li>To engage in any activity that could harm or disrupt our systems or security</li>
                  </ul>
                </section>

                <section id="accounts" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Accounts</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    When you create an account with us, you must provide accurate, complete, and up-to-date information.
                    You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    You agree to notify us immediately of any unauthorized access to or use of your username or password.
                    We reserve the right to terminate your account if you provide inaccurate, false, or incomplete information,
                    or if you fail to comply with these Terms.
                  </p>
                </section>

                <section id="intellectual" className="mb-10 scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Our platform and its original content, features, and functionality are owned by us and are protected
                    by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    You may not use our logo, trademark, or other proprietary information without our prior written consent.
                    You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of our platform without
                    our express written permission.
                  </p>
                </section>

                <section id="termination" className="scroll-mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Termination</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
                    including if you breach these Terms. Upon termination, your right to use our platform will immediately cease.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    All provisions of the Terms which by their nature should survive termination shall survive termination,
                    including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
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