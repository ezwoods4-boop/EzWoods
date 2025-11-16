
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Truck, Leaf } from 'lucide-react';
import Image from 'next/image';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality Craftsmanship',
      description: 'Every piece is carefully crafted with attention to detail and built to last for generations.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide exceptional service every step of the way.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your furniture to you as soon as possible.'
    },
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'We use eco-friendly materials and processes to minimize our environmental impact.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="font-playfair text-5xl font-bold text-furniture-darkBrown mb-6">
          About Luxe Home
        </h1>
        <p className="font-inter text-lg text-furniture-charcoal max-w-3xl mx-auto leading-relaxed">
          For over two decades, Luxe Home has been crafting exceptional furniture that transforms 
          houses into homes. We believe that every piece should tell a story, combining timeless 
          design with modern functionality.
        </p>
      </section>

      {/* Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-6">
            Our Story
          </h2>
          <div className="space-y-4 font-inter text-furniture-charcoal">
            <p>
              Founded in 2000 by master craftsman Robert Chen, Luxe Home began as a small 
              workshop dedicated to creating custom furniture pieces. What started with a 
              passion for woodworking has grown into a premier furniture destination.
            </p>
            <p>
              Today, we work with skilled artisans from around the world, combining traditional 
              techniques with contemporary design. Each piece in our collection is carefully 
              selected for its quality, craftsmanship, and ability to enhance your living space.
            </p>
            <p>
              Our commitment to excellence extends beyond our products. We believe in building 
              lasting relationships with our customers, providing personalized service, and 
              ensuring that every purchase exceeds expectations.
            </p>
          </div>
        </div>
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=400&fit=crop&crop=center"
            alt="Craftsman working on furniture"
            width={600}
            height={400}
            className="rounded-lg shadow-lg w-full h-[400px] object-cover"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="font-playfair text-3xl font-bold text-furniture-darkBrown text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center border-furniture-sand">
              <CardContent className="p-6">
                <value.icon className="w-12 h-12 text-furniture-sage mx-auto mb-4" />
                <h3 className="font-inter font-semibold text-furniture-darkBrown mb-2">
                  {value.title}
                </h3>
                <p className="font-inter text-sm text-furniture-charcoal">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="font-playfair text-3xl font-bold text-furniture-darkBrown text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Robert Chen',
              role: 'Founder & Master Craftsman',
              image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop&crop=center'
            },
            {
              name: 'Sarah Johnson',
              role: 'Design Director',
              image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop&crop=center'
            },
            {
              name: 'Michael Torres',
              role: 'Customer Experience Manager',
              image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop&crop=center'
            }
          ].map((member, index) => (
            <Card key={index} className="text-center border-furniture-sand">
              <CardContent className="p-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-inter font-semibold text-furniture-darkBrown mb-1">
                  {member.name}
                </h3>
                <p className="font-inter text-sm text-furniture-sage">
                  {member.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-furniture-cream rounded-lg p-12 text-center">
        <h2 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-6">
          Our Mission
        </h2>
        <p className="font-inter text-lg text-furniture-charcoal max-w-4xl mx-auto leading-relaxed">
          To create beautiful, functional furniture that enhances the way people live. We believe 
          that your home should be a reflection of your personality, and our pieces are designed 
          to help you create spaces that inspire, comfort, and bring joy to your daily life.
        </p>
      </section>
    </div>
  );
};

export default About;
