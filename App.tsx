import React from 'react';
import { Hero } from './components/Hero';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-blue selection:text-white">
      <Hero />
      <main className="container mx-auto">
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;