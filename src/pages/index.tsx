import { Button } from "@/src/pages/components/ui/button";
import Link from "next/link";
import { GraduationCap, CreditCard, Users, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-8">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              University ID System
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Digital student identification cards with secure barcode verification. 
              Access your courses, lecturers, and academic information in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth">Login</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Digital ID Cards</h3>
            <p className="text-muted-foreground">
              Generate official student ID cards with secure barcodes that can be printed on demand.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Course Management</h3>
            <p className="text-muted-foreground">
              View your enrolled courses, study year information, and connect with lecturers.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Admin Dashboard</h3>
            <p className="text-muted-foreground">
              Comprehensive admin tools for managing students, courses, and lecturers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
