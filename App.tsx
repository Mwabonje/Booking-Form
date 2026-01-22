import React from 'react';
import { Hero } from './components/Hero';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-blue selection:text-white transition-colors duration-500">
      <Hero />
      <main className="container mx-auto">
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;