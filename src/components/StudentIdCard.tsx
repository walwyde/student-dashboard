import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/seperator";
import { Badge } from "@/src/components/ui/badge";
import { Download, Printer } from "lucide-react";
import { generateBarcode } from "../lib/generate-barcode";
import universityLogo from "../public/images/universityLogo.png"; // Ensure your build setup supports image imports

// const universityLogo = "../public/images/universityLogo.png"; // Replace with your university logo path
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
  // const generateBarcode = (studentId: string) => {
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');
  //   canvas.width = 200;
  //   canvas.height = 45;
    
  //   if (ctx) {
  //     ctx.fillStyle = '#000000';
  //     let x = 5;
      
  //     // Create a pattern based on student ID
  //     for (let i = 0; i < studentId.length; i++) {
  //       const charCode = studentId.charCodeAt(i);
  //       const width = (charCode % 6) + 4;
  //       const height = 100;
        
  //       if (i % 2 === 0) {
  //         ctx.fillRect(x, 5, width, height);
  //       }
  //       x += width + 1;
  //     }
      
  //     // Add some random bars for visual effect
  //     for (let i = 0; i < 5; i++) {
  //       const width = Math.random() * 3 + 10;
  //       const height = 100 + Math.random() * 10;
  //       ctx.fillRect(x, 1, width, height);
  //       x += width + 1;
  //     }
  //   }
    
  //   return canvas.toDataURL();
  // };

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

  // ...rest of your imports

  const [barcodeImage, setBarcodeImage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBarcodeImage(generateBarcode(student.student_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.student_id]);
  const [flipped, setFlipped] = useState(false);

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

     <div
     className="relative mx-auto aspect-[1.586/1] w-[442px] cursor-pointer [perspective:1000px]"
  onClick={() => setFlipped((f) => !f)}
  ref={cardRef}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT FACE */}
        <Card className="absolute inset-0 h-full w-full rounded-md border bg-white shadow-md [backface-visibility:hidden]">
          <CardContent className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
            {/* Watermark */}
            <Image
            width={100}
            height={100}

              src={universityLogo}
              alt="Logo watermark"
              className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
            />

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-2">
                <Image
                width={100}
                height={100}
                  src={universityLogo}
                  alt="Baze University Logo"
                  className="mx-auto w-14 mb-1"
                />
                <h3 className="text-base font-bold text-primary uppercase">
                  BASE UNIVERSITY STUDENT ID
                </h3>
                <p className="text-xs text-muted-foreground">
                  Student Identification Card
                </p>
              </div>

              <Separator className="mb-2" />

              {/* Student Info */}
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="w-16 h-16 border">
                  <AvatarImage src={student.profile_image_url} alt={student.full_name} />
                  <AvatarFallback className="text-sm font-semibold">
                    {student.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground leading-tight">
                    {student.full_name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    ID: {student.student_id}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0.5">
                    Year {student.study_year}
                  </Badge>
                </div>
              </div>

              {/* More Info */}
              <div className="text-[11px] space-y-1 mb-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Program:</span>
                  <span className="font-medium">{student.program}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium truncate">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span className="font-medium">
                    {new Date(new Date().getFullYear() + 1, 11, 31).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Separator className="mb-2" />

              <div className="text-center text-[9px] leading-tight text-muted-foreground">
                <p>Tap to flip card</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BACK FACE */}
        <Card className="absolute inset-0 h-full w-full rounded-md border bg-white shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <CardContent className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
            {/* Watermark */}
            <Image
            width={100}
            height={100}
              src={universityLogo}
              alt="Logo watermark"
              className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
            />

            <div className="relative flex flex-col h-full justify-between">
              <div className="flex flex-col items-center justify-center flex-1">
                <p className="text-[10px] text-muted-foreground mb-1">
                  Scan for verification
                </p>
                <Image
                width={100}
                height={100}
                  src={barcodeImage}
                  alt="Student ID Barcode"
                  className="border rounded-sm bg-white"
                  style={{ maxWidth: "80%", height: "32px" }}
                />
              </div>

              <div className="text-center text-[9px] leading-tight text-muted-foreground mt-2">
                <p>This card is the property of the University</p>
                <p>If found, please return to Student Services</p>
                <p className="mt-1">Tap to flip back</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    </div>
  );
};

export default StudentIDCard;