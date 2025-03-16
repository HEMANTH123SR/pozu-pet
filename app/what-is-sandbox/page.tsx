"use client";
import {
  Star,
  ArrowDown,
  LucideMonitor,
  ArrowRight,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
  Rocket,
  Globe,
  Code,
  Youtube,
  Laptop,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { hackerMedium } from "@/fonts/font";

// // Feature data
const features = [
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Chat & Connect",
    description:
      "Join discussions about everything from coding problems to college life. Share ideas, get help, and make friends!",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-white" />,
    title: "Join the Gang (Clubs)",
    description:
      "Create or join clubs that match your interests. Run events, organize competitions, or just hang out with like-minded peers.",
  },
  {
    icon: <Globe className="w-6 h-6 text-white" />,
    title: "Smart College Finder",
    description:
      "Chat directly with seniors from your dream college. Get real insights about campus life and placements.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-white" />,
    title: "Show Off Your Talent",
    description:
      "Built a cool app? Started a YouTube channel? Show it all off on your profile with LinkedIn integration.",
  },
  {
    icon: <Trophy className="w-6 h-6 text-white" />,
    title: "Events & Competitions",
    description:
      "Stay updated with hackathons, quiz competitions, and more. Participate, win prizes, and build your network.",
  },
  {
    icon: <Rocket className="w-6 h-6 text-white" />,
    title: "Beyond Academics",
    description:
      "A platform that celebrates all your talents, not just your grades. Show the world what makes you special!",
  },
];

// // Benefits data
const benefits = [
  {
    icon: <Users className="w-4 h-4 text-white" />,
    title: "Students Only",
    description:
      "A dedicated space exclusively for college students to connect and collaborate.",
  },
  {
    icon: <Code className="w-4 h-4 text-white" />,
    title: "Real Connections",
    description:
      "Direct access to seniors and peers who share your interests and ambitions.",
  },
  {
    icon: <Youtube className="w-4 h-4 text-white" />,
    title: "Complete Profile",
    description:
      "Seamless LinkedIn integration to build your professional presence while having fun.",
  },
  {
    icon: <Laptop className="w-4 h-4 text-white" />,
    title: "Beyond Books",
    description:
      "Showcase all your talents and achievements, academic and beyond.",
  },
];

const stats = [
  { value: "3+", label: "Active Students" },
  { value: "0+", label: "College Clubs" },
  { value: "0+", label: "Events Hosted" },
  { value: "0+", label: "Partner Universities" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    college: "PES University",
    text: "Sandbox helped me find my coding community. Now I'm part of an amazing tech club and we're building incredible projects together!",
  },
  {
    name: "Rahul Menon",
    college: "Christ University",
    text: "The college search feature is a game-changer. Talking to seniors gave me insights I couldn't find anywhere else.",
  },
  {
    name: "Aisha Patel",
    college: "RV College",
    text: "The college search feature is a game-changer. Talking to seniors gave me insights I couldn't find anywhere else.",
  },
];

const WhatIsSandbox = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Dynamic grid background */}
            <div className="absolute inset-0 bg-grid-blue-500/[0.05] bg-[length:50px_50px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-7">
          <div className="text-center mb-20">
            <div
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-[#0056FE] mb-6">
                <Star className="w-4 h-4 mr-2" /> Welcome to the Future of
                Student Communities
              </span>
              <h1
                className="text-6xl font-bold text-gray-900 mb-6 leading-tight"
                style={hackerMedium.style}
              >
                Where College Students <br />
                <span className="text-[#0056FE] inline-block mt-2 relative">
                  Create Magic! 🚀
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8.5C52 2.5 159.5 2.5 298 8.5"
                      stroke="#0056FE"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                A vibrant ecosystem where students connect, collaborate, and
                create amazing things together. Join thousands of students
                already transforming their college journey!
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-[#0056FE] text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2 shadow-lg hover:shadow-xl">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white text-[#0056FE] px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2 border-2 border-[#0056FE]">
                  <span>Learn More</span>
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Platform Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-gradient-to-b from-[#0056FE] to-blue-600 rounded-t-2xl p-4 shadow-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <img
                src="/sandbox-interface.png"
                alt="Sandbox Platform Interface"
                className="rounded-lg w-full shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-12 -mt-20 relative z-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-t-0 rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-[#0056FE] mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-12 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-blue-500/[0.05] bg-[length:30px_30px]" />
            <div className="relative z-10">
              <h2
                className="text-4xl font-bold text-gray-900 mb-8"
                style={hackerMedium.style}
              >
                The Story Behind Sandbox
              </h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="leading-relaxed">
                  During my BCA days in Bengaluru, I noticed something
                  interesting. Even though I was in a computer course, finding
                  people who were genuinely into coding was super hard. Many
                  talented students were losing their spark because they felt
                  alone in their interests.
                </p>
                <p className="leading-relaxed mt-4">
                  {`That's when Sandbox was born - a friendly platform just for
                  college students like you and me. A place where passion meets
                  opportunity, and where every student can find their tribe.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-gray-900 mb-4"
              style={hackerMedium.style}
            >
              {` What You'll Find Here`}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make your college journey extraordinary
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#0056FE] rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <a
                  href="#"
                  className="text-[#0056FE] font-medium inline-flex items-center"
                >
                  Learn more <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Preview Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-gray-900 mb-4"
              style={hackerMedium.style}
            >
              Experience Sandbox
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a look at what makes Sandbox the ultimate platform for
              college students
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent pointer-events-none" />
            <img
              src="/sandbox-interface.png"
              alt="Sandbox Platform Interface"
              className="shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            style={hackerMedium.style}
          >
            What Makes Sandbox Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#0056FE] rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold text-center text-gray-900 mb-16"
            style={hackerMedium.style}
          >
            What Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#0056FE] font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.college}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-[#0056FE] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl font-bold text-white mb-8"
            style={hackerMedium.style}
          >
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            {`Join Sandbox today and be part of a community that celebrates what
            makes you unique. In true Bengaluru style - let's innovate,
            collaborate, and make something awesome!`}
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-[#0056FE] px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2">
              <span>Join Sandbox Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600/50 transition-colors inline-flex items-center space-x-2 border-2 border-white">
              <span>Watch Demo</span>
              <LucideMonitor className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatIsSandbox;
