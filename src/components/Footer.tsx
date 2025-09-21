import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SafeNurse</h3>
            <p className="text-gray-600 text-sm">
              Sistem manajemen keperawatan yang aman dan terpercaya untuk meningkatkan kualitas pelayanan kesehatan.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Dashboard</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Patients</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Reports</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2024 SafeNurse. All rights reserved. Developed for Kemenkes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;