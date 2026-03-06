"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, XCircle, Settings, Zap } from "lucide-react";

// Mock payment methods (replace with API later)
const mockPaymentMethods = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept international credit/debit cards via Stripe.",
    status: "connected",
    enabled: true,
    icon: CreditCard,
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Popular Indian payment gateway for businesses.",
    status: "not_connected",
    enabled: false,
    icon: Zap,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Accept PayPal payments from global customers.",
    status: "connected",
    enabled: false,
    icon: CreditCard,
  },
];

export default function PaymentMethodsPage() {
  const [gateways, setGateways] = useState(mockPaymentMethods);
  const [loading, setLoading] = useState(false);

  /*
  -------------------------------------------------------
  OPTIONAL: Load real payment gateways from backend API
  -------------------------------------------------------
  useEffect(() => {
    async function loadMethods() {
      const res = await authFetch("/api/admin/payment-methods");
      const data = await res.json();
      setGateways(data);
    }
    loadMethods();
  }, []);
  */

  const toggleGateway = async (id: string) => {
    setLoading(true);

    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g)),
    );

    console.log(`Toggled payment method: ${id}`);

    // Future API call:
    // await authFetch("/api/admin/payment-methods/toggle", {
    //   method: "POST",
    //   body: JSON.stringify({ id }),
    // });

    setLoading(false);
  };

  const openSettings = (id: string) => {
    console.log("Open settings for:", id);
    // Will later navigate to /admin/payment-methods/[id]
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payment Methods</h1>
        <p className="text-gray-500">
          Manage supported payment gateways for subscriptions and billing.
        </p>
      </div>

      {/* Payment Gateway List */}
      <div className="space-y-6">
        {gateways.map((gateway) => (
          <div
            key={gateway.id}
            className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              {/* Left Section */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow">
                  <gateway.icon className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {gateway.name}
                  </h3>
                  <p className="text-gray-500 mt-1">{gateway.description}</p>

                  {/* Status */}
                  <div className="mt-3">
                    {gateway.status === "connected" ? (
                      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Not Connected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col gap-3">
                {/* Enable / Disable */}
                <Button
                  className={`${
                    gateway.enabled
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                  disabled={loading}
                  onClick={() => toggleGateway(gateway.id)}
                >
                  {gateway.enabled ? "Enabled" : "Enable"}
                </Button>

                {/* Settings */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => openSettings(gateway.id)}
                >
                  <Settings className="w-4 h-4" /> Configure
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-semibold mb-2">Payment Method Notes</h3>
        <p className="text-gray-600">
          Enabled payment methods will appear during checkout for subscription
          and billing payments. Configure keys and credentials to activate new
          gateways.
        </p>
      </div>
    </div>
  );
}
