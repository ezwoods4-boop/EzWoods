import connectDB from '@/utils/connectDB';
import { Service, IService } from '@/models/service';
import { notFound } from 'next/navigation';
import ServiceDetailClient from '@/components/services/ServiceDetailClient'; // We will create this next
import type { Metadata } from 'next';

// This function runs on the server to generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ serviceId: string }> }): Promise<Metadata> {
  try {
    await connectDB();
    const { serviceId } = await params;
    const service = await Service.findById(serviceId).lean();
    
    if (!service) {
      return { title: 'Service Not Found' };
    }

    const plainService = JSON.parse(JSON.stringify(service)) as IService;
    return {
      title: `${plainService.name} | Luxe Home Services`,
      description: plainService.description,
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return { title: 'Error' };
  }
}

// This is the main async Server Component for the page
export default async function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  try {
    await connectDB();
    const { serviceId } = await params;

    const service = await Service.findById(serviceId).lean().exec();

    if (!service) {
      notFound();
    }
    
    // Convert the Mongoose document to a plain object to pass to the Client Component
    const plainService = JSON.parse(JSON.stringify(service));
    
    // Pass the fetched data to the Client Component for rendering the interactive parts
    return <ServiceDetailClient service={plainService} />;

  } catch (error) {
    console.error('Error fetching service:', error);
    // If the ID is not a valid MongoDB ObjectId, findById will throw an error
    notFound();
  }
}

