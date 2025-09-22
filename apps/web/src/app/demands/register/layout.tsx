export const dynamic = "force-dynamic";
export const revalidate = false;

export default function RegisterDemandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
