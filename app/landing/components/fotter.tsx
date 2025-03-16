import { strawberry, hackerMedium } from "@/fonts/font";
import React from "react";

export const KampusFooter = () => {
  return (
    <footer className="bg-white border-t-4 rounded-sm border-gray-200  px-6 sm:p-10 mb-10 mt-40">
      <div className="flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0  pt-6">
        <div>
          <a
            href="#"
            className="text-6xl  font-bold text-primary"
            style={strawberry.style}
          >
            KAMPUS
          </a>
          <p className="text-gray-500 mt-2">
            &copy; 2023 Kampus. All rights reserved.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <h4
              className="text-[#09090B] font-medium mb-2"
              style={hackerMedium.style}
            >
              Main Pages
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Discussions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Clubs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Academy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  People
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="text-[#09090B] font-medium mb-2"
              style={hackerMedium.style}
            >
              Tools
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Competitions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Launch Pad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Store
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="text-[#09090B] font-medium mb-2"
              style={hackerMedium.style}
            >
              Resources
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Privacy
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Brand Kit
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="text-[#09090B] font-medium mb-2"
              style={hackerMedium.style}
            >
              Connect
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
