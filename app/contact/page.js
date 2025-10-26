'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: 'Address',
    content: '123 Cyber Street, Tech City, TC 12345',
    color: 'from-red-500 to-red-700',
  },
  {
    icon: FaPhone,
    title: 'Phone',
    content: '+1 (555) 123-4567',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: FaEnvelope,
    title: 'Email',
    content: 'info@dishari.com',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: FaClock,
    title: 'Hours',
    content: 'Open 24/7',
    color: 'from-purple-500 to-purple-700',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Message sent successfully!', {
          icon: '✉️',
          style: {
            borderRadius: '10px',
            background: '#22c55e',
            color: '#fff',
          },
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setAlert({
          show: true,
          type: 'success',
          message: 'Thank you! We\'ll get back to you within 24-48 hours.',
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.',
      });
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

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
            Contact <span className="text-primary-100">Us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-50"
          >
            Have a question? We'd love to hear from you
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-10 mb-12">
            {contactInfo.map((info, index) => (
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
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${info.color} rounded-full text-white text-2xl mb-4`}
                >
                  <info.icon />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a <span className="text-gradient">Message</span>
              </h2>

              {alert.show && (
                <div className="mb-6">
                  <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, show: false })}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full"
                  ></textarea>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <FaPaperPlane className="inline-block ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="h-80 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-6xl mb-4 mx-auto" />
                  <p className="text-xl font-semibold">Map Placeholder</p>
                  <p className="text-sm text-primary-100 mt-2">
                    Integrate Google Maps or other map service
                  </p>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-primary-50 to-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Visit Us Today!
                </h3>
                <p className="text-gray-600 mb-4">
                  We're conveniently located in the heart of Tech City. Drop by anytime
                  - we're open 24/7 to serve you!
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    Ample parking available
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    Public transport nearby
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    Wheelchair accessible
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'What are your operating hours?',
                a: 'We are open 24 hours a day, 7 days a week, including holidays.',
              },
              {
                q: 'Do I need to book in advance?',
                a: 'Walk-ins are welcome! However, we recommend booking for private rooms and during peak hours.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept cash, all major credit cards, and digital payment methods.',
              },
              {
                q: 'Can I bring my own food and drinks?',
                a: 'We have a café on-site, but you\'re welcome to bring your own snacks and beverages.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
