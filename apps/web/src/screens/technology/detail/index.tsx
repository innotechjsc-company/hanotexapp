"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTechnologyDetail } from "./hooks/useTechnologyDetail";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import ConfidentialDetailCard from "./components/ConfidentialDetailCard";
import IpDetailsCard from "./components/IpDetailsCard";
import OwnersCard from "./components/OwnersCard";
import SidebarContactCard from "./components/SidebarContactCard";
import PricingCard from "./components/PricingCard";
import TechnologyMetaCard from "./components/TechnologyMetaCard";
import ContactModal from "./components/ContactModal";

interface TechnologyDetailScreenProps {
  id?: string;
}

export default function TechnologyDetailScreen({
  id,
}: TechnologyDetailScreenProps) {
  const {
    technology,
    loading,
    error,
    isAuthenticated,
    categoryName,
    getStatusColor,
    getStatusLabel,
    getTrlLabel,
    showContactForm,
    contactForm,
    contactSubmitting,
    hasContacted,
    onOpenContact,
    onCloseContact,
    onContactChange,
    onSubmitContact,
  } = useTechnologyDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">
            {error || "Không tìm thấy công nghệ"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={technology?.title}
        status={technology?.status}
        trl_level={technology?.trl_level}
        categoryName={categoryName}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        getTrlLabel={getTrlLabel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SummaryCard
              summary={technology?.public_summary || technology?.description}
            />
            <ConfidentialDetailCard
              confidential_detail={technology?.confidential_detail}
              isAuthenticated={Boolean(isAuthenticated)}
            />
            <IpDetailsCard ip_details={technology?.ip_details} />
            <OwnersCard owners={technology?.owners} />
          </div>

          <div className="space-y-6">
            <SidebarContactCard
              owner={technology?.owner || technology?.submitter}
              onContact={onOpenContact}
              hasContacted={hasContacted}
            />
            <PricingCard pricing={technology?.pricing} />
            <TechnologyMetaCard
              trl_level={technology?.trl_level}
              categoryName={categoryName}
              status={technology?.status}
              created_at={technology?.created_at}
              createdAt={technology?.createdAt}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
            />
          </div>
        </div>
      </div>

      <ContactModal
        open={showContactForm}
        onClose={onCloseContact}
        onSubmit={onSubmitContact}
        onChange={onContactChange}
        value={contactForm}
        loading={contactSubmitting}
      />
    </div>
  );
}
