"use client";

import { NegotiationDetailsScreen } from "@/screens/negotiation-details-screen";
import { useParams } from "next/navigation";

export default function NegotiationDetailsPage() {
  const params = useParams();
  const proposalId = params.id as string;

  return <NegotiationDetailsScreen proposalId={proposalId} />;
}
