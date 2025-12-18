import React from 'react';
import AHeader from './_components/AHeader';
import { Toaster } from "@/components/ui/sonner"
function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen  px-6 md:px-20 lg:px-40 py-10">
      <AHeader />
      {children}
        <Toaster />
    </div>
  );
}

export default DashboardLayout;
