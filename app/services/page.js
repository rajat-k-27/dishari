'use client';

import { motion } from 'framer-motion';
import { FaGamepad, FaDesktop, FaWifi, FaPrint, FaCoffee, FaUsers, FaHeadset, FaClock, FaDollarSign, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import Button from '@/components/Button';

const services = [
  {
    icon: FaGamepad,
    title: 'Gaming Stations',
    description: 'High-performance gaming PCs with latest graphics cards, mechanical keyboards, and gaming mice.',
    features: ['RTX 4080 Graphics', 'Intel i9 Processors', '144Hz Monitors', 'RGB Peripherals'],
    price: 'From $5/hour',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: FaDesktop,
    title: 'Standard Browsing',
    description: 'Fast computers for web browsing, email, social media, and general productivity tasks.',
    features: ['High-Speed Internet', 'Office Suite', 'Printing Available', 'Comfortable Seating'],
    price: 'From $2/hour',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: FaWifi,
    title: 'Premium WiFi',
    description: 'Ultra-fast fiber optic internet with no bandwidth limits for your personal devices.',
    features: ['100 Mbps Speed', 'Secure Connection', 'Device Support', 'Coverage Everywhere'],
    price: 'Free with any service',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: FaPrint,
    title: 'Printing & Scanning',
    description: 'Professional quality printing, scanning, and photocopying services.',
    features: ['Color Printing', 'High Resolution', 'Multiple Formats', 'Fast Service'],
    price: '$0.10 per page',
    color: 'from-orange-500 to-orange-700',
  },
  {
    icon: FaCoffee,
    title: 'Café Services',
    description: 'Fresh coffee, snacks, and beverages to keep you energized throughout your session.',
    features: ['Fresh Coffee', 'Energy Drinks', 'Snacks', 'Cold Beverages'],
    price: 'See menu',
    color: 'from-yellow-600 to-yellow-800',
  },
  {
    icon: FaUsers,
    title: 'Private Rooms',
    description: 'Dedicated gaming rooms for teams, parties, and group events.',
    features: ['Up to 10 People', 'Private Space', 'Team Gaming', 'Event Hosting'],
    price: 'From $50/hour',
    color: 'from-red-500 to-red-700',
  },
];

const packages = [
  {
    name: 'Casual',
    price: '$20',
    duration: 'per 5 hours',
    features: [
      '5 hours of gaming/browsing',
      'Free WiFi access',
      '1 free beverage',
      'Standard seating',
    ],
    popular: false,
  },
  {
    name: 'Enthusiast',
    price: '$50',
    duration: 'per 15 hours',
    features: [
      '15 hours of gaming/browsing',
      'Free WiFi access',
      '3 free beverages',
      'Priority seating',
      '10% off café purchases',
    ],
    popular: true,
  },
  {
    name: 'Pro Gamer',
    price: '$100',
    duration: 'per month',
    features: [
      'Unlimited gaming/browsing',
      'Free WiFi access',
      'Unlimited beverages',
      'Reserved station',
      '20% off café purchases',
      'Tournament entry',
    ],
    popular: false,
  },
];

const additionalServices = [
  {
    icon: FaHeadset,
    title: 'Tech Support',
    description: 'Need help? Our technical staff is always ready to assist you.',
  },
  {
    icon: FaClock,
    title: '24/7 Availability',
    description: 'We\'re open round the clock for your convenience.',
  },
  {
    icon: FaDollarSign,
    title: 'Flexible Pricing',
    description: 'Pay-as-you-go or choose from our affordable packages.',
  },
  {
    icon: FaStar,
    title: 'Member Benefits',
    description: 'Loyalty rewards and special discounts for regular customers.',
  },
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center gradient-bg text-white overflow-hidden">
        {/* Animated Background Bubbles */}
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 40 + 10;
          const delay = Math.random() * 8;
          const duration = Math.random() * 8 + 10;
          const startX = Math.random() * 100;
          const startY = 100 + Math.random() * 20;
          
          return (
            <motion.div
              key={i}
              animate={{
                y: [0, typeof window !== 'undefined' ? -window.innerHeight - 100 : -1000],
                x: [0, Math.sin(i) * 50, Math.cos(i) * 30],
                opacity: [0, 0.4, 0.6, 0.4, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
              }}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              }}
            />
          );
        })}

        <div className="container-custom relative z-10 text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-primary-100">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-50"
          >
            Everything you need for an exceptional cyber café experience
          </motion.p>
        </div>
      </section>

      {/* Main Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We <span className="text-gradient">Offer</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional services tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card group cursor-pointer overflow-hidden"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} rounded-full text-white text-3xl mb-4`}
                >
                  <service.icon />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-4">{service.description}</p>

                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-2xl font-bold text-primary-600">{service.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pricing <span className="text-gradient">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the package that fits your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative card ${
                  pkg.popular
                    ? 'ring-4 ring-primary-500 shadow-2xl'
                    : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary-600">{pkg.price}</span>
                    <span className="text-gray-600 ml-2">{pkg.duration}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-start"
                    >
                      <FaStar className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={pkg.popular ? 'primary' : 'outline'}
                  size="lg"
                >
                  Choose Plan
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Additional <span className="text-gradient">Benefits</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More reasons to choose Dishari
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full text-white text-4xl mb-4 shadow-lg"
                >
                  <service.icon />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-primary-50">
              Visit us today or contact us to learn more about our services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl">
                  Contact Us
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl">
                  Visit Our Shop
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
