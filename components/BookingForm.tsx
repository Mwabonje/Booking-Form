import React, { useState } from 'react';
import { Sparkles, Loader2, Send, AlertCircle, CheckCircle2, Check } from 'lucide-react';
import { BookingFormData, FormErrors, SubjectOption } from '../types';
import { refineMessageWithGemini } from '../services/geminiService';

const INITIAL_DATA: BookingFormData = {
  firstName: '',
  lastName: '',
  email: '',
  confirmEmail: '',
  phone: '',
  socialHandle: '',
  subject: '',
  typeOfShoot: [],
  date: '',
  preferredContact: '',
  message: '',
  budget: ''
};

export const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const current = prev.typeOfShoot;
      const updated = checked 
        ? [...current, value]
        : current.filter(item => item !== value);
      return { ...prev, typeOfShoot: updated };
    });
    
    if (errors.typeOfShoot) {
      setErrors(prev => ({ ...prev, typeOfShoot: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = "Emails do not match";
    if (!formData.phone.trim()) newErrors.phone = "Whatsapp contact is required";
    if (!formData.subject) newErrors.subject = "Please select a subject";
    
    // Only validate conditional fields if subject is selected
    if (formData.subject) {
      if (formData.typeOfShoot.length === 0) newErrors.typeOfShoot = "Please select at least one type of shoot";
      
      if (!formData.date) {
        newErrors.date = "Please select a preferred date";
      } else {
        // Preferred contact is only required/visible if date is selected
        if (!formData.preferredContact) newErrors.preferredContact = "Please select a contact method";
      }
    }

    if (!formData.message.trim()) newErrors.message = "Please enter a message";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      // Provide immediate feedback to the user
      alert("Please fill in all required fields marked in red.");
      
      // Attempt to scroll to the first error after a short delay to allow React to render the error states
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.text-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/mqeerdnk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData(INITIAL_DATA);
      } else {
        const data = await response.json();
        console.error("Formspree error:", data);
        alert("There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was a network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiRefine = async () => {
    if (!formData.message || formData.message.length < 5) return;
    
    setIsRefining(true);
    const refined = await refineMessageWithGemini(formData.message, formData.subject || "Photography Inquiry");
    setFormData(prev => ({ ...prev, message: refined }));
    setIsRefining(false);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center animate-fade-in flex flex-col items-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">Thank You</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-lg">
          Your inquiry has been received. I will be in touch shortly to discuss your vision.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setFormData(INITIAL_DATA); }}
          className="bg-brand-blue text-white px-8 py-3 text-sm font-medium hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 shadow-sm"
        >
          Back to Form
        </button>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-12 transition-colors duration-500">
        Contact/Booking Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Name Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Your Name <span className="text-red-500 text-xs ml-1">(Required)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors ${errors.firstName ? 'border-red-500' : ''}`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">First</span>
              {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors ${errors.lastName ? 'border-red-500' : ''}`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">Last</span>
              {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="space-y-2 pt-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Email <span className="text-red-500 text-xs ml-1">(Required)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors ${errors.email ? 'border-red-500' : ''}`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">Email Address</span>
              {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
            </div>
            <div>
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                className={`w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors ${errors.confirmEmail ? 'border-red-500' : ''}`}
              />
              <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">Confirm Email Address</span>
              {errors.confirmEmail && <span className="text-red-500 text-xs">{errors.confirmEmail}</span>}
            </div>
          </div>
        </div>

        {/* Whatsapp Contact Section */}
        <div className="space-y-2 pt-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Whatsapp Contact <span className="text-red-500 text-xs ml-1">(Required)</span>
          </label>
          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-2 pt-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Social Media Handle (Instagram, TikTok, Linkden...etc.) <span className="text-gray-500 dark:text-gray-500 text-xs ml-1 font-light">(Optional)</span>
          </label>
          <div>
            <input
              type="text"
              name="socialHandle"
              value={formData.socialHandle}
              onChange={handleChange}
              className="w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors"
            />
          </div>
        </div>

        {/* Subject Section */}
        <div className="space-y-2 pt-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
            Subject <span className="text-red-500 text-xs ml-1">(Required)</span>
          </label>
          <div className="relative">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full border border-gray-300 dark:border-neutral-700 rounded px-4 py-3 bg-white dark:bg-brand-surface text-gray-900 dark:text-gray-100 focus:border-black dark:focus:border-white outline-none appearance-none transition-colors ${errors.subject ? 'border-red-500' : ''}`}
            >
              <option value="" disabled className="dark:text-gray-500">Select a subject...</option>
              {Object.values(SubjectOption).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject}</span>}
          </div>
        </div>

        {/* Conditional Fields: Type of Shoot, Date & Preferred Contact */}
        {formData.subject && (
          <div className="space-y-8 animate-fade-in">
            {/* Type of Shoot */}
            <div className="space-y-3 pt-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Type of Shoot <span className="text-red-500 text-xs ml-1">(Required - Select at least one)</span>
              </label>
              <div className="space-y-2">
                {['Photography', 'Videography', 'Drone Services'].map((option) => {
                  const isChecked = formData.typeOfShoot.includes(option);
                  return (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="typeOfShoot"
                          value={option}
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          className="sr-only" 
                        />
                        <div className={`w-5 h-5 border rounded-full flex items-center justify-center transition-all duration-200 ${
                          isChecked 
                            ? 'bg-brand-blue border-brand-blue' 
                            : 'border-gray-400 dark:border-neutral-600 bg-transparent group-hover:border-brand-blue'
                        }`}>
                           <Check size={12} className={`text-white transition-opacity duration-200 ${isChecked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-light group-hover:text-black dark:group-hover:text-white transition-colors">{option}</span>
                    </label>
                  );
                })}
              </div>
              {errors.typeOfShoot && <span className="text-red-500 text-xs mt-1 block">{errors.typeOfShoot}</span>}
            </div>

            {/* Budget Section */}
            <div className="space-y-2 pt-4">
               <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Estimated Budget <span className="text-gray-500 dark:text-gray-500 text-xs ml-1 font-light">(Optional)</span>
              </label>
              <div>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                   className="w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors"
                   placeholder="e.g. $500 - $1000"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-3 pt-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Preferred Date <span className="text-red-500 text-xs ml-1">(Required)</span>
              </label>
              <div>
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full border-b border-gray-400 dark:border-neutral-700 focus:border-black dark:focus:border-white outline-none py-2 bg-transparent text-gray-900 dark:text-gray-100 transition-colors ${errors.date ? 'border-red-500' : ''}`}
                />
                {errors.date && <span className="text-red-500 text-xs mt-1 block">{errors.date}</span>}
              </div>
            </div>

            {/* Preferred Contact - Conditional on Date */}
            {formData.date && (
              <div className="space-y-3 pt-4 animate-fade-in">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Preferred Method Of Contact <span className="text-red-500 text-xs ml-1">(Required)</span>
                </label>
                <div className="space-y-2">
                  {['Email', 'Whatsapp'].map((option) => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={option}
                        checked={formData.preferredContact === option}
                        onChange={handleChange}
                        className="w-5 h-5 border-gray-300 text-brand-blue focus:ring-brand-blue focus:ring-offset-0"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-light group-hover:text-black dark:group-hover:text-white transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredContact && <span className="text-red-500 text-xs mt-1 block">{errors.preferredContact}</span>}
              </div>
            )}
          </div>
        )}

        {/* Message Section */}
        <div className="space-y-2 pt-4 relative">
          <div className="flex justify-between items-center">
             <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              Ask me anything <span className="text-red-500 text-xs ml-1">(Required)</span>
            </label>
            <button
              type="button"
              onClick={handleAiRefine}
              disabled={isRefining || !formData.message}
              className="text-xs flex items-center gap-1.5 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full"
              title="Use AI to polish your inquiry"
            >
              {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {isRefining ? 'Polishing...' : 'AI Polish'}
            </button>
          </div>
         
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full border border-gray-300 dark:border-neutral-700 rounded p-4 bg-white dark:bg-brand-surface text-gray-900 dark:text-gray-100 focus:border-black dark:focus:border-white outline-none resize-y transition-colors ${errors.message ? 'border-red-500' : ''}`}
              placeholder="Tell me about your project, your vision, and potential dates..."
            />
             {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-blue text-white px-8 py-3 text-sm font-medium hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};