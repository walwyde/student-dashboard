import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { DashboardLayout } from "@/src/pages/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useToast } from "@/src/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { set } from "date-fns";

const StudentProfile = () => {

  const { user, profile, loading} = useAuth() as any;

  const { toast } = useToast();

  const [profileData, setProfileData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  // Form state
  const [studentId, setStudentId] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [program, setProgram] = useState("");

    useEffect(() => {
    if (profile !==null) {
        setProfileData(profile);
        setStudentId(profile.student_id || "");
        setStudyYear(profile.study_year ? profileData.study_year.toString() : "");
        setProgram(profile.program || "");
     }
  }, [profileData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        setSaving(true);
      toast({
        title: "Success",
        description: "Student profile updated successfully",
        });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        type: "background",
        draggable: true,
      });
    } finally {
      setSaving(false);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Profile</h1>
          <p className="text-muted-foreground">
            Manage your student information and details
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile?.full_name || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={profile?.role || ""} disabled className="capitalize" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studyYear">Study Year</Label>
                  <Select value={studyYear} onValueChange={setStudyYear} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your study year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                      <SelectItem value="5">Year 5</SelectItem>
                      <SelectItem value="6">Year 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Input
                    id="program"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="e.g. Computer Science, Medicine"
                    required
                  />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;