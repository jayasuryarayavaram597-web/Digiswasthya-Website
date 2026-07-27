import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function Blogs() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="bg-primary-900 text-white py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Our Blogs</h1>
            </section>
            <div className="container py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {Array(6).fill("Blog Post").map((item, i) => (
                        <div key={i} className="bg-white border-2 border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:border-primary-500">
                            {/* Placeholder Image */}
                            <div className="h-48 bg-gray-300 flex items-center justify-center text-gray-500 font-bold">
                                Blog Image {i + 1}
                            </div>
                            <div className="p-6">
                                <span className="text-xs font-bold text-white bg-primary-600 px-2 py-1 rounded shadow-sm inline-block mb-3">HEALTHCARE</span>
                                <h3 className="font-bold text-2xl text-gray-900 mb-3 leading-tight">Transforming Rural Healthcare {i + 1}</h3>
                                <p className="text-gray-700 font-medium text-base mb-6 line-clamp-3">
                                    How technology is bridging the gap between urban specialists and rural patients, ensuring timely diagnosis and effective treatment for underserved communities.
                                </p>
                                <Button variant="link" className="px-0 text-primary-700 font-bold text-lg hover:text-primary-900">
                                    Read Full Article &rarr;
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
