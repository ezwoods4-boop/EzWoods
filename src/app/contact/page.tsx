'use client'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData = {
      action: 'CONTACT_FORM_SUBMISSION',
      customerInfo: {
        name: formData.name,
        email: formData.email
      },
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    console.log('Contact Form Data for Backend:', contactData);

    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subtitle: 'Monday - Friday, 9AM - 6PM'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@luxehome.com',
      subtitle: 'We\'ll respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Showroom',
      details: '123 Furniture Street',
      subtitle: 'Design City, DC 12345'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: 'Mon-Sat: 10AM-7PM',
      subtitle: 'Sunday: 12PM-5PM'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl font-bold text-furniture-darkBrown mb-4">
          Contact Us
        </h1>
        <p className="font-inter text-lg text-furniture-charcoal max-w-2xl mx-auto">
          Have a question about our furniture or need design advice? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <h2 className="font-playfair text-2xl font-bold text-furniture-darkBrown mb-6">
            Get in Touch
          </h2>
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-furniture-sand">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <info.icon className="w-6 h-6 text-furniture-sage mt-1" />
                    <div>
                      <h3 className="font-inter font-semibold text-furniture-darkBrown">
                        {info.title}
                      </h3>
                      <p className="font-inter text-furniture-charcoal">
                        {info.details}
                      </p>
                      <p className="font-inter text-sm text-gray-600">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <Card className="mt-6 border-furniture-sand">
            <CardContent className="p-0">
              <div className="h-64 bg-furniture-sand rounded-lg flex items-center justify-center">
                <p className="font-inter text-furniture-charcoal">Map Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="border-furniture-sand">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl text-furniture-darkBrown">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="product">Product Question</SelectItem>
                      <SelectItem value="order">Order Support</SelectItem>
                      <SelectItem value="design">Design Consultation</SelectItem>
                      <SelectItem value="warranty">Warranty Claim</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-furniture-brown hover:bg-furniture-darkBrown font-inter"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mt-6 border-furniture-sand">
            <CardHeader>
              <CardTitle className="font-inter">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-inter font-semibold text-furniture-darkBrown mb-2">
                    What is your return policy?
                  </h4>
                  <p className="font-inter text-sm text-furniture-charcoal">
                    We offer a 30-day return policy for all items in original condition.
                  </p>
                </div>
                <div>
                  <h4 className="font-inter font-semibold text-furniture-darkBrown mb-2">
                    Do you offer white glove delivery?
                  </h4>
                  <p className="font-inter text-sm text-furniture-charcoal">
                    Yes, we offer white glove delivery service for an additional fee. This includes setup and packaging removal.
                  </p>
                </div>
                <div>
                  <h4 className="font-inter font-semibold text-furniture-darkBrown mb-2">
                    Can I schedule a design consultation?
                  </h4>
                  <p className="font-inter text-sm text-furniture-charcoal">
                    Absolutely! Our design team offers both in-store and virtual consultations to help you create the perfect space.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
