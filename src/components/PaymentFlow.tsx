"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

interface PaymentFlowProps {
  language?: "english" | "arabic" | "hindi";
  onPaymentSuccess?: (planId: string) => void;
  onPaymentError?: (error: string) => void;
}

const PaymentFlow = ({
  language = "english",
  onPaymentSuccess = () => {},
  onPaymentError = () => {},
}: PaymentFlowProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay">(
    "stripe",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<string, string>
    > = {
      english: {
        choosePlan: "Choose Your Plan",
        paymentMethod: "Payment Method",
        cardPayment: "Card Payment",
        upiPayment: "UPI Payment",
        walletPayment: "Wallet Payment",
        processPayment: "Process Payment",
        processing: "Processing...",
        paymentSuccess: "Payment Successful!",
        paymentFailed: "Payment Failed",
        retryPayment: "Retry Payment",
        securePayment: "Secure Payment",
        popular: "Popular",
        free: "Free",
        premium: "Premium",
        features: "Features",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        upiId: "UPI ID",
        selectWallet: "Select Wallet",
      },
      arabic: {
        choosePlan: "اختر خطتك",
        paymentMethod: "طريقة الدفع",
        cardPayment: "دفع بالبطاقة",
        upiPayment: "دفع UPI",
        walletPayment: "دفع بالمحفظة",
        processPayment: "معالجة الدفع",
        processing: "جاري المعالجة...",
        paymentSuccess: "تم الدفع بنجاح!",
        paymentFailed: "فشل الدفع",
        retryPayment: "إعادة المحاولة",
        securePayment: "دفع آمن",
        popular: "شائع",
        free: "مجاني",
        premium: "مميز",
        features: "الميزات",
        cardNumber: "رقم البطاقة",
        expiryDate: "تاريخ الانتهاء",
        cvv: "CVV",
        upiId: "معرف UPI",
        selectWallet: "اختر المحفظة",
      },
      hindi: {
        choosePlan: "अपना प्लान चुनें",
        paymentMethod: "भुगतान विधि",
        cardPayment: "कार्ड भुगतान",
        upiPayment: "UPI भुगतान",
        walletPayment: "वॉलेट भुगतान",
        processPayment: "भुगतान प्रक्रिया",
        processing: "प्रसंस्करण...",
        paymentSuccess: "भुगतान सफल!",
        paymentFailed: "भुगतान असफल",
        retryPayment: "पुनः प्रयास",
        securePayment: "सुरक्षित भुगतान",
        popular: "लोकप्रिय",
        free: "मुफ्त",
        premium: "प्रीमियम",
        features: "सुविधाएं",
        cardNumber: "कार्ड नंबर",
        expiryDate: "समाप्ति तिथि",
        cvv: "CVV",
        upiId: "UPI ID",
        selectWallet: "वॉलेट चुनें",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  const plans: PaymentPlan[] = [
    {
      id: "free",
      name: getLocalizedText("free"),
      price: 0,
      currency: "INR",
      features: [
        "10 AI tutor queries/day",
        "Basic quizzes",
        "Limited flashcards",
        "Basic progress tracking",
      ],
    },
    {
      id: "premium",
      name: getLocalizedText("premium"),
      price: 299,
      currency: "INR",
      features: [
        "Unlimited AI tutor queries",
        "All quiz modules",
        "Unlimited flashcards",
        "Advanced analytics",
        "Offline mode",
        "Priority support",
      ],
      popular: true,
    },
  ];

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    setPaymentStatus("idle");

    try {
      // Simulate payment gateway call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPaymentStatus("success");
      onPaymentSuccess(selectedPlan);
    } catch (error) {
      setPaymentStatus("error");
      onPaymentError("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">{getLocalizedText("cardNumber")}</Label>
          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">{getLocalizedText("expiryDate")}</Label>
            <Input id="expiry" placeholder="MM/YY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">{getLocalizedText("cvv")}</Label>
            <Input id="cvv" placeholder="123" type="password" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto space-y-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText("choosePlan")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${plan.price}/mo</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>{getLocalizedText("paymentMethod")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "stripe" | "razorpay")
              }
            >
              <TabsList>
                <TabsTrigger value="stripe">Stripe</TabsTrigger>
                <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
              </TabsList>
              <TabsContent value="stripe">{renderPaymentForm()}</TabsContent>
              <TabsContent value="razorpay">{renderPaymentForm()}</TabsContent>
            </Tabs>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-4"
            >
              {isProcessing
                ? getLocalizedText("processing")
                : getLocalizedText("processPayment")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentFlow;
