import { useRef } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/seperator";
import { Badge } from "@/src/components/ui/badge";
import { Download, Printer } from "lucide-react";

interface StudentIDCardProps {
  student: {
    full_name: string;
    student_id: string;
    study_year: number;
    program: string;
    profile_image_url?: string;
  };
  profile: {
    email: string;
    user_id: string;
  };
}

const StudentIDCard = ({ student, profile }: StudentIDCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate a simple barcode-like pattern using the student ID
  const generateBarcode = (studentId: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    if (ctx) {
      ctx.fillStyle = '#000000';
      let x = 10;
      
      // Create a pattern based on student ID
      for (let i = 0; i < studentId.length; i++) {
        const charCode = studentId.charCodeAt(i);
        const width = (charCode % 5) + 2;
        const height = 40;
        
        if (i % 2 === 0) {
          ctx.fillRect(x, 5, width, height);
        }
        x += width + 2;
      }
      
      // Add some random bars for visual effect
      for (let i = 0; i < 10; i++) {
        const width = Math.random() * 3 + 1;
        const height = 35 + Math.random() * 10;
        ctx.fillRect(x, 10, width, height);
        x += width + 1;
      }
    }
    
    return canvas.toDataURL();
  };

  const handlePrint = () => {
    if (cardRef.current) {
      const printContent = cardRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      document.body.innerHTML = `
        <div style="padding: 20px; background: white;">
          ${printContent}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleDownload = () => {
    // Create a simple download of ID card info as text
    const cardData = `
UNIVERSITY STUDENT ID CARD
==========================
Name: ${student.full_name}
Student ID: ${student.student_id}
Program: ${student.program}
Year: ${student.study_year}
Email: ${profile.email}
Generated: ${new Date().toLocaleDateString()}
==========================
`;

    const blob = new Blob([cardData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-id-${student.student_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const barcodeImage = generateBarcode(student.student_id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Student ID Card</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto" ref={cardRef}>
        <CardContent className="p-6">
          {/* University Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-primary">UNIVERSITY NAME</h3>
            <p className="text-sm text-muted-foreground">Student Identification Card</p>
          </div>

          <Separator className="mb-4" />

          {/* Student Photo and Basic Info */}
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={student.profile_image_url} alt={student.full_name} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(student.full_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-foreground">{student.full_name}</h4>
              <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
              <Badge variant="secondary" className="mt-1">
                Year {student.study_year}
              </Badge>
            </div>
          </div>

          {/* Program and Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Program:</span>
              <span className="text-sm font-medium">{student.program}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valid Until:</span>
              <span className="text-sm font-medium">
                {new Date(new Date().getFullYear() + 1, 11, 31).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Barcode */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Scan for verification</p>
            <img 
              src={barcodeImage} 
              alt="Student ID Barcode" 
              className="mx-auto border rounded"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <p className="text-xs text-muted-foreground mt-1">{student.student_id}</p>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              This card is the property of the University
            </p>
            <p className="text-xs text-muted-foreground">
              If found, please return to Student Services
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentIDCard;