'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaHeart, FaLightbulb, FaUsers, FaAward, FaRocket } from 'react-icons/fa';

const values = [
  {
    icon: FaHeart,
    title: 'Customer First',
    description: 'We prioritize customer satisfaction above all else.',
  },
  {
    icon: FaLightbulb,
    title: 'Innovation',
    description: 'Constantly evolving with the latest technology and trends.',
  },
  {
    icon: FaUsers,
    title: 'Community',
    description: 'Building a welcoming space for everyone.',
  },
  {
    icon: FaAward,
    title: 'Quality',
    description: 'Premium equipment and services every time.',
  },
];

const milestones = [
  {
    year: '2020',
    title: 'Founded',
    description: 'Dishari Cyber Café opened its doors with 20 gaming stations.',
  },
  {
    year: '2021',
    title: 'Expansion',
    description: 'Expanded to 50+ stations and introduced private gaming rooms.',
  },
  {
    year: '2022',
    title: 'Award Winner',
    description: 'Recognized as Best Cyber Café in the region.',
  },
  {
    year: '2023',
    title: 'Going Digital',
    description: 'Launched online shop and booking system.',
  },
  {
    year: '2024',
    title: 'Growing Strong',
    description: 'Serving 500+ happy customers monthly.',
  },
];

const team = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    description: 'Passionate gamer and tech enthusiast with 10+ years experience.',
  },
  {
    name: 'Priya Sharma',
    role: 'Operations Manager',
    description: 'Ensuring smooth operations and customer satisfaction daily.',
  },
  {
    name: 'Amit Patel',
    role: 'Tech Lead',
    description: 'Maintaining cutting-edge equipment and infrastructure.',
  },
];

export default function AboutPage() {
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
            About <span className="text-primary-100">Dishari</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-50"
          >
            Where technology meets community, and gaming becomes an experience
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Founded in 2020, Dishari Cyber Café began with a simple vision: to create
                  a space where technology enthusiasts could come together, game, work, and
                  connect in a comfortable environment.
                </p>
                <p>
                  What started as a small café with 20 gaming stations has grown into a
                  thriving community hub with over 50 state-of-the-art workstations, private
                  gaming rooms, and a full-service café.
                </p>
                <p>
                  Today, we're proud to serve hundreds of satisfied customers every month,
                  offering not just services, but memorable experiences that keep people
                  coming back.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg flex items-center justify-center text-white"
                  >
                    <FaRocket className="text-6xl opacity-80" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="card text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full text-white text-3xl mb-4"
                >
                  <value.icon />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that shaped who we are today
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex items-start mb-12 last:mb-0"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                >
                  {milestone.year}
                </motion.div>
                <div className="ml-8 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Dishari
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="card text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold"
                >
                  {member.name.charAt(0)}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Dishari?
            </h2>
            <p className="text-xl text-primary-50 max-w-2xl mx-auto">
              Here's what sets us apart from the rest
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'State-of-the-art gaming equipment',
              'Ultra-fast fiber optic internet',
              'Comfortable and spacious environment',
              'Affordable pricing packages',
              'Professional and friendly staff',
              '24/7 availability',
              'Premium snacks and beverages',
              'Regular events and tournaments',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <FaCheckCircle className="text-primary-200 text-2xl flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
