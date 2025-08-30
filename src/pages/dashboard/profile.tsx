import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { supabase } from "@/src/integrations/supabase/client";
import { DashboardLayout } from "@/src/pages/dashboard";
import StudentIDCard from "@/src/components/StudentIdCard";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

const StudentIDCardPage = () => {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student ID Card</h1>
            <p className="text-muted-foreground">
              Your official digital student identification
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">Profile Setup Required</h3>
                <p className="text-muted-foreground">
                  Please complete your student profile to generate your ID card.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/student-profile">
                  Complete Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StudentIDCard
        student={student}
        profile={{
          email: user?.email ?? "",
          user_id: user?.id ?? ""
        }}
      />
    </DashboardLayout>
  );
};

export default StudentIDCardPage;