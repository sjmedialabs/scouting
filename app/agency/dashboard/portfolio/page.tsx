"use client";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PortfolioHeader from "@/components/provider/portfolio/PortfolioHeader";
import CompanyOverviewCard from "@/components/provider/portfolio/CompanyOverviewCard";
import FocusAreasCard from "@/components/provider/portfolio/FocusAreasCard";
import ServiceLines from "@/components/provider/portfolio/ServiceLines";
import PricingSnapshot from "@/components/provider/portfolio/PricingSnapshot";
import PortfolioGrid from "@/components/provider/portfolio/PortfolioGrid";
import Testimonials from "@/components/provider/portfolio/Testimonials";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";

export default function ProviderPortfolioPage() {
  const { user, loading } = useCurrentUser();

  const [provider, setProvider] = useState<any>(null);
  const [responseLoading, setResponseLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const loadData = async () => {
    if (!user?.userId) return;

    setResponseLoading(true);
    setFailed(false);

    try {
      const res = await authFetch(`/api/providers/${user.userId}`);
      const data = await res.json();
      setProvider(data.provider);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      loadData();
    }
  }, [loading, user]);

  /* Loading */
  if (responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  console.log("Fetched Provider data::",provider)

  /* Error */
  if (failed) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="font-semibold">Failed to retrieve data</h1>
        <Button onClick={loadData} className="mt-2">
          Reload
        </Button>
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PortfolioHeader />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <CompanyOverviewCard provider={provider} />
          <ServiceLines provider={provider} />
          <PricingSnapshot provider={provider} />
          <PortfolioGrid provider={provider} />
          <Testimonials testimonials={provider.testimonials} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <FocusAreasCard provider={provider} />
        </div>
      </div>
    </div>
  );
}
