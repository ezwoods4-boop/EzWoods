import { Button } from '@/components/ui/button';
import { Service, IService } from '@/models/service';
import connectDB from '@/utils/connectDB';
import ServiceGrid from '@/components/services/ServiceGrid'; // Import your ServiceGrid

// This function runs on the server to fetch all necessary data for the page
async function getServicesData() {
  try {
    await connectDB();
    
    // Fetch all active services from the database, sorted by newest first
    const services = await Service.find({ status: 'active' }).sort({ createdAt: -1 }).lean().exec();

    // Return the data as plain objects, safe to pass to components
    return JSON.parse(JSON.stringify(services)) as IService[];
  } catch (error) {
    console.error("Failed to fetch services data:", error);
    // Return an empty array on error to prevent the page from crashing
    return [];
  }
}

// This is an async Server Component
const ServicesPage = async () => {
  // Fetch the data on the server before rendering
  const services = await getServicesData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-furniture-cream via-white to-furniture-sand/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-furniture-charcoal to-furniture-brown text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
            Our Design Services
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Transform your space with our professional interior design and renovation services. From concept to completion.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-playfair font-bold text-furniture-charcoal mb-2">
              Available Services
            </h2>
            <p className="text-furniture-charcoal/70">
              Showing {services.length} service{services.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Pass the server-fetched data directly to your ServiceGrid component */}
          <ServiceGrid services={services} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-furniture-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Schedule a consultation with our design experts and bring your vision to life.
          </p>
          <Button 
            size="lg" 
            className="bg-furniture-brown hover:bg-furniture-brown/90 text-white px-8 py-3 text-lg"
          >
            Book Free Consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

