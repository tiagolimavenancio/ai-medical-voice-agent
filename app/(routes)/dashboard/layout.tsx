import AppHeader from "@/app/(routes)/dashboard/_components/AppHeader";

function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen  px-6 md:px-20 lg:px-40 py-10">
      <AppHeader />
      {children}
    </div>
  );
}

export default DashboardLayout;
