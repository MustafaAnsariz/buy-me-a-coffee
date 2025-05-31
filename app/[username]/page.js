import PaymentPage from "@/components/PaymentPage";

export default async function Page(props) {
  const params = await props.params;
  return (
    <>
      <PaymentPage username={params.username} />
    </>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params; // Await params in case it's a Promise
  const username = resolvedParams.username;
  return {
    title: `Support ${username} - Buy Me a Coffee`,
  }
}
